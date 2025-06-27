import React, { useEffect, useRef, useState } from "react";

export default function UserBox() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);

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

  // Voice to text logic (auto start)
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      (!("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window))
    ) {
      setIsSpeechSupported(false);
      return;
    }
    setIsSpeechSupported(true);
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript((prev) => prev + finalTranscript);
      setInput((prev) => prev + finalTranscript + interimTranscript);
    };
    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event);
    };
    recognitionRef.current.start();
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log the response
    console.log("User response:", input);
    // Optionally, clear input after submit
    // setInput("");
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-4 bg-white rounded-lg shadow-md">
      <div className="text-lg font-semibold mb-2">UserBox</div>
      <video
        ref={videoRef}
        width={320}
        height={240}
        autoPlay
        className="rounded-lg border border-gray-300 mb-4 shadow"
      />
      {isSpeechSupported ? (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col items-center"
        >
          <div className="flex items-center w-full mb-2">
            <span className="text-2xl mr-2" title="Voice capture active">
              🎤
            </span>
            <span className="text-gray-500 text-sm">
              Voice capture is active. You can also type or edit your response
              below.
            </span>
          </div>
          <textarea
            className="w-full h-28 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none mb-2 bg-amber-50"
            value={input}
            onChange={handleInputChange}
            placeholder="Your response will appear here..."
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded shadow transition-colors"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="text-red-500 mt-2">
          Speech recognition is not supported in this browser.
        </div>
      )}
    </div>
  );
}
