import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { Loader2 } from "lucide-react";
import { ID, storage } from "@/lib/appwrite";
import axios from "axios";
import { BASE_URL } from "@/constant/endpoint";

type Prop = {
  userId: string | undefined;
  pdf: Pdf;
};

const QuestionAndAnswer = ({ userId, pdf }: Prop) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<
    string | undefined
  >();
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 🔹 Load available input devices
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((all) => {
        const inputs = all.filter((d) => d.kind === "audioinput");
        setDevices(inputs);
        if (inputs.length > 0) setSelectedDeviceId(inputs[0].deviceId);
      })
      .catch((err) => console.error("Error enumerating devices:", err));
  }, []);

  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
        },
      });

      setStream(userStream);
      const recorder = new MediaRecorder(userStream, {
        mimeType: "audio/webm;codecs=opus",
      });
      const localChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) localChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(localChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        userStream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error accessing mic:", err);
      alert(
        "Mic access failed. Check your system and browser permissions — especially for Chrome under Settings > Privacy > Microphone."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const uploadAudio = async () => {
    console.log(audioURL, pdf.appwriteId, userId);

    if (!audioURL || !pdf?.appwriteId || !userId) return;

    setQuestionLoading(true);

    try {
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();

      // ✅ Check allowed MIME types for your Appwrite bucket
      const allowedMimeTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/webm",
        "audio/wav",
        "audio/ogg",
        "audio/m4a",
      ];

      if (!allowedMimeTypes.includes(audioBlob.type)) {
        alert(`Unsupported audio format: ${audioBlob.type}`);
        setQuestionLoading(false);
        return;
      }

      // ✅ Pick a safe extension based on MIME type
      const extensionMap: Record<string, string> = {
        "audio/mpeg": "mp3",
        "audio/mp3": "mp3",
        "audio/webm": "webm",
        "audio/wav": "wav",
        "audio/ogg": "ogg",
        "audio/m4a": "m4a",
      };

      const ext = extensionMap[audioBlob.type] || "webm";
      const fileId = ID.unique();
      const fileName = `question.${ext}`;

      // ✅ Create a File object with safe extension
      const audioFile = new File([audioBlob], fileName, {
        type: audioBlob.type,
      });

      // ✅ Upload to Appwrite Storage
      const file = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
        fileId,
        audioFile
      );

      console.log("Uploaded file:", file.$id);

      // ✅ Notify backend
      await axios
        .post(`${BASE_URL}/dashboard/audio-question`, {
          appwriteId: file.$id,
          pdfId: pdf.appwriteId,
          userId,
        })
        .then(async (res) => {
          const audioId = res.data.audioId;
          console.log("Backend processed audio, audioId:", audioId);

          const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
          const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
          const buckedId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

          const viewUrl = `${endpoint}/storage/buckets/${buckedId}/files/${audioId}/view?project=${projectId}&mode=admin`;
          const blobRes = await axios.get(viewUrl, { responseType: "blob" });
          const blob = new Blob([blobRes.data], {
            type: blobRes.data.type || "audio/mpeg",
          });
          const blobUrl = URL.createObjectURL(blob);

          const audio = new Audio(blobUrl);

          await audio.play();
        });
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio. Please try again.");
    } finally {
      setQuestionLoading(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Ask a Question (Audio)
      </h3>

      {/* 🔹 Device selector */}
      <div className="mb-3">
        <label className="text-xs text-gray-600">Select microphone:</label>
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          className="block w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Mic ${d.deviceId}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-4">
        {!recording ? (
          <Button
            onClick={startRecording}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            🎙️ Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            ⏹ Stop Recording
          </Button>
        )}
      </div>

      {/* Playback */}
      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL} className="w-full rounded-md" />
        </div>
      )}

      {!recording && audioURL && !questionLoading && (
        <Button
          onClick={() => uploadAudio()}
          className="bg-blue-600 hover:bg-blue-700 text-white mt-3"
        >
          🚀 Send
        </Button>
      )}
    </div>
  );
};

export default QuestionAndAnswer;
