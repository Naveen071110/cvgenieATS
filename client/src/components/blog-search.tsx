
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogPostMeta } from "@/lib/posts";

interface BlogSearchProps {
  posts: BlogPostMeta[];
  onFilteredPosts: (posts: BlogPostMeta[]) => void;
  placeholder?: string;
}

export function BlogSearch({ posts, onFilteredPosts, placeholder = "Search articles..." }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return posts;
    }

    const searchLower = searchTerm.toLowerCase();
    
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchLower);
      const descriptionMatch = post.description.toLowerCase().includes(searchLower);
      const excerptMatch = post.excerpt.toLowerCase().includes(searchLower);
      const tagsMatch = post.tags.some((tag) => 
        tag.toLowerCase().includes(searchLower)
      );
      const authorMatch = post.author.toLowerCase().includes(searchLower);
      
      return titleMatch || descriptionMatch || excerptMatch || tagsMatch || authorMatch;
    });
  }, [posts, searchTerm]);

  // Update parent component when filtered posts change
  useMemo(() => {
    onFilteredPosts(filteredPosts);
  }, [filteredPosts, onFilteredPosts]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 bg-white border-slate-200 focus:border-primary"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {searchTerm && (
        <div className="mt-2 text-sm text-slate-600">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
        </div>
      )}
    </div>
  );
}
