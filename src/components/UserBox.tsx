import React, { useEffect, useRef, useState } from "react";

export default function UserBox() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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
    </div>
  );
}
