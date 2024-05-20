"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
export default function Home({}) {
  const [id, setId] = useState(uuidv4());
  const [name, setName] = useState("");
  const [invite, setInvite] = useState("");
  const router = useRouter();
  function joinRoom(){
    if(name && invite){
      router.push(`/room/${invite}?query=${name}`);
      window.location.reload();
    }
  }
  const handleCreateRoom = () => {
    setId(uuidv4());
    if (name) {
      router.push(`/room/${id}?query=${name}`);
    }
  };
  console.log(name);
  return (
    <div className="w-screen h-screen flex flex-col  items-center pt-[15%] bg-black ">
      <input
        type="text"
        className="w-[15rem] h-[3rem] rounded-md pl-[1rem] mb-[1rem] "
        placeholder=" Enter your name "
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <h1 className="text-white text-xl pt-[1rem] ">Join by link</h1>
        <input
          type="text"
          className="w-[15rem] h-[3rem] rounded-md pl-[1rem] mb-[1rem] "
          placeholder=" enter id"
          onChange={(e) => setInvite(e.target.value)}
        />
        <br />

      </div>
      <button
          onClick={handleCreateRoom}
          className="bg-purple-500 w-[10rem] h-[3rem] text-white rounded-md font-bold text-xl"
        >
          Create room
        </button>
      <button
        onClick={joinRoom}
        className="bg-purple-500 w-[10rem] mt-[1rem] h-[3rem] text-white rounded-md font-bold text-xl"
      >
        By LINK
      </button>
    </div>
  );
}
