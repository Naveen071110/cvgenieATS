
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { BlogSearch } from "@/components/blog-search";
import { BlogTagFilter } from "@/components/blog-tag-filter";
import { BlogPagination } from "@/components/blog-pagination";
import { getAllPosts, getAllTags, paginatePosts, getPostsByTag, BlogPostMeta } from "@/lib/posts";
import { BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Blog() {
  const [location] = useLocation();
  const [filteredPosts, setFilteredPosts] = useState<BlogPostMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get('page') || '1', 10);
  const selectedTag = urlParams.get('tag') || undefined;

  // Load posts data
  const allPosts = useMemo(() => getAllPosts(), []);
  const allTags = useMemo(() => getAllTags(), []);

  // Filter posts by tag if selected
  const postsToDisplay = useMemo(() => {
    if (selectedTag) {
      return getPostsByTag(selectedTag);
    }
    return allPosts;
  }, [allPosts, selectedTag]);

  // Initialize filtered posts
  useEffect(() => {
    setFilteredPosts(postsToDisplay);
    setIsLoading(false);
  }, [postsToDisplay]);

  // Paginate the filtered posts
  const paginationData = useMemo(() => {
    return paginatePosts(filteredPosts, currentPage, 9);
  }, [filteredPosts, currentPage]);

  const handleFilteredPosts = (posts: BlogPostMeta[]) => {
    setFilteredPosts(posts);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="branded-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
        <Header />
        
        <main className="py-16">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Career Insights & Tips
              </h1>
              
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Expert advice to help you create compelling resumes, optimize for ATS systems, 
                and advance your career. Learn from industry professionals and land your dream job.
              </p>
              
              <div className="text-lg text-slate-500">
                {allPosts.length} article{allPosts.length !== 1 ? 's' : ''} and growing
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              <div className="lg:flex-1">
                <BlogSearch 
                  posts={postsToDisplay} 
                  onFilteredPosts={handleFilteredPosts}
                  placeholder="Search articles, tips, and guides..."
                />
              </div>
              
              <div className="lg:w-80">
                <BlogTagFilter 
                  allTags={allTags} 
                  selectedTag={selectedTag}
                />
              </div>
            </div>

            {/* Results Info */}
            {(selectedTag || filteredPosts.length !== postsToDisplay.length) && (
              <div className="mb-8 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-700">
                  <Filter className="w-4 h-4" />
                  <span>
                    Showing {filteredPosts.length} of {allPosts.length} articles
                    {selectedTag && (
                      <span> tagged with <strong>"{selectedTag}"</strong></span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Blog Posts Grid */}
            {paginationData.posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {paginationData.posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                <BlogPagination 
                  currentPage={paginationData.currentPage}
                  totalPages={paginationData.totalPages}
                  hasNext={paginationData.hasNext}
                  hasPrev={paginationData.hasPrev}
                />
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {selectedTag 
                      ? `No articles found with the tag "${selectedTag}". Try browsing other topics or clearing the filter.`
                      : "No articles match your search. Try different keywords or browse our available topics."
                    }
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/blog'}>
                    View all articles
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* CTA Section */}
            <div className="mt-20 text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Ready to Create Your Perfect Resume?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Put these tips into action with CVGenie's AI-powered resume builder. 
                Create ATS-optimized resumes and cover letters in minutes.
              </p>
              <Button size="lg" className="hover:-translate-y-1 transition-transform" asChild>
                <a href="/generator">
                  Try CVGenie Free
                </a>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
}
