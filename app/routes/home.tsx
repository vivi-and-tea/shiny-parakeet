// app/routes/home.tsx
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

// This function runs on the server for SSR
export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post = await response.json();
  
  return {
    post,
    serverTime: new Date().toISOString(),
    message: "This data was loaded on the server!"
  };
}

export default function Home() {
  const { post, serverTime, message } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">SSR with React Router v7</h1>
      <p className="text-green-600 mb-4">{message}</p>
      <p className="text-gray-600 mb-6">Server rendered at: {serverTime}</p>
      
      <div className="border border-gray-300 p-4 mb-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700">{post.body}</p>
      </div>
      
      <Counter />
      
      {/* NEW NAVIGATION SECTION */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">🧪 Experiment with Loading Strategies</h2>
        <div className="grid grid-cols-2 gap-4">
          <a 
            href="/users" 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
          >
            👥 Users Page
          </a>
          <a 
            href="/slow" 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-center"
          >
            🐌 Super Slow (5s)
          </a>
          <a 
            href="/profile" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
          >
            👤 Smart Profile (Progressive)
          </a>
          <a 
            href="/timeout" 
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center"
          >
            ⏰ Timeout Demo (Random)
          </a>
          <a 
            href="/seo-test" 
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center"
          >
            SEO Test Example
          </a>
          <a 
            href="/performance" 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center"
          >
            Performance
          </a>
          <a 
            href="/feedback" 
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center"
          >
            Feedback
          </a>
          <a 
            href="/error-demo" 
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center"
          >
            Error Demo
          </a>
        </div>
      </div>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Interactive Counter</h2>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Count: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        This button works after hydration!
      </p>
    </div>
  );
}