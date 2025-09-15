import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: { name: string; avatar?: string };
  tags: string[];
  ogImage?: string;
  content: string;
  excerpt: string;
  readingTime: number;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: { name: string; avatar?: string };
  tags: string[];
  ogImage?: string;
  excerpt: string;
  readingTime: number;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): BlogPostMeta[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Skip drafts
        if (data.draft) {
          return null;
        }

        // Generate excerpt from content
        const excerpt = generateExcerpt(content);
        const readingTime = calculateReadingTime(content);

        return {
          slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date || new Date().toISOString(),
          updated: data.updated,
          author: normalizeAuthor(data.author || 'CVGenie Editorial Team'),
          tags: Array.isArray(data.tags) ? data.tags.filter(tag => typeof tag === 'string') : [],
          ogImage: data.ogImage,
          excerpt,
          readingTime,
        };
      })
      .filter(Boolean) as BlogPostMeta[];

    // Sort posts by date in descending order
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Skip drafts
    if (data.draft) {
      return null;
    }

    const excerpt = generateExcerpt(content);
    const readingTime = calculateReadingTime(content);

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      updated: data.updated,
      author: normalizeAuthor(data.author || 'CVGenie Editorial Team'),
      tags: Array.isArray(data.tags) ? data.tags.filter(tag => typeof tag === 'string') : [],
      ogImage: data.ogImage,
      content,
      excerpt,
      readingTime,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tags.add(tag);
    });
  });

  return Array.from(tags).sort();
}

export function paginatePosts(posts: BlogPostMeta[], page: number = 1, perPage: number = 10) {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    totalPages: Math.ceil(posts.length / perPage),
    currentPage: page,
    hasNext: endIndex < posts.length,
    hasPrev: page > 1,
  };
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.tags.some((postTag) =>
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

export function getLatestPosts(count: number = 3): BlogPostMeta[] {
  const posts = getAllPosts();
  return posts.slice(0, count);
}

export function getRelatedPosts(currentSlug: string, tags: string[], count: number = 3): BlogPostMeta[] {
  const posts = getAllPosts();

  const relatedPosts = posts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) =>
      post.tags.some((tag) => tags.includes(tag))
    )
    .slice(0, count);

  return relatedPosts;
}

function generateExcerpt(content: string, length: number = 160): string {
  // Remove MDX/markdown syntax and get plain text
  const plainText = content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= length) {
    return plainText;
  }

  return plainText.substring(0, length).replace(/\s+\S*$/, '') + '...';
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}

// Normalize author data to handle both string and object formats
function normalizeAuthor(author: any): { name: string; avatar?: string } {
  if (typeof author === 'string') {
    return { name: author };
  }
  if (typeof author === 'object' && author !== null) {
    return {
      name: author.name || 'Unknown Author',
      avatar: author.avatar
    };
  }
  return { name: 'Unknown Author' };
}

export function validatePost(slug: string): { isValid: boolean; errors: string[] } {
  const post = getPostBySlug(slug);
  const errors: string[] = [];

  if (!post) {
    errors.push('Post not found');
    return { isValid: false, errors };
  }

  if (!post.title || post.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!post.description || post.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!post.date) {
    errors.push('Date is required');
  }

  if (!post.author || typeof post.author === 'string' && post.author.trim() === '') {
    errors.push('Author is required');
  }

  return { isValid: errors.length === 0, errors };
}

export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}

export function formatDateISO(dateString: string): string {
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch (error) {
    return dateString;
  }
}