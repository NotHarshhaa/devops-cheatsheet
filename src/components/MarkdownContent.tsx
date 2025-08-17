'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function MarkdownContent({ content }: { content: string }) {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach((pre) => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'absolute top-2 right-2 p-2 bg-gray-700/50 hover:bg-gray-700/75 rounded-md transition-colors';
      copyButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;
      copyButton.onclick = () => {
        const codeElement = pre.querySelector('code');
        const code = codeElement ? codeElement.textContent || '' : pre.textContent || '';
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard!');
      };

      // Make pre relative for absolute positioning of copy button
      pre.style.position = 'relative';
      
      // Add the copy button
      pre.appendChild(copyButton);
    });
  }, [content]);

  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 