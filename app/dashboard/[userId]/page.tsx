"use client";

import type React from "react";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Cleanup URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only");
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Clean up previous URL
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    const url = URL.createObjectURL(file);
    setUploadedPdf(file);
    setPdfUrl(url);
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removePdf = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setUploadedPdf(null);
    setPdfUrl(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Lume AI Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Welcome back!</span>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Upload PDF
              </h2>

              {!uploadedPdf ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl mb-4">📄</div>
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop your PDF here, or{" "}
                        <label className="text-violet-600 hover:text-violet-700 cursor-pointer font-medium">
                          browse
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-400">
                        PDF files only, max 1 file
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📄</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {uploadedPdf.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(uploadedPdf.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removePdf}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove PDF"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Voice Commands */}
              {uploadedPdf && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Voice Commands
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Read this document",
                      "Summarize the content",
                      "What are the key points?",
                      "Explain chapter 1",
                    ].map((command, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        "{command}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PDF Viewer Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  PDF Viewer
                </h2>
                {uploadedPdf && (
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      Download
                    </button>
                    <button className="px-3 py-1 text-sm text-white bg-violet-600 rounded-md hover:bg-violet-700 transition-colors">
                      🎧 Listen
                    </button>
                  </div>
                )}
              </div>

              <div
                className="border border-gray-200 rounded-lg overflow-hidden"
                style={{ height: "600px" }}
              >
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    title="PDF Viewer"
                    style={{ border: "none" }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <div className="text-6xl mb-4 text-gray-300">📄</div>
                      <p className="text-gray-500">No PDF uploaded</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Upload a PDF to view it here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Response Section */}
        {uploadedPdf && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                AI Response
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                  <span className="text-sm">
                    Ready to answer your questions about "{uploadedPdf.name}"
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Use voice commands or ask questions about your document
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
