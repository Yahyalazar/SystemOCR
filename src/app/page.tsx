"use client";
import { useState } from "react";
import DataDisplay from "@/app/components/DataDisplay";
import Link from "next/link";

interface JsonData {
  "Header Information": {
    organization: string;
    organization_in_arabic: string;
    subtitle: string;
    "Date d'enregistrement": string;
    Saison: string;
    title: string;
  };
  "Player Data": Array<{
    id?: number;
    First_name_and_Last_name?: string;
    license_number?: string;
    cin_number?: string | undefined;
    order_number?: number | undefined;
  }>;
}

export default function UploadForm() {
  const [responseData, setResponseData] = useState<null | JsonData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const signal = controller.signal;
  
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
  
        const responsePromise = fetch(url, { ...options, signal });
  
        const response = await Promise.race([
          responsePromise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 10000)
          ),
        ]);
  
        clearTimeout(timeoutId);
  
        if (!response || !response.ok) {
          throw new Error(`HTTP error! Status: ${response?.status || "Unknown"}`);
        }
  
        return response;
      } catch (error) {
        console.warn(`Attempt ${attempt} failed. Retrying... Last error:`, error);
  
        if (attempt === retries) {
          throw new Error(`All retry attempts (${retries}) failed. Last error: ${String(error)}`);
        }
  
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying
      }
    }
  
    throw new Error("Unreachable code"); // Fallback error (should never reach here)
  };
  

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const fileInput = (e.target as HTMLFormElement).file.files?.[0];
    if (!fileInput) {
      alert("Veuillez sélectionner un fichier à télécharger.");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("file", fileInput);
  
    try {
      const res = await fetchWithRetry("/api/process-image", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
  
      const data = await res.json();
      
  
      if (data?.data?.content) {
        const parsedContent = JSON.parse(data.data.content) as JsonData;
        setResponseData(parsedContent);
      } else {
        setResponseData(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Upload error:", error.message);
        setError("Le téléchargement a échoué. Veuillez réessayer ou contacter le support technique.");
      } else {
        console.error("Unknown upload error:", error);
        setError("Une erreur inconnue s'est produite. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };
  console.log(responseData);
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
          Bordereau d&apos;Assurance Collectif
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
              disabled={loading}
              className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
            >
              {loading ? "Traitement en cours..." : "Télécharger document"}
            </button>
          </div>
        </form>

        {/* Display Data or Error Message */}
        <div className="p-8">
          {loading && <p className="text-gray-500 text-center">Chargement...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {responseData && <DataDisplay jsonData={responseData} />}
          {!responseData && !loading && !error && (
            <p className="text-gray-500 text-center">
              Aucun fichier traité pour l&apos;instant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}