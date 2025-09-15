export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  readTime: number;
  featured: boolean;
}

// Type alias for components that only need metadata
export type BlogPostMeta = BlogPost;

export interface PaginatedPosts {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Mock blog posts data - replace with actual data source later
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Write an ATS-Optimized Resume in 2025",
    excerpt: "Learn the latest strategies for creating resumes that pass through Applicant Tracking Systems and land you more interviews.",
    content: "Full content here...",
    slug: "ats-optimized-resume-2025",
    publishedAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    tags: ["ATS", "Resume Tips", "Job Search"],
    author: {
      name: "CVGenie Team",
      avatar: "/images/authors/team.jpg"
    },
    readTime: 8,
    featured: true
  },
  {
    id: "2", 
    title: "Top 10 Resume Keywords for Tech Jobs",
    excerpt: "Discover the most effective keywords to include in your tech resume to get noticed by recruiters and hiring managers.",
    content: "Full content here...",
    slug: "tech-resume-keywords",
    publishedAt: "2025-01-10T14:30:00Z",
    updatedAt: "2025-01-10T14:30:00Z",
    tags: ["Keywords", "Tech Jobs", "Resume Optimization"],
    author: {
      name: "CVGenie Team",
      avatar: "/images/authors/team.jpg"
    },
    readTime: 6,
    featured: false
  },
  {
    id: "3",
    title: "Common Resume Mistakes That Cost You Job Interviews",
    excerpt: "Avoid these critical resume mistakes that cause recruiters to pass on your application, even if you're qualified.",
    content: "Full content here...",
    slug: "resume-mistakes-to-avoid",
    publishedAt: "2025-01-05T09:15:00Z",
    updatedAt: "2025-01-05T09:15:00Z",
    tags: ["Resume Mistakes", "Job Search", "Career Tips"],
    author: {
      name: "CVGenie Team",
      avatar: "/images/authors/team.jpg"
    },
    readTime: 5,
    featured: false
  }
];

export function getAllPosts(): BlogPost[] {
  return mockPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getLatestPosts(limit: number = 3): BlogPost[] {
  return getAllPosts().slice(0, limit);
}

export function getFeaturedPosts(): BlogPost[] {
  return mockPosts.filter(post => post.featured);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts.find(post => post.slug === slug);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return mockPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

export function searchPosts(query: string): BlogPost[] {
  const searchTerm = query.toLowerCase();
  return mockPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): BlogPost[] {
  return mockPosts
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

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  mockPosts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function paginatePosts(posts: BlogPost[], page: number = 1, limit: number = 10): PaginatedPosts {
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