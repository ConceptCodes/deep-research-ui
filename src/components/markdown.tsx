import React from "react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import "katex/dist/katex.min.css";

import { cn } from "@/lib/utils";

export default function Markdown({
  content,
}: {
  content: string | undefined | null;
}) {
  if (!content) return null;

  return (
    <div className="prose dark:prose-invert max-w-prose p-3">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn(
                "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn(
                "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
                className,
              )}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn(
                "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          h4: ({ className, ...props }) => (
            <h4
              className={cn(
                "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          h5: ({ className, ...props }) => (
            <h5
              className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          h6: ({ className, ...props }) => (
            <h6
              className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          a: ({ className, ...props }) => (
            <a
              className={cn(
                "font-medium underline underline-offset-4",
                className,
              )}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p
              className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
              {...props}
            />
          ),
          ul: ({ className, ...props }) => (
            <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn("my-6 ml-6 list-decimal", className)}
              {...props}
            />
          ),
          li: ({ className, ...props }) => (
            <li className={cn("mt-2", className)} {...props} />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
                className,
              )}
              {...props}
            />
          ),
          img: ({
            className,
            alt,
            ...props
          }: React.ImgHTMLAttributes<HTMLImageElement>) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={cn("rounded-md border", className)}
              alt={alt}
              {...props}
            />
          ),
          hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
          table: ({ node, ...props }) => <Table {...props} />,
          thead: ({ node, ...props }) => <TableHeader {...props} />,
          tbody: ({ node, ...props }) => <TableBody {...props} />,
          tr: ({
            node,
            isHeader, // Acknowledge the isHeader prop
            ...props
          }: {
            node?: any;
            isHeader?: boolean; // Add isHeader to the type definition
          } & React.HTMLAttributes<HTMLTableRowElement>) => (
            <TableRow {...props} />
          ),
          th: ({ node, ...props }) => <TableHead {...props} />,
          td: ({ node, ...props }) => <TableCell {...props} />,
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4",
                className,
              )}
              {...props}
            />
          ),
          code: ({ className, ...props }) => (
            <code
              className={cn(
                "relative rounded border-2 bg-clip-border px-[0.3rem] py-[0.2rem] font-mono text-sm",
                className,
              )}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
