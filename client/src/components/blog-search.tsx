
import { useState, useMemo, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogPostMeta } from "@/lib/posts";

type BlogSearchProps = {
  posts: BlogPostMeta[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilteredPosts?: (posts: BlogPostMeta[]) => void;
  className?: string;
};

export function BlogSearch({
  posts,
  searchQuery,
  onSearchChange,
  onFilteredPosts,
  className = ""
}: BlogSearchProps) {
  // Add a defensive no-op default and proper typing
  const handleFiltered = typeof onFilteredPosts === 'function'
    ? onFilteredPosts
    : () => {};

  // Memoize the filtered posts (computation only)
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  // Stabilize the callback reference
  const emitFiltered = useCallback((p: BlogPostMeta[]) => handleFiltered(p), [handleFiltered]);

  // Move the side effect to useEffect
  useEffect(() => {
    emitFiltered(filteredPosts);
  }, [filteredPosts, emitFiltered]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}
