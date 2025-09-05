import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // This metadata will be in the HTML for search engines
  const blogPost = {
    title: "The Ultimate Guide to React SSR",
    description: "Learn how server-side rendering makes your React apps faster and more SEO-friendly",
    author: "Your Name",
    publishDate: "2025-01-15",
    content: "This is a sample blog post that demonstrates how SSR makes content immediately available to search engines...",
    tags: ["React", "SSR", "SEO", "Web Development"]
  };
  
  return { blogPost };
}

export function meta({ data }: { data: { blogPost: any } }) {
  return [
    { title: data.blogPost.title },
    { name: "description", content: data.blogPost.description },
    { name: "keywords", content: data.blogPost.tags.join(", ") },
    { property: "og:title", content: data.blogPost.title },
    { property: "og:description", content: data.blogPost.description },
    { property: "og:type", content: "article" },
  ];
}

export default function SEOTest() {
  const { blogPost } = useLoaderData<typeof loader>();
  
  return (
    <article className="container mx-auto p-4 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
        <div className="text-gray-600 mb-4">
          <span>By {blogPost.author}</span>
          <span className="mx-2">•</span>
          <time>{new Date(blogPost.publishDate).toLocaleDateString()}</time>
        </div>
        <p className="text-xl text-gray-700">{blogPost.description}</p>
      </header>
      
      <div className="prose prose-lg max-w-none mb-8">
        <p>{blogPost.content}</p>
      </div>
      
      <div className="bg-green-100 border border-green-300 p-4 rounded mb-6">
        <h3 className="font-bold mb-2">🔍 SEO Magic Happening Here:</h3>
        <ul className="text-sm space-y-1">
          <li>• Page title and meta description are in the HTML</li>
          <li>• Search engines can read the full content immediately</li>
          <li>• Social media previews will show rich content</li>
          <li>• No JavaScript required for content discovery</li>
        </ul>
      </div>
      
      <div className="space-x-4">
        <button 
          onClick={() => navigator.share?.({ 
            title: blogPost.title, 
            text: blogPost.description, 
            url: window.location.href 
          })}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          📱 Share This Post
        </button>
        <a href="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          ← Back to Home
        </a>
      </div>
    </article>
  );
}