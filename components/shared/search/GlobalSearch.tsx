"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";

const GlobalSearch = () => {
  const [value, setvalue] = useState("");
  return (
    <div className="max-lg:hidden relative w-full max-w-[600px]">
      <div className="background-light800_darkgradient realtive rounded-xl flex min-h-[56px] grow items-center gap-1 px-4">
        <Image
          src={"/assets/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search ..."
          onChange={(e) => setvalue(e.target.value)}
          value={value}
          className="paragraph-regular no-focus placeholder background-light800_darkgradient  shadow-none border-none outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
