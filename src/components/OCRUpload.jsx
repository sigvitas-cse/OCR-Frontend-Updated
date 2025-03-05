import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Ensure the .env file is loaded properly
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  console.log("Backend URL:", BACKEND_URL); // Debugging

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/ocr/extract-text`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setExtractedText("Text extracted successfully. Click below to download.");
        setDownloadUrl(`${BACKEND_URL}${response.data}`);
      }

      setLoading("completed");
      setTimeout(() => setLoading(false), 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to extract text.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">OCR Text Extraction</h2>

        <input
          type="file"
          onChange={handleFileChange}
          accept="application/pdf"
          className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />

        <button
          onClick={handleUpload}
          className={`text-white font-semibold py-2 px-4 rounded-lg w-full transition ${
            loading === "completed"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading === true}
        >
          {loading === true ? "Processing..." : loading === "completed" ? "Completed!" : "Extract Text"}
        </button>

        {extractedText && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-medium text-gray-800">Extracted Text:</h3>
            <pre className="text-gray-600 whitespace-pre-wrap">{extractedText}</pre>
          </div>
        )}

        {downloadUrl && (
          <a href={downloadUrl} download="extracted-text.txt" className="mt-4 inline-block">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              Download Extracted Text
            </button>
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
