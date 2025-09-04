// app/routes/profile.tsx
import { useState, Suspense, use } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("🚀 Starting data fetch...");
  
  // CRITICAL DATA: User info (fast - 500ms)
  await new Promise(resolve => setTimeout(resolve, 500));
  const userResponse = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await userResponse.json();
  console.log("✅ Got critical user data");
  
  // SECONDARY DATA: Start loading but don't await (2 seconds)
  const postsPromise = new Promise(async (resolve) => {
    console.log("🔄 Starting posts fetch...");
    await new Promise(r => setTimeout(r, 2000)); // 2 second delay
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?userId=1&_limit=3");
    const posts = await response.json();
    console.log("✅ Got posts data");
    resolve(posts);
  });
  
  return {
    user,           // Available immediately after 500ms
    postsPromise,   // Will resolve after 2 more seconds
    serverTime: new Date().toISOString(),
  };
}

export default function Profile() {
  const { user, postsPromise, serverTime } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-green-100 border border-green-300 p-3 mb-4 rounded">
        <strong>🎯 User Experience:</strong> You saw this user info immediately, 
        but posts are still loading below...
      </div>
      
      {/* CRITICAL DATA - Available immediately */}
      <div className="bg-white border border-gray-300 p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">{user.name}</h1>
        <p className="text-gray-600">@{user.username} • {user.email}</p>
        <p className="text-sm text-gray-500">
          Server rendered at: {serverTime}
        </p>
      </div>
      
      {/* SECONDARY DATA - Shows loading state */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
        <Suspense fallback={<PostsSkeleton />}>
          <Posts postsPromise={postsPromise} />
        </Suspense>
      </div>
      
      <InteractiveCounter />
      
      <div className="mt-6 space-x-4">
        <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

function Posts({ postsPromise }: { postsPromise: Promise<any> }) {
  const posts = use(postsPromise); // This will suspend until promise resolves
  
  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <div key={post.id} className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-gray-700">{post.body}</p>
        </div>
      ))}
    </div>
  );
}

function PostsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-100 p-4 rounded border animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}

function InteractiveCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="bg-purple-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-2">🎮 Interactive Element</h3>
      <p className="text-sm text-gray-600 mb-2">
        This works immediately, even while posts are loading:
      </p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Clicks: {count}
      </button>
    </div>
  );
}