import { Post, Category } from '../types';

/**
 * Parses a raw markdown string with Frontmatter into a structured Post object.
 * 
 * Expected Format:
 * ---
 * id: my-post-id
 * title: My Post Title
 * date: Oct 12, 2023
 * category: Dev
 * tags: [Tag1, Tag2]
 * excerpt: A short summary...
 * ---
 * # Content starts here...
 */
export const parseMarkdownPost = (rawContent: string): Post => {
  const separator = '---\n';
  const parts = rawContent.split(separator);

  // If no frontmatter found, return a basic object (should guard against this in prod)
  if (parts.length < 3) {
    console.warn("Invalid markdown format. Missing Frontmatter.");
    return {
      id: 'error',
      title: 'Error Parsing Post',
      excerpt: 'Invalid format',
      date: '',
      content: rawContent,
      tags: [],
      category: 'Dev'
    };
  }

  const frontmatterBlock = parts[1];
  const content = parts.slice(2).join(separator).trim();
  
  const metadata: any = {};

  // Parse YAML-like frontmatter line by line
  frontmatterBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle Array syntax: [Item1, Item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      metadata[key] = value.slice(1, -1).split(',').map(s => s.trim());
    } else {
      metadata[key] = value;
    }
  });

  return {
    id: metadata.id,
    title: metadata.title,
    excerpt: metadata.excerpt,
    date: metadata.date,
    category: metadata.category as Category,
    tags: metadata.tags || [],
    coverImage: metadata.coverImage,
    content: content
  };
};