import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getPostBySlug, blogPosts } from "@/content/blog/posts";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | CVGenie Blog`;
      let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = post.excerpt;
    } else {
      document.title = "Post Not Found | CVGenie Blog";
    }
    return () => {
      document.title = "CVGenie — AI Resume & Cover Letter Generator";
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Post not found</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">This article doesn't exist or may have moved.</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-500 mb-10 pb-8 border-b border-slate-100 dark:border-slate-700">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readingTime} min read
          </span>
        </div>

        {/* Content */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none
            prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
            prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-li:leading-relaxed
            prose-strong:text-slate-800 dark:prose-strong:text-slate-200
            prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:pr-4
            prose-ol:text-slate-600 dark:prose-ol:text-slate-400
            prose-a:text-blue-600 dark:prose-a:text-blue-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-14 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Ready to optimize your resume?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-5 text-sm max-w-md mx-auto">
            CVGenie generates ATS-optimized resumes tailored to any job description in under 2 minutes.
          </p>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try CVGenie Free
          </Link>
        </div>
      </article>

      {/* Related posts */}
      {otherPosts.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">More from the Blog</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {otherPosts.map((related) => (
              <Link
                key={related.slug}
                to={`/blog/${related.slug}`}
                className="group block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-wrap gap-1 mb-2">
                  {related.tags.slice(0, 1).map((tag) => (
                    <span key={tag} className="text-xs text-blue-600 dark:text-blue-400 font-medium">{tag}</span>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {related.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{related.readingTime} min read</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
