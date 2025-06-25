"use client"
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  useEffect(() => {
    toast.message("hello wold");
  }, []);

  return <div>Home</div>;
}
