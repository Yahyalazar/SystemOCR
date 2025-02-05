"use client";

import { useState } from "react";

export default function UploadForm() {
  const [response, setResponse] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    const fileInput = e.target.file.files[0];
    if (!fileInput) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Système OCR </h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          name="file"
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                     file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Upload Document
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-bold">API Response:</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
