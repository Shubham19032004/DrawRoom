"use client"
import React, { useState } from "react";
export default function ShareUrl({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const [visible,setVisible]=useState<boolean>(false)
  const toggleVisibility = () => {
    //@ts-ignore
    setVisible(prev => !prev);
  };
  return (
    <div className=" right-[2rem]     z-40">
      <button 
      //@ts-ignore
      onClick={toggleVisibility}
      className="text-xl font-bold bg-indigo-500 text-white w-[7rem] h-[3rem] rounded-md">
        Share
      </button>
      {visible?<div className="bg-slate-50 absolute w-[40rem] h-[15rem] md:right-[20vh] lg:right-[60vh] top-[30vh]">
        <button 
        onClick={toggleVisibility}
        className="absolute top-[-1rem] right-[-1rem] justify-end bg-slate-300 rounded-full text-xl w-[2rem] h-[2rem] text-white font-bold">
          X</button>
          <div className="flex flex-col justify-center py-[3rem] px-[3rem] ">
            <label className="text-xl font-bold py-[1rem] ">
              Copy url
            </label>
            <div className=" flex">
            <input  className={`border-0 focus-visible:ring-0 w-[90%] text-black focus-visible:ring-offset-0 ${copied?'bg-indigo-500 text-white' :'bg-zinc-300/50 '}`} value={id} disabled></input>
            <button onClick={onCopy} className="bg-zinc-500 w-[5rem] text-white rounded-r-md ml-[2px]">c</button>
            </div>
          </div>
        
      </div>:<></>

      }

    </div>
  );
}
