// app/routes/slow.tsx
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("Starting slow data fetch...");
  
  // Simulate really slow API (5 seconds)
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
  const posts = await response.json();
  
  console.log("Slow data fetch completed!");
  
  return {
    posts,
    serverTime: new Date().toISOString(),
    message: "This took 5 seconds to load on the server!"
  };
}

export default function SlowPage() {
  const { posts, serverTime, message } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Super Slow Page</h1>
      <p className="text-red-600 mb-4 font-bold">{message}</p>
      <p className="text-gray-600 mb-6">Server rendered at: {serverTime}</p>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 rounded-lg">
        <h3 className="font-semibold mb-2">🐌 What you just experienced:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Server took 5 seconds to fetch data</li>
          <li>• But you saw content immediately (no loading spinner!)</li>
          <li>• In a regular SPA, you'd stare at a blank page for 5 seconds</li>
        </ul>
      </div>
      
      {posts.map((post: any) => (
        <div key={post.id} className="border border-gray-300 p-4 mb-4 rounded-lg">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-gray-700">{post.body}</p>
        </div>
      ))}
      
      <SlowCounter />
      
      <div className="mt-6">
        <a 
          href="/" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ← Back to Home (This will be instant!)
        </a>
      </div>
    </div>
  );
}

function SlowCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="bg-red-50 p-4 rounded-lg">
      <p className="text-sm mb-2">This counter works immediately after hydration:</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Quick clicks: {count}
      </button>
    </div>
  );
}