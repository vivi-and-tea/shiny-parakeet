// app/routes/performance.tsx
import { useState, useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const start = Date.now();
  
  // Simulate data fetching
  await new Promise(resolve => setTimeout(resolve, 1000));
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const posts = await response.json();
  
  const serverLoadTime = Date.now() - start;
  
  return {
    posts,
    serverLoadTime,
    serverTime: new Date().toISOString()
  };
}

export default function Performance() {
  const { posts, serverLoadTime, serverTime } = useLoaderData<typeof loader>();
  const [clientData, setClientData] = useState(null);
  const [clientLoadTime, setClientLoadTime] = useState(0);
  const [clientLoading, setClientLoading] = useState(false);
  
  const fetchClientSide = async () => {
    setClientLoading(true);
    const start = Date.now();
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Same delay
    const response = await fetch("https://jsonplaceholder.typicode.com/comments?_limit=5");
    const data = await response.json();
    
    setClientLoadTime(Date.now() - start);
    setClientData(data);
    setClientLoading(false);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">SSR vs Client-Side Performance</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* SSR Data */}
        <div className="bg-green-50 border border-green-200 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            ✅ Server-Side Rendered Data
          </h2>
          <p className="text-sm text-green-600 mb-4">
            Load time: {serverLoadTime}ms (completed on server)
            <br />
            Rendered at: {new Date(serverTime).toLocaleTimeString()}
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white p-3 rounded border">
                <h3 className="font-medium text-sm">{post.title}</h3>
              </div>
            ))}
          </div>
        </div>
        
        {/* Client-Side Data */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            🔄 Client-Side Fetched Data
          </h2>
          
          {!clientData ? (
            <div>
              <button 
                onClick={fetchClientSide}
                disabled={clientLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
              >
                {clientLoading ? "Loading..." : "Fetch Data"}
              </button>
              
              {clientLoading && (
                <div className="space-y-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="bg-blue-200 h-12 rounded animate-pulse"></div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-blue-600 mb-4">
                Load time: {clientLoadTime}ms (in browser)
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {clientData.map((comment: any) => (
                  <div key={comment.id} className="bg-white p-3 rounded border">
                    <h3 className="font-medium text-sm">{comment.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-100 border border-yellow-200 p-4 rounded">
        <h3 className="font-semibold mb-2">🏁 Performance Comparison:</h3>
        <ul className="text-sm space-y-1">
          <li>• SSR data appears immediately when page loads</li>
          <li>• Client-side data requires user interaction + waiting</li>
          <li>• Both took the same time to fetch, but user experience is different</li>
          <li>• SSR data is also SEO-friendly and available offline</li>
        </ul>
      </div>
    </div>
  );
}