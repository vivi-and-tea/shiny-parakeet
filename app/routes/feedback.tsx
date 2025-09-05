import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useActionData, useLoaderData } from "react-router";

// Server-side form handling
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const feedback = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    timestamp: new Date().toISOString()
  };
  
  // In real app, you'd save to database
  console.log("📝 Feedback received:", feedback);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { 
    success: true, 
    message: "Thanks for your feedback! We'll get back to you soon.",
    submittedAt: feedback.timestamp
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    formTitle: "Send Us Your Feedback",
    serverTime: new Date().toISOString()
  };
}

export default function Feedback() {
  const { formTitle, serverTime } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{formTitle}</h1>
      
      {actionData?.success ? (
        <div className="bg-green-100 border border-green-300 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Success!</h2>
          <p className="text-green-700">{actionData.message}</p>
          <p className="text-sm text-green-600 mt-2">
            Submitted at: {new Date(actionData.submittedAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <form 
          method="post" 
          className="space-y-6"
          onSubmit={() => setIsSubmitting(true)}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? "Submitting..." : "Send Feedback"}
          </button>
        </form>
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2">🚀 What's Happening Here:</h3>
        <ul className="text-sm space-y-1">
          <li>• Form submits to the server (no client-side JS required)</li>
          <li>• Server processes the data and returns a response</li>
          <li>• Page updates with success message</li>
          <li>• Works even with JavaScript disabled!</li>
        </ul>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Page rendered at: {serverTime}
      </div>
      
      <a href="/" className="inline-block mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        ← Back to Home
      </a>
    </div>
  );
}