import { GradientText, Section } from 'astro-boilerplate-components';
import { useState } from 'react';

const CTA = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // 将 FormData 转换为对象
    const formObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formObject[key] = value.toString();
    });

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formObject).toString(),
    })
      .then(() => {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = '/thank-you/';
        }, 1500);
      })
      .catch((error) => alert(error));
  };

  return (
    <Section
      title={
        <div className="flex items-baseline justify-between">
          <div>
            Contact<GradientText> Me</GradientText>
          </div>
        </div>
      }
    >
      <div className="w-full">
        {submitted ? (
          <div className="rounded-lg bg-gradient-to-br from-sky-500/20 to-cyan-400/20 p-8 text-center backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto size-16 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-2xl font-bold text-white">留言已发送</h3>
            <p className="mt-2 text-xl text-gray-300">
              感谢您的留言！正在跳转到感谢页面...
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-left text-gray-300">
              如果您有任何问题、建议或合作意向，欢迎通过此表单与我联系。我会尽快回复您的留言。
            </p>

            <form
              name="contact"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-4 rounded-lg bg-slate-800/50 p-6 backdrop-blur-sm"
            >
              <input type="hidden" name="form-name" value="contact" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="mb-1 text-sm font-medium text-gray-300"
                  >
                    姓名
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="rounded-md border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/50"
                    placeholder="您的姓名"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="mb-1 text-sm font-medium text-gray-300"
                  >
                    邮箱
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="rounded-md border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/50"
                    placeholder="您的邮箱地址"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="message"
                  className="mb-1 text-sm font-medium text-gray-300"
                >
                  留言
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={4}
                  className="rounded-md border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/50"
                  placeholder="请输入您的留言内容..."
                  required
                ></textarea>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>所有信息均会被安全保存</span>
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-gradient-to-br from-sky-500 to-cyan-400 px-6 py-3 text-center font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-sky-600 hover:to-cyan-500 hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-600/50"
                >
                  发送留言
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </Section>
  );
};

export { CTA };
