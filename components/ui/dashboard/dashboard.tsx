"use client";

import type React from "react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "@/constant/endpoint";

import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ID, storage } from "@/lib/appwrite";
import { ChevronDown, ChevronDownIcon, Loader2 } from "lucide-react";
import QuestionAndAnswer from "./q&a";

export default function Dashboard() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pdf, setPdf] = useState<Pdf>();

  const [file, setFile] = useState<Blob | null>(null);
  const [numPage, setNumPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [expandedChatId, setExpandedChatId] = useState<string | null>(null);

  const [user, setuser] = useState<User>();
  const [userId, setuserId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") || "";
    }
  });

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
        audioRef.current = null;
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const getUser = () => {
      axios.get(`${BASE_URL}/dashboard/${userId}`).then((response) => {
        setuser(response.data);
      });
    };

    if (userId) getUser();
  }, [userId]);

  useEffect(() => {
    const fetchFile = async () => {
      const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
      const buckedId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${buckedId}/files/${pdf?.appwriteId}/view?project=${projectId}&mode=admin`
      );
      const fileData = await response.blob();

      setFile(fileData);
    };

    if (pdf) fetchFile();
  }, [pdf]);

  useEffect(() => {
    const getAudiochats = async () => {
      if (!pdf?.appwriteId) return;
      try {
        const response = await axios.get(
          `${BASE_URL}/dashboard/audio-question/${pdf._id}`
        );
        console.log("Audio chats:", response.data);
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching audio chats:", error);
      }
    };

    if (pdf) getAudiochats();
  }, [pdf]);

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only");
      return;
    }

    setIsUploading(true);

    const promise = storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file
    );

    promise
      .then((res) => {
        console.log(res);

        axios
          .post(
            `${BASE_URL}/dashboard/upload`,
            {
              appwriteId: res.$id,
              userId,
              name: res.name,
              size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            }
            // {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            // }
          )
          .then((response) => {
            console.log(response.data);
            setPdf(response.data.pdf);
          })
          .catch((error) => {
            console.error(
              "There was an error uploading the PDF metadata!",
              error
            );
          })
          .finally(() => {
            setIsUploading(false);
          });
      })
      .catch((error) => {
        console.error("There was an error uploading the PDF!", error);
        setIsUploading(false);
      });
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPage(numPages);
    // console.log(numPages);
  };

  const getAudio = async () => {
    if (!pdf?.appwriteId) return;
    setLoading(true);

    const url = `${BASE_URL}/dashboard/get-pdf-audio/${pdf.appwriteId}`;

    // Try to fetch JSON/url first (backend returns a URL or { playbackUrl })
    try {
      const res = await axios.get(url, { responseType: "json" });
      console.log(res.data);

      const data = res.data.audioUrl;
      if (!data) throw new Error("No audioUrl returned from backend");

      const match = data.match(/\/files\/([^\/]+)\/view/);
      const fileId = match?.[1];
      if (!fileId) throw new Error("Could not extract fileId from audioUrl");

      const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
      const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
      const buckedId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

      if (!endpoint || !projectId || !buckedId)
        throw new Error("Missing Appwrite public env vars");

      const viewUrl = `${endpoint}/storage/buckets/${buckedId}/files/${fileId}/view?project=${projectId}&mode=admin`;

      const blobRes = await axios.get(viewUrl, { responseType: "blob" });
      const blob = new Blob([blobRes.data], {
        type: blobRes.data.type || "audio/mpeg",
      });
      const blobUrl = URL.createObjectURL(blob);

      // store for pause/resume and cleanup
      blobUrlRef.current = blobUrl;

      const audio = new Audio(blobUrl);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        // revoke when finished
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
        audioRef.current = null;
      });

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (playErr) {
        console.error("audio.play() failed:", playErr);
      }
    } catch (err) {
      console.error("getAudio error:", err);
      // fallback: if audioUrl is public and works, try to play it directly
      try {
        const maybeUrlRes = await axios.get(url, { responseType: "json" });
        const direct = maybeUrlRes.data?.audioUrl ?? maybeUrlRes.data;
        if (direct) {
          const audio = new Audio(direct);
          audioRef.current = audio;
          audio.addEventListener("ended", () => setIsPlaying(false));
          await audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((e) => {
              console.error("direct play failed:", e);
            });
        }
      } catch (_) {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  // NEW: pause/resume toggle
  const togglePause = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (!a.paused) {
      try {
        a.pause();
        setIsPlaying(false);
      } catch (e) {
        console.error("Failed to pause audio", e);
      }
    } else {
      try {
        await a.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to resume audio", e);
      }
    }
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
            <span className="text-sm text-gray-500 hidden lg:flex">
              Welcome back!
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user?.fullname.slice(0, 1).toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("userId");
                    window.location.href = "/";
                  }}
                >
                  Log out
                  {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

              {!pdf ? (
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
                          {pdf.name}
                        </p>
                        <p className="text-xs text-gray-500">{pdf.size}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pdf && <QuestionAndAnswer pdf={pdf} userId={userId} />}
            </div>

            <div className="flex flex-col gap-2 mt-8">
              <p>Uploaded PDFS</p>
              <hr />
              {user?.pdfs &&
                user.pdfs.map((pdfItem) => (
                  <div key={pdfItem._id}>
                    <button
                      onClick={() => setPdf(pdfItem)}
                      className="w-full text-left py-2 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {pdfItem.name}
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* PDF Viewer Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  PDF Viewer
                </h2>
                {file && (
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={loading}
                      onClick={() => getAudio()}
                      className="px-3 py-1 text-sm text-white bg-violet-600 rounded-md hover:bg-violet-700 transition-colors"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        "🔊 Listen"
                      )}
                    </button>
                    <button
                      onClick={togglePause}
                      disabled={!audioRef.current}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {isPlaying ? "⏸ Pause" : "▶ Resume"}
                    </button>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden h-[400px]">
                {file ? (
                  <Document
                    loading={
                      <Loader2 className="animate-spin h-10 w-10 text-indigo-600 dark:bg-[#1f2937]" />
                    }
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="mt-4 scrollbar-thin dark:bg-[#1f2937] flex-1 overflow-y-scroll h-[400px]"
                  >
                    {Array.from(new Array(numPage), (_, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        scale={scale}
                        className="shadow-lg dark:bg-[#1f2937] mb-5 w-full rounded-md px-5"
                      />
                    ))}
                  </Document>
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
      </div>

      <div className="mt-6 space-y-4 px-2 lg:p-5 py-5 max-w-5xl mx-auto">
        {chats.map((chat) => (
          <div key={chat._id} className="border rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Chats with Lume
            </h4>

            {chat.messages.map((msg) => (
              <div key={msg._id} className="mb-4">
                <div className="border rounded-md p-2 bg-gray-100">
                  <div className="flex justify-between px-5 items-center border-b pb-2 mb-2">
                    <p>Messages</p>
                    {expandedChatId === msg._id ? (
                      <ChevronDownIcon
                        className="w-4 h-4 cursor-pointer transform rotate-180"
                        onClick={() => setExpandedChatId(null)}
                      />
                    ) : (
                      <ChevronDownIcon
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => setExpandedChatId(msg._id)}
                      />
                    )}
                  </div>

                  {expandedChatId === msg._id && (
                    <p className="text-gray-800 text-xs px-5">{msg.message}</p>
                  )}
                </div>

                {msg.audioAppwriteId && (
                  <audio
                    controls
                    src={`https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${msg.audioAppwriteId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                    className="mt-2 w-full"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
