export type Category = 'Dev' | 'MICE';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  content: string; // Markdown content
  tags: string[];
  category: Category;
  coverImage?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: Category;
  link?: string;
  linkType?: 'site' | 'architecture'; // New optional field
  image: string;
  sourceLink?: string;
  architectureImage?: string;
  content?: string;
}