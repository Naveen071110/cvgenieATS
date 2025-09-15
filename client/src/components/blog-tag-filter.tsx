
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BlogTagFilterProps {
  allTags?: string[];
  selectedTag?: string;
  onTagChange?: (tag: string | null) => void;
}

export function BlogTagFilter({ 
  allTags = [], 
  selectedTag,
  onTagChange 
}: BlogTagFilterProps) {
  const [location] = useLocation();

  // Defensive locals
  const safeAllTags = Array.isArray(allTags) ? allTags : [];
  const tagCount = safeAllTags?.length ?? 0;
  
  // Safe callback wrapper
  const emitTagChange = typeof onTagChange === 'function' ? onTagChange : () => {};

  const getTagUrl = (tag: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tag', tag);
    url.searchParams.delete('page'); // Reset to first page when filtering
    return `${url.pathname}${url.search}`;
  };

  const clearTagUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('tag');
    url.searchParams.delete('page'); // Reset to first page when clearing filter
    return `${url.pathname}${url.search}`;
  };

  const handleTagClick = (tag: string) => {
    emitTagChange(tag);
  };

  const handleClearFilter = () => {
    emitTagChange(null);
  };

  if (tagCount === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Filter by Topic</h3>
        {selectedTag && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilter}
            asChild
          >
            <Link href={clearTagUrl()}>
              <X className="w-4 h-4 mr-1" />
              Clear filter
            </Link>
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {safeAllTags.map((tag) => {
          const isSelected = selectedTag === tag;
          
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-primary hover:text-primary-foreground"
              }`}
              onClick={() => handleTagClick(tag)}
              asChild
            >
              <Link href={getTagUrl(tag)}>
                {tag}
                {isSelected && <X className="w-3 h-3 ml-1" />}
              </Link>
            </Badge>
          );
        })}
      </div>
      
      {selectedTag && (
        <p className="text-sm text-slate-600">
          Showing articles tagged with <strong>"{selectedTag}"</strong>
        </p>
      )}
    </div>
  );
}
