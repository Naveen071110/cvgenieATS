
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, User } from "lucide-react";
import { BlogPostMeta, formatDate } from "@/lib/posts";

interface BlogCardProps {
  post: BlogPostMeta;
  className?: string;
}

export function BlogCard({ post, className = "" }: BlogCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              <Link href={`/blog?tag=${tag}`} className="no-underline">
                {tag}
              </Link>
            </Badge>
          ))}
        </div>
        
        <CardTitle className="group-hover:text-primary transition-colors duration-200">
          <Link 
            href={`/blog/${post.slug}`} 
            className="no-underline hover:no-underline text-current"
          >
            {post.title}
          </Link>
        </CardTitle>
        
        <CardDescription className="line-clamp-2 text-slate-600">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.date)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime} min read</span>
          </div>
          
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author.name}</span>
          </div>
        </div>
        
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-block mt-4 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Read more →
        </Link>
      </CardContent>
    </Card>
  );
}
