import { useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { blogPosts } from "@/content/blog/posts";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogPosts.forEach((post) => post.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, []);

  const visiblePosts = useMemo(() => {
    if (!activeTag) return blogPosts;
    return blogPosts.filter((post) => post.tags.includes(activeTag));
  }, [activeTag]);

  useEffect(() => {
    document.title = "Blog — ATS & Resume Tips | CVGenie";
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "Actionable tips on ATS optimization, resume writing, cover letters, and job search strategy from the CVGenie team.";
    return () => {
      document.title = "CVGenie — AI Resume & Cover Letter Generator";
      const metaDescCleanup = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (metaDescCleanup) {
        metaDescCleanup.content =
          "CVGenie uses AI to generate ATS-optimized resumes and cover letters tailored to any job description. Try free today.";
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Page heading */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Blog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Resume & Career Advice
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Practical tips on ATS optimization, resume writing, cover letters, and landing more interviews — from the team building CVGenie.
          </p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Button
            variant={activeTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTag(null)}
            className={
              activeTag === null
                ? "bg-blue-600 hover:bg-blue-700 text-white border-0"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
            }
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={
                activeTag === tag
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-0"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              }
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Post grid */}
        {visiblePosts.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-16">No posts found for this tag.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {visiblePosts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                          activeTag === tag
                            ? "bg-blue-600 text-white"
                            : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Title */}
                  <Link to={`/blog/${post.slug}`} className="block mb-3">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 leading-relaxed mb-5">
                    {post.excerpt}
                  </p>

                  {/* Meta + CTA */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTime} min read
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      aria-label={`Read ${post.title}`}
                    >
                      Read more
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA banner */}
        <div className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Put These Tips to Work
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Generate an ATS-optimized resume tailored to your target job in under 2 minutes — no credit card required.
          </p>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try CVGenie Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
