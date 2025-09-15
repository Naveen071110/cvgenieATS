import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { BlogSearch } from "@/components/blog-search";
import { BlogTagFilter } from "@/components/blog-tag-filter";
import { BlogPagination } from "@/components/blog-pagination";
import { getAllPosts, getPostsByTag, type PostMeta } from "@/lib/posts";

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get all posts
  const allPosts = getAllPosts();

  // Get all unique tags with defensive handling
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    const safePosts = Array.isArray(allPosts) ? allPosts : [];
    safePosts.forEach(post => {
      const postTags = Array.isArray(post?.tags) ? post.tags : [];
      postTags.forEach(tag => {
        if (typeof tag === 'string' && tag.trim()) {
          tags.add(tag.trim());
        }
      });
    });
    return Array.from(tags).sort();
  }, [allPosts]);

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    // Filter by tag if selected
    if (selectedTag) {
      posts = getPostsByTag(selectedTag);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return posts;
  }, [allPosts, selectedTag, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CVGenie Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert career advice, resume tips, and job search strategies to help you land your dream job.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <BlogSearch
                posts={allPosts}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                className="w-full md:w-96"
              />
              <BlogTagFilter
                allTags={allTags}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
              />
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-gray-600">
              {filteredPosts.length === 1 ? '1 post' : `${filteredPosts.length} posts`}
              {selectedTag && ` tagged with "${selectedTag}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {currentPosts.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {currentPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <BlogPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      hasNext={currentPage < totalPages}
                      hasPrev={currentPage > 1}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
                {(searchQuery || selectedTag) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTag(null);
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}