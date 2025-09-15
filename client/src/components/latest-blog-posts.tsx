
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPostMeta, formatDate } from "@/lib/posts";

interface LatestBlogPostsProps {
  posts: BlogPostMeta[];
}

export function LatestBlogPosts({ posts }: LatestBlogPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            From the Blog
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay updated with the latest career advice, resume tips, and job search strategies 
            from our team of career experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-white">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <CardTitle className="group-hover:text-primary transition-colors duration-200 line-clamp-2">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="no-underline hover:no-underline text-current"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                
                <CardDescription className="line-clamp-3 text-slate-600">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} min</span>
                  </div>
                </div>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors group"
                >
                  Read article
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="hover:-translate-y-1 transition-transform">
            <Link href="/blog">
              <span>Read all articles</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
