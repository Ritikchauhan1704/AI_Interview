"use client";

import AIBox from "@/components/AIBox";
import UserBox from "@/components/UserBox";

export default function Interview() {
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
      <h1 className="flex justify-center  bg-amber-100 w-full ">
        AI Interview
      </h1>
      <div className=" flex bg-amber-600 w-full h-full justify-center items-center">
        <div className="bg-amber-300 w-full h-full">
          <AIBox />
        </div>
        <div className="bg-amber-50 w-full h-full">
          <UserBox />
        </div>
      </div>
    </div>
  );
}
