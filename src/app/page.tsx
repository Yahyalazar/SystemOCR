"use client";
import { useState } from "react";
import DataDisplay from "@/app/components/DataDisplay";
import Link from "next/link";

export default function UploadForm() {
  const [responseData, setResponseData] = useState(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const fileInput = (e.target as HTMLFormElement).file.files[0];
    if (!fileInput) {
      alert("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", fileInput);
  
    try {
      const res = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json", // Do NOT set Content-Type manually
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
  
      const data = await res.json();
  
      // Fix: Parse the stringified JSON inside `data.content`
      if (data?.data?.content) {
        const parsedContent = JSON.parse(data.data.content);
        setResponseData(parsedContent); // Correctly set parsed data
      } else {
        setResponseData(null);
      }
  
      console.log(data.data.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Navbar */}
      <nav className="w-full bg-red-900 shadow-lg fixed top-0 left-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Système OCR</h1>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="text-white hover:text-white-200 transition duration-200"
              >
                Accueil
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mt-20 w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          Bordoreau d&apos;Assurance Collectif
        </h1>
        <form
          onSubmit={handleUpload}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mx-auto"
        >
          <div className="flex flex-col space-y-4">
            <input
              type="file"
              name="file"
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                   file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
            >
              Télécharger document
            </button>
          </div>
        </form>

        {/* Display Data */}
        <div className="p-8">
          {responseData ? (
            <DataDisplay jsonData={responseData} />
          ) : (
            <p className="text-gray-500 text-center">
              Aucun fichier traité pour l&apos;instant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
