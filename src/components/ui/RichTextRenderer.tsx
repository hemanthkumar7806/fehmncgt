"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

interface RichTextRendererProps {
  content: any[];
  className?: string;
}

export default function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
  if (!content) return null;

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="mb-4 font-body">{children}</p>
      ),
      
      h1: ({ children }) => (
        <h1 className="text-4xl font-bold mb-6">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-3xl font-bold mb-5">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl font-bold mb-4">{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl font-bold mb-4">{children}</h4>
      ),
      
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-primary pl-6 py-2 italic mb-6 bg-gray-50 rounded-r-lg font-body">
          {children}
        </blockquote>
      ),
      
      textLeft: ({ children }) => (
        <p className="mb-4 text-left font-body">{children}</p>
      ),
      textCenter: ({ children }) => (
        <p className="mb-4 text-center font-body">{children}</p>
      ),
      textRight: ({ children }) => (
        <p className="mb-4 text-right font-body">{children}</p>
      ),
      textJustify: ({ children }) => (
        <p className="mb-4 text-justify font-body">{children}</p>
      ),
    },

    list: {
      bullet: ({ children }) => (
        <ul className="mb-4 pl-6 space-y-2 list-disc">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mb-4 pl-6 space-y-2 list-decimal">{children}</ol>
      ),
    },

    listItem: {
      bullet: ({ children }) => (
        <li className="leading-relaxed font-body">{children}</li>
      ),
      number: ({ children }) => (
        <li className="leading-relaxed font-body">{children}</li>
      ),
    },

    marks: {
      strong: ({ children }) => (
        <strong className="font-bold">{children}</strong>
      ),
      
      em: ({ children }) => (
        <em className="italic">{children}</em>
      ),
      
      code: ({ children }) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
          {children}
        </code>
      ),
      
      underline: ({ children }) => (
        <u className="underline">{children}</u>
      ),
      
      'strike-through': ({ children }) => (
        <s className="line-through">{children}</s>
      ),
      
      link: ({ children, value }) => {
        const href = (value as any)?.href || '#';
        const target = (value as any)?.blank ? '_blank' : undefined;
        const rel = (value as any)?.blank ? 'noopener noreferrer' : undefined;
        
        return (
          <a
            href={href}
            target={target}
            rel={rel}
            className="text-primary hover:text-primary/80 underline transition-colors duration-200"
          >
            {children}
          </a>
        );
      },
    },

    types: {
      image: ({ value }) => {
        const imageValue = value as any;
        if (!imageValue?.asset) return null;
        
        return (
          <div className="my-8">
            <Image
              src={urlFor(imageValue).url()}
              alt={imageValue?.alt || ''}
              width={1000}
              height={700}
              className="rounded-lg w-full h-auto shadow-lg"
            />
            {imageValue?.caption && (
              <p className="text-sm text-gray-600 mt-3 text-center italic">
                {imageValue.caption}
              </p>
            )}
          </div>
        );
      },
    },
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <PortableText value={content} components={components} />
    </div>
  );
}
