import React from 'react';

/**
 * Renders text with highlighted portions in teal color
 * @param text - The text to render
 * @param highlights - Array of words/phrases to highlight
 * @returns React element(s) with highlighted text
 */
export function renderTextWithHighlights(
  text: string,
  highlights: string[] = []
): React.ReactNode {
  if (!highlights || highlights.length === 0 || !text) {
    return text;
  }

  // Create a regex pattern that matches any of the highlight texts (case-insensitive)
  const pattern = new RegExp(
    highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'gi'
  );

  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;

  // Find all matches and create parts array
  while ((match = pattern.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add highlighted match
    parts.push(
      <span
        key={`highlight-${match.index}`}
        className="text-secondary"
      >
        {match[0]}
      </span>
    );

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

