import React, { useEffect, useRef, useState } from "react";

export default function UserBox() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Voice to text logic
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + event.results[i][0].transcript + " ");
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };
    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event);
    };
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleRecord = () => {
    if (!recognitionRef.current) return;
    if (!isRecording) {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const isSpeechSupported =
    typeof window !== "undefined" &&
    ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition);

  return (
    <div>
      <div>UserBox</div>
      <video
        ref={videoRef}
        width={320}
        height={240}
        autoPlay
        style={{ display: "block", margin: "10px 0" }}
      />
      {isSpeechSupported ? (
        <div>
          <button onClick={handleRecord} style={{ marginBottom: 10 }}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          <div
            style={{
              minHeight: 40,
              background: "#f3f3f3",
              padding: 8,
              borderRadius: 4,
            }}
          >
            <strong>Transcript:</strong> {transcript}
          </div>
        </div>
      ) : (
        <div style={{ color: "red" }}>
          Speech recognition is not supported in this browser.
        </div>
      )}
    </div>
  );
}
