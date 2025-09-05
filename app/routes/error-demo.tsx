import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const errorType = url.searchParams.get("error");
  
  if (errorType === "500") {
    throw new Error("Simulated server error!");
  }
  
  if (errorType === "404") {
    throw new Response("Data not found", { status: 404 });
  }
  
  return { message: "Everything is working fine!" };
}

export default function ErrorDemo() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Error Handling Demo</h1>
      <p className="mb-6">Try these different error scenarios:</p>
      
      <div className="space-y-4">
        <a 
          href="/error-demo?error=500" 
          className="block bg-red-500 text-white p-4 rounded hover:bg-red-600"
        >
          Trigger 500 Error
        </a>
        <a 
          href="/error-demo?error=404" 
          className="block bg-orange-500 text-white p-4 rounded hover:bg-orange-600"
        >
          Trigger 404 Error
        </a>
        <a 
          href="/error-demo" 
          className="block bg-green-500 text-white p-4 rounded hover:bg-green-600"
        >
          No Error (Success)
        </a>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-red-100 border border-red-300 p-6 rounded">
        <h1 className="text-2xl font-bold text-red-800 mb-4">Oops! Something went wrong</h1>
        <p className="text-red-700 mb-4">Error: {error.message}</p>
        <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go Home
        </a>
      </div>
    </div>
  );
}