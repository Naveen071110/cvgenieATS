
import { useMemo, useState, useEffect } from "react";
import { useRoute } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getPostBySlug, 
  getRelatedPosts, 
  formatDate, 
  BlogPost 
} from "@/lib/posts";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Share2,
  Bookmark
} from "lucide-react";
import { Link } from "wouter";
import { BlogCard } from "@/components/blog-card";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      const foundPost = getPostBySlug(slug);
      setPost(foundPost);
      
      if (foundPost) {
        const related = getRelatedPosts(foundPost.slug, foundPost.tags, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="branded-spinner"></div>
      </div>
    );
  }

  // Handle not found
  if (!match || !slug || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-lg text-slate-600 mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl = `https://cvgenie.com/blog/${post.slug}`;

  // Simple markdown-to-HTML converter for basic formatting
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Handle headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-bold text-slate-900 mb-6 mt-8 first:mt-0">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-3xl font-semibold text-slate-900 mb-4 mt-8">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-semibold text-slate-900 mb-3 mt-6">{line.slice(4)}</h3>;
        }
        
        // Handle bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="text-lg text-slate-700 mb-4 leading-relaxed">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-900">{part}</strong> : part
              )}
            </p>
          );
        }
        
        // Handle empty lines
        if (line.trim() === '') {
          return <div key={index} className="mb-4"></div>;
        }
        
        // Handle horizontal rules
        if (line.trim() === '---') {
          return <hr key={index} className="my-8 border-slate-200" />;
        }
        
        // Regular paragraphs
        return <p key={index} className="text-lg text-slate-700 mb-4 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Back to Blog Link */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <article className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-12">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" asChild>
                    <Link href={`/blog?tag=${tag}`}>
                      {tag}
                    </Link>
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {post.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{post.author}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(post.date)}</span>
                </div>
                
                {post.updated && post.updated !== post.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Updated {formatDate(post.updated)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-3 pb-8 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-700">Share:</span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.description,
                        url: shareUrl,
                      });
                    } else {
                      navigator.clipboard.writeText(shareUrl);
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    alert('Bookmarked!');
                  }}
                >
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-16">
              {renderContent(post.content)}
            </div>

            {/* Article Footer */}
            <footer className="border-t border-slate-200 pt-8">
              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Topics covered:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" asChild>
                      <Link href={`/blog?tag=${tag}`}>
                        {tag}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Ready to create your perfect resume?
                  </h3>
                  <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
                    Put these tips into action with CVGenie's AI-powered resume builder. 
                    Create ATS-optimized resumes and cover letters that get results.
                  </p>
                  <Button size="lg" className="hover:-translate-y-1 transition-transform" asChild>
                    <a href="/generator">
                      Try CVGenie Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </footer>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Related Articles
                </h2>
                <p className="text-lg text-slate-600">
                  Continue reading with these related career tips and guides
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
