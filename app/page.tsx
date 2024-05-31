import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex h-screen flex-col items-center  justify-center">
      <div className="flex flex-col items-center justify-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={80}
          height={80}
          alt="DevFlow"
        />
        <p
          className="max-sm:h1-bold h2-bold  font-spaceGrotesk text-dark-100
        dark:text-light-900 
        "
        >
          Student
          <span className="text-primary-500"> Flow</span>
        </p>
      </div>
      <p className=" text-lg">Where Student&apos;s gather together</p>
      <Link href="/question" className="mt-4 flex items-center gap-1">
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default HomePage;
