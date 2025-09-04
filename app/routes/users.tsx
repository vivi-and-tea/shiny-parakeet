// app/routes/users.tsx
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

// This runs on the server - let's fetch multiple users
export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  
  return {
    users,
    serverTime: new Date().toISOString(),
    message: "User list loaded on the server!"
  };
}

export default function Users() {
  const { users, serverTime, message } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Users Page</h1>
      <p className="text-green-600 mb-4">{message}</p>
      <p className="text-gray-600 mb-6">Server rendered at: {serverTime}</p>
      
      <div className="grid gap-4 mb-6">
        {users.map((user: any) => (
          <div key={user.id} className="border border-gray-300 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-sm text-gray-500">{user.company.name}</p>
          </div>
        ))}
      </div>
      
      <div className="flex gap-4">
        <a 
          href="/" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ← Back to Home
        </a>
        <UserCounter />
      </div>
    </div>
  );
}

function UserCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <p className="text-sm mb-2">Users you've clicked on:</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Click count: {count}
      </button>
    </div>
  );
}