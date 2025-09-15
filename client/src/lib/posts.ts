import React from 'react';

// Types that match the server-side data structure
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

// Type alias for components that only need metadata
export type BlogPostMeta = Omit<BlogPost, 'content'>;

export interface PaginatedPosts {
  posts: BlogPostMeta[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Cache for posts data
let postsCache: BlogPostMeta[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch all posts from API
async function fetchAllPosts(): Promise<BlogPostMeta[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return postsCache;
  }

  try {
    const response = await fetch('/api/blog/posts');
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const posts = await response.json();
    
    // Update cache
    postsCache = posts;
    cacheTimestamp = now;
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return empty array as fallback
    return [];
  }
}

// Get all posts (cached)
export function getAllPosts(): BlogPostMeta[] {
  // For SSR/initial render, return empty array and fetch asynchronously
  if (postsCache) {
    return postsCache;
  }
  
  // Trigger async fetch but return empty array for now
  fetchAllPosts().then(posts => {
    postsCache = posts;
  });
  
  return [];
}

// Get latest posts
export function getLatestPosts(count: number = 3): BlogPostMeta[] {
  const posts = getAllPosts();
  return posts.slice(0, count);
}

// Get post by slug (async)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog/posts/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post =>
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

// Search posts
export function searchPosts(query: string): BlogPostMeta[] {
  const searchTerm = query.toLowerCase();
  const posts = getAllPosts();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Get related posts
export function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): BlogPostMeta[] {
  const posts = getAllPosts();
  return posts
    .filter(post => post.slug !== currentSlug)
    .filter(post => post.tags.some(tag => tags.includes(tag)))
    .sort((a, b) => {
      // Sort by number of matching tags
      const aMatches = a.tags.filter(tag => tags.includes(tag)).length;
      const bMatches = b.tags.filter(tag => tags.includes(tag)).length;
      return bMatches - aMatches;
    })
    .slice(0, limit);
}

// Get all tags
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Paginate posts
export function paginatePosts(posts: BlogPostMeta[], page: number = 1, limit: number = 10): PaginatedPosts {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / limit);

  return {
    posts: paginatedPosts,
    currentPage: page,
    totalPages,
    totalPosts: posts.length,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

// Hook to use posts with React state
export function usePostsData() {
  const [posts, setPosts] = React.useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchAllPosts()
      .then(fetchedPosts => {
        setPosts(fetchedPosts);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { posts, loading, error };
}