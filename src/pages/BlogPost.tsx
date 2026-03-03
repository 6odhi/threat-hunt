import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { getBlogBySlug } from "@/lib/blogLoader";
import "highlight.js/styles/github.css";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const blog = slug ? getBlogBySlug(slug) : undefined;

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-8">
          <Link
            to="/"
            className="text-base font-semibold tracking-tight text-foreground"
          >
            Threat-hunt
          </Link>

          <Link
            to="/"
            state={{ scrollTo: "blogs" }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="mx-auto max-w-4xl px-6 py-20">
        <div
          className="
            prose prose-neutral max-w-none
            prose-headings:font-serif
            prose-h1:text-4xl
            prose-h1:font-bold
            prose-h1:mb-6
            prose-h2:mt-12 prose-h2:mb-4
            prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-8 prose-p:mb-6
            prose-li:mb-2
            prose-strong:text-gray-900
            prose-blockquote:border-l-4
            prose-blockquote:border-l-[#2AA6C6]
            prose-blockquote:pl-4
            prose-img:rounded-md
            prose-img:shadow-md
          "
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              a: ({ href, children }) => {
                const isExternal = href?.startsWith("http");

                return (
                  <a
                    href={href}
                    target={isExternal ? "_blank" : "_self"}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-[#2AA6C6] underline underline-offset-4 hover:opacity-80 transition"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </article>

    </div>
  );
};

export default BlogPost;