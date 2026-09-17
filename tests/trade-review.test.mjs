import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  convert,
  verifyImages,
  writeArticle,
  publish,
} from '../scripts/trade-review.mjs';
const hash = (value) => createHash('sha256').update(value).digest('hex');
const id = '2026-09-17-SOLUSDC.P-01';
const image = Buffer.from('verified image');
const url = 'https://d28giuuiw4ud1x.cloudfront.net/example.webp';
const config = { imageHosts: ['d28giuuiw4ud1x.cloudfront.net'] };
const source = `---\ntitle: "SOL 取消机会"\ndate: "2026-09-17"\ntags: ["SOL"]\nsummary: "未回调，取消挂单机会"\nsource_thread_id: private\n---\n# 复盘\n![结构](${url})\n未提供成交与盈亏证明。\n<!-- local-evidence:start -->\n<details>\n[本机](../../../trade-review-assets/original.png)\n</details>\n<!-- local-evidence:end -->\n`;
const proof = {
  state: 'verified',
  anonymousReadHttp: 200,
  anonymousSha256: hash(image),
  bytes: image.length,
  contentType: 'image/webp',
  publicUrl: url,
};
const sources = [
  {
    compression: {
      sha256: hash(image),
      lossless: true,
      bytes: image.length,
      mime: 'image/webp',
    },
    uploads_by_hash: { [hash(image)]: proof },
  },
];
const receiptFor = (text) => ({
  status: 'complete',
  review_id: id,
  timeline_sha256: hash(text),
  images: [
    {
      publicUrl: url,
      sha256: hash(image),
      anonymousSha256: hash(image),
      upload: 'verified',
    },
  ],
});
const articleFor = (
  text = source,
  rows = sources,
  receipt = receiptFor(text)
) => convert(id, text, rows, config, receipt);

test('maps real blog fields, strips local evidence and private metadata, preserves cancelled outcome', () => {
  const article = articleFor();
  assert.match(article.markdown, /pubDate: "2026-09-17T00:00:00\+08:00"/);
  assert.match(article.markdown, /取消机会/);
  assert.match(article.markdown, /未提供成交与盈亏证明/);
  assert.doesNotMatch(
    article.markdown,
    /local-evidence|trade-review-assets|source_thread_id|<details>/
  );
  assert.equal(
    article.path,
    'src/pages/posts/trade/reviews/2026-09-17-solusdc.p-01.md'
  );
});
test('rejects stale/partial completion, old uploads and tampered hashes', () => {
  assert.throws(
    () => articleFor(source + 'changed', sources, receiptFor(source)),
    /source changed/
  );
  assert.throws(
    () =>
      articleFor(source, sources, { ...receiptFor(source), status: 'partial' }),
    /complete/
  );
  assert.throws(
    () => articleFor(source, [{ ...sources[0], uploads_by_hash: {} }]),
    /verification/
  );
  assert.throws(
    () => articleFor(source, sources, { ...receiptFor(source), images: [] }),
    /verification/
  );
});
test('rejects invalid fields, dates, duplicate YAML, internal content and unsafe markdown', () => {
  for (const text of [
    source.replace('2026-09-17"', '2026-02-31"'),
    source.replace('tags: ["SOL"]', 'tags: nope'),
    source.replace('title: "SOL 取消机会"', 'title: a\ntitle: b'),
    source.replace('<!-- local-evidence:end -->', ''),
    source + '\n/Users/linuo/file',
    source + '\n![bad](file:///etc/a)',
    source + '\n<script>alert(1)</script>',
    source + '\n[secret](https://host/file?X-Amz-Signature=abc)',
    source.replace(url, 'https://unapproved.example/x.webp'),
  ]) {
    assert.throws(() => articleFor(text));
  }
});
test('anonymous verification checks type and content hash', async () => {
  await verifyImages(
    articleFor(),
    async () =>
      new Response(image, { headers: { 'content-type': 'image/webp' } })
  );
  await assert.rejects(
    verifyImages(
      articleFor(),
      async () =>
        new Response('changed', { headers: { 'content-type': 'image/webp' } })
    ),
    /hash differs/
  );
  await assert.rejects(
    verifyImages(
      articleFor(),
      async () =>
        new Response(image, { headers: { 'content-type': 'text/html' } })
    ),
    /invalid/
  );
});
test('idempotent write refuses to overwrite a hand-written post', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'review-write-test-'));
  try {
    const article = articleFor();
    assert.equal(await writeArticle(dir, article), true);
    assert.equal(await writeArticle(dir, article), false);
    await writeFile(
      join(dir, article.path),
      '---\ntitle: user\n---\nUser text'
    );
    await assert.rejects(writeArticle(dir, article), /not owned/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
const git = (cwd, ...args) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
test('isolated publish preserves staged user work, stops on build failure, pushes only article, retry is no-op', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'review-git-test-'));
  try {
    const upstream = join(dir, 'remote.git');
    const local = join(dir, 'local');
    git(dir, 'init', '--bare', upstream);
    git(dir, 'clone', upstream, local);
    git(local, 'checkout', '-b', 'main');
    git(local, 'config', 'user.email', 'test@example.test');
    git(local, 'config', 'user.name', 'Test');
    await writeFile(join(local, 'README.md'), 'baseline');
    git(local, 'add', 'README.md');
    git(local, 'commit', '-m', 'baseline');
    git(local, 'push', 'origin', 'main');
    await writeFile(join(local, 'README.md'), 'unrelated user work');
    git(local, 'add', 'README.md');
    const before = git(local, 'status', '--porcelain');
    const settings = {
      ...config,
      remote: upstream,
      productionBranch: 'main',
      productionVerified: true,
      siteUrl: 'https://blog.example/',
    };
    const runner = (program, args, cwd) => {
      if (program === 'npm') return '';
      if (args.includes('commit')) {
        git(cwd, 'config', 'user.email', 'test@example.test');
        git(cwd, 'config', 'user.name', 'Test');
      }
      return git(cwd, ...args);
    };
    const baseline = git(upstream, 'rev-parse', 'main');
    await assert.rejects(
      publish(articleFor(), settings, {
        verify: async () => {},
        runner: (program, args, cwd) => {
          if (program === 'npm' && args.includes('build'))
            throw new Error('build failed');
          return runner(program, args, cwd);
        },
      }),
      /build failed/
    );
    assert.equal(git(upstream, 'rev-parse', 'main'), baseline);
    const first = await publish(articleFor(), settings, {
      runner,
      verify: async () => {},
    });
    assert.equal(first.status, 'published');
    assert.equal(
      git(upstream, 'diff-tree', '--no-commit-id', '--name-only', '-r', 'main'),
      articleFor().path
    );
    assert.equal(git(local, 'status', '--porcelain'), before);
    assert.equal(
      await readFile(join(local, 'README.md'), 'utf8'),
      'unrelated user work'
    );
    const second = await publish(articleFor(), settings, {
      runner,
      verify: async () => {
        throw new Error('should not run');
      },
    });
    assert.equal(second.status, 'unchanged');
    assert.equal(second.commit, first.commit);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
