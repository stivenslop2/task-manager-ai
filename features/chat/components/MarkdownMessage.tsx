'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownMessageProps {
  text: string
}

export default function MarkdownMessage({ text }: MarkdownMessageProps) {
  return (
    <div className="markdown-body text-sm leading-relaxed text-ink">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="mt-3 mb-2 text-base font-semibold text-ink" {...props} />,
          h2: (props) => <h2 className="mt-3 mb-2 text-sm font-semibold text-ink" {...props} />,
          h3: (props) => <h3 className="mt-3 mb-1.5 text-sm font-semibold text-ink" {...props} />,
          h4: (props) => <h4 className="mt-3 mb-1.5 text-sm font-semibold text-ink" {...props} />,
          p: (props) => <p className="my-1.5 first:mt-0 last:mb-0" {...props} />,
          ul: (props) => <ul className="my-1.5 ml-4 list-disc space-y-0.5 marker:text-ink-soft" {...props} />,
          ol: (props) => <ol className="my-1.5 ml-4 list-decimal space-y-0.5 marker:text-ink-soft" {...props} />,
          li: (props) => <li className="leading-relaxed" {...props} />,
          strong: (props) => <strong className="font-semibold text-ink" {...props} />,
          em: (props) => <em className="italic" {...props} />,
          a: (props) => (
            <a
              className="text-brand-600 underline underline-offset-2 hover:text-brand-700"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes('language-')
            if (isBlock) {
              return (
                <code className="font-mono text-xs" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code
                className="rounded bg-surface-subtle px-1 py-0.5 font-mono text-[0.85em] text-ink"
                {...props}
              >
                {children}
              </code>
            )
          },
          pre: (props) => (
            <pre
              className="my-2 overflow-x-auto rounded-lg bg-ink p-3 text-xs text-white"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-2 border-l-2 border-brand-300 bg-brand-50 px-3 py-1 text-ink-muted"
              {...props}
            />
          ),
          hr: () => <hr className="my-3 border-border" />,
          table: (props) => (
            <div className="my-2 overflow-x-auto">
              <table className="w-full border-collapse text-xs" {...props} />
            </div>
          ),
          th: (props) => (
            <th className="border border-border bg-surface-subtle px-2 py-1 text-left font-semibold text-ink" {...props} />
          ),
          td: (props) => <td className="border border-border px-2 py-1" {...props} />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}
