#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  readFile,
  writeFile,
  mkdir,
  mkdtemp,
  rm,
  lstat,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { parseDocument } from 'yaml';
import { unified } from 'unified';
import remarkParse from 'remark-parse';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
function requireThat(ok, message) {
  if (!ok) throw new Error(message);
}
function yaml(text) {
  const doc = parseDocument(text, { uniqueKeys: true });
  requireThat(!doc.errors.length, 'Invalid or duplicate YAML fields');
  return doc.toJS({ maxAliasCount: 0 });
}
function frontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  requireThat(match, 'Missing YAML frontmatter');
  return { data: yaml(match[1]), body: text.slice(match[0].length) };
}
function publicUrl(value, hosts) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('Only public HTTPS links are allowed');
  }
  requireThat(
    url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.port &&
      (!hosts || hosts.includes(url.hostname)),
    'Unapproved public URL or signed URL'
  );
  return url;
}
export function convert(reviewId, source, sources, config, receipt) {
  requireThat(
    /^\d{4}-\d{2}-\d{2}-[A-Z0-9]+(?:\.[A-Z0-9]+)?-\d{2,}$/.test(reviewId),
    'Invalid canonical review ID'
  );
  requireThat(
    receipt?.status === 'complete' &&
      receipt.review_id === reviewId &&
      receipt.timeline_sha256 === sha256(source),
    'Missing complete receipt or source changed after completion'
  );
  const { data, body: raw } = frontmatter(source);
  for (const key of ['title', 'date', 'summary'])
    requireThat(
      typeof data[key] === 'string' && data[key].trim(),
      `Missing ${key}`
    );
  requireThat(
    /^\d{4}-\d{2}-\d{2}$/.test(data.date) &&
      new Date(`${data.date}T00:00:00Z`).toISOString().slice(0, 10) ===
        data.date &&
      reviewId.startsWith(data.date),
    'Invalid or mismatched review date'
  );
  requireThat(
    Array.isArray(data.tags) &&
      data.tags.every((x) => typeof x === 'string' && x.trim()),
    'Invalid tags'
  );
  const body = raw
    .replace(
      /<!-- (local-originals|local-evidence):start -->[\s\S]*?<!-- \1:end -->/g,
      ''
    )
    .trim();
  requireThat(
    !/local-(?:originals|evidence):/.test(body),
    'Incomplete local original index'
  );
  const publicText = [data.title, data.summary, ...data.tags, body].join('\n');
  requireThat(
    !/(?:\/Users\/|\/Volumes\/|\/private\/|file:\/\/|trade-review-assets|source_thread_id|source_log|presigned|X-Amz-|Bearer\s|(?:api[_-]?key|token|secret)\s*[:=]|\.env\b|\b[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b)/i.test(
      publicText
    ),
    'Internal metadata or credentials in public article'
  );
  const tree = unified().use(remarkParse).parse(body);
  const images = [];
  const definitions = new Map();
  const walk = (node, visit) => {
    visit(node);
    for (const child of node.children || []) walk(child, visit);
  };
  walk(tree, (node) => {
    if (node.type === 'definition') definitions.set(node.identifier, node.url);
  });
  walk(tree, (node) => {
    requireThat(
      node.type !== 'html',
      'Raw HTML is not accepted in public review markdown'
    );
    if (
      [
        'image',
        'link',
        'definition',
        'imageReference',
        'linkReference',
      ].includes(node.type)
    ) {
      const url = node.url || definitions.get(node.identifier);
      requireThat(url, 'Unresolved markdown reference');
      publicUrl(
        url,
        node.type.startsWith('image') ? config.imageHosts : undefined
      );
      if (node.type.startsWith('image'))
        images.push({ url, alt: node.alt || data.title });
    }
  });
  requireThat(images.length > 0, 'Review has no public images');
  const verified = new Map();
  for (const row of sources) {
    const compressed = row.compression;
    const proof = row.uploads_by_hash?.[compressed?.sha256];
    if (
      compressed?.lossless === true &&
      proof?.state === 'verified' &&
      proof.anonymousReadHttp === 200 &&
      proof.anonymousSha256 === compressed.sha256 &&
      proof.bytes === compressed.bytes &&
      proof.contentType === compressed.mime
    ) {
      requireThat(
        /^[a-f0-9]{64}$/.test(compressed.sha256),
        'Invalid image hash'
      );
      verified.set(proof.publicUrl, {
        sha256: compressed.sha256,
        bytes: compressed.bytes,
        mime: compressed.mime,
      });
    }
  }
  for (const image of images) {
    const proof = verified.get(image.url);
    const completion = receipt.images?.find(
      (item) => item.publicUrl === image.url
    );
    requireThat(
      proof &&
        completion?.sha256 === proof.sha256 &&
        completion.anonymousSha256 === proof.sha256 &&
        ['verified', 'reused_verified_hash'].includes(completion.upload),
      'Image lacks completed compressed-upload verification'
    );
  }
  const fields = {
    layout: '@/templates/BasePost.astro',
    title: data.title,
    description: data.summary,
    pubDate: `${data.date}T00:00:00+08:00`,
    imgSrc: images[0].url,
    imgAlt: images[0].alt,
    tags: [...new Set([...data.tags, '交易复盘'])],
    reviewId,
  };
  const markdown = `---\n${Object.entries(fields)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n')}\n---\n\n${body}\n`;
  const slug = reviewId.toLowerCase();
  return {
    reviewId,
    markdown,
    path: `src/pages/posts/trade/reviews/${slug}.md`,
    route: `/posts/trade/reviews/${slug}/`,
    images: [...new Set(images.map((i) => i.url))].map((url) => ({
      url,
      ...verified.get(url),
    })),
  };
}
export async function verifyImages(article, fetcher = fetch) {
  for (const image of article.images) {
    const response = await fetcher(image.url, {
      redirect: 'error',
      signal: AbortSignal.timeout(30000),
    });
    requireThat(
      response.ok &&
        response.headers.get('content-type')?.split(';')[0] === image.mime,
      'Public image response is invalid'
    );
    const data = Buffer.from(await response.arrayBuffer());
    requireThat(
      data.length === image.bytes && sha256(data) === image.sha256,
      'Public image hash differs from verified compression'
    );
  }
}
export async function writeArticle(directory, article) {
  const target = join(directory, article.path);
  let old;
  try {
    requireThat(
      !(await lstat(target)).isSymbolicLink(),
      'Refusing symlink article'
    );
    old = await readFile(target, 'utf8');
    requireThat(
      frontmatter(old).data.reviewId === article.reviewId,
      'Existing article is not owned by this importer'
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (old === article.markdown) return false;
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, article.markdown);
  return true;
}
function run(program, args, cwd, capture = false) {
  return execFileSync(program, args, {
    cwd,
    encoding: 'utf8',
    stdio: capture
      ? ['ignore', 'pipe', 'pipe']
      : ['ignore', 'inherit', 'inherit'],
  })?.trim();
}
export async function publish(
  article,
  config,
  { runner = run, verify = verifyImages } = {}
) {
  requireThat(
    config.productionBranch &&
      config.productionVerified === true &&
      config.siteUrl,
    'Production branch/site not verified; preview/import remain available'
  );
  publicUrl(config.siteUrl);
  const directory = await mkdtemp(join(tmpdir(), 'blog-review-'));
  try {
    runner(
      'git',
      [
        'clone',
        '--quiet',
        '--single-branch',
        '--branch',
        config.productionBranch,
        config.remote,
        directory,
      ],
      root
    );
    const changed = await writeArticle(directory, article);
    if (!changed)
      return {
        status: 'unchanged',
        commit: runner('git', ['rev-parse', 'HEAD'], directory, true),
        url: new URL(article.route, config.siteUrl).href,
      };
    await verify(article);
    runner(
      'npm',
      ['ci', '--ignore-scripts', '--no-audit', '--no-fund'],
      directory
    );
    runner('npm', ['run', 'build'], directory);
    runner('git', ['add', '--', article.path], directory);
    const staged = runner(
      'git',
      ['diff', '--cached', '--name-only'],
      directory,
      true
    );
    requireThat(
      staged === article.path,
      'Unexpected staged changes; publishing stopped'
    );
    runner(
      'git',
      [
        '-c',
        'core.hooksPath=/dev/null',
        'commit',
        '-m',
        `docs(trade): publish ${article.reviewId}`,
        '--',
        article.path,
      ],
      directory
    );
    const commit = runner('git', ['rev-parse', 'HEAD'], directory, true);
    // A concurrent update is rejected by ordinary non-forced push; rerun from fresh remote state.
    runner(
      'git',
      ['push', 'origin', `HEAD:refs/heads/${config.productionBranch}`],
      directory
    );
    return {
      status: 'published',
      commit,
      url: new URL(article.route, config.siteUrl).href,
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
async function main() {
  const { values } = parseArgs({
    options: {
      review: { type: 'string' },
      receipt: { type: 'string' },
      preview: { type: 'boolean' },
      import: { type: 'boolean' },
      publish: { type: 'boolean' },
    },
  });
  requireThat(
    values.review &&
      [values.preview, values.import, values.publish].filter(Boolean).length ===
        1,
    'Use --review <directory> and exactly one of --preview / --import / --publish'
  );
  const review = resolve(values.review);
  const config = JSON.parse(
    await readFile(join(root, 'scripts/trade-review.config.json'), 'utf8')
  );
  const source = await readFile(join(review, 'timeline.md'), 'utf8');
  const sources = JSON.parse(
    await readFile(join(review, 'screenshots/sources.json'), 'utf8')
  );
  const receipt = JSON.parse(
    await readFile(
      resolve(values.receipt || join(review, 'finish-result.json')),
      'utf8'
    )
  );
  const article = convert(
    review.split('/').at(-1),
    source,
    sources,
    config,
    receipt
  );
  let result;
  if (values.publish) result = await publish(article, config);
  else {
    await verifyImages(article);
    if (values.import) {
      const changed = await writeArticle(root, article);
      run('npm', ['run', 'build'], root);
      result = {
        status: changed ? 'imported' : 'unchanged',
        path: article.path,
      };
    } else {
      console.log(article.markdown);
      result = { status: 'preview', path: article.path };
    }
  }
  console.log(JSON.stringify(result));
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(
      JSON.stringify({
        status: 'failed',
        error: error.status
          ? 'Command failed; publishing stopped'
          : error.message,
      })
    );
    process.exitCode = 1;
  });
}
