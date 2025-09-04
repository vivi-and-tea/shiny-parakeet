// app/routes/timeout.tsx
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
  
  try {
    console.log("🎲 Rolling dice for data speed...");
    
    // Random delay between 1-5 seconds
    const delay = Math.floor(Math.random() * 4000) + 1000;
    console.log(`⏱️  Simulating ${delay}ms data fetch...`);
    
    await new Promise((resolve, reject) => {
      const delayTimeout = setTimeout(resolve, delay);
      
      controller.signal.addEventListener('abort', () => {
        clearTimeout(delayTimeout);
        reject(new Error('AbortError'));
      });
    });
    
    clearTimeout(timeoutId);
    
    // If we get here, data loaded in time
    const response = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=6");
    const photos = await response.json();
    
    return { 
      photos, 
      success: true,
      message: `✅ Lucky! Data loaded in ${delay}ms (under 3s limit)`,
      loadTime: delay
    };
    
  } catch (error) {
    console.log("⏰ Timeout! Showing fallback content");
    
    // Timeout occurred - return fallback data
    return { 
      photos: [], 
      success: false,
      message: "⏰ Data took too long (>3s), showing fallback content",
      loadTime: 3000
    };
  }
}

export default function TimeoutDemo() {
  const { photos, success, message, loadTime } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Timeout Strategy Demo</h1>
      
      <div className={`p-4 rounded mb-6 ${success ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'} border`}>
        <p className="font-semibold">{message}</p>
        <p className="text-sm text-gray-600 mt-1">Load time: {loadTime}ms</p>
      </div>
      
      {success ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo: any) => (
              <div key={photo.id} className="border rounded overflow-hidden">
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded text-center">
          <h2 className="text-xl font-semibold mb-2">⚡ Fast Fallback Content</h2>
          <p className="text-gray-600 mb-4">
            The original data was too slow, so we're showing this instead of making you wait!
          </p>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="text-left mt-2 space-y-1">
              <li>📊 <a href="/users" className="text-blue-500 hover:underline">Browse Users</a></li>
              <li>👤 <a href="/profile" className="text-blue-500 hover:underline">View Profile</a></li>
              <li>🐌 <a href="/slow" className="text-blue-500 hover:underline">Slow Page</a></li>
            </ul>
          </div>
        </div>
      )}
      
      <TimeoutCounter />
      
      <div className="mt-6 space-x-4">
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🎲 Try Again (Random Speed)
        </button>
        <a href="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

function TimeoutCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg mt-6">
      <h3 className="font-semibold mb-2">🏃‍♂️ Always Fast</h3>
      <p className="text-sm text-gray-600 mb-2">
        This interaction works regardless of data loading:
      </p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Instant clicks: {count}
      </button>
    </div>
  );
}