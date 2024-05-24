import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const RightSidebar = () => {
  const hotQuestions = [
    {
      _id: 1,
      title: "How do I user express as a custom server in NEXTJS?",
    },
    {
      _id: 2,
      title: "How do I user express as a custom server in NEXTJS?",
    },
    {
      _id: 3,
      title: "How do I user express as a custom server in NEXTJS?",
    },
    {
      _id: 4,
      title: "How do I user express as a custom server in NEXTJS?",
    },
    {
      _id: 5,
      title: "How do I user express as a custom server in NEXTJS?",
    },
  ];

  const populatTag = [
    {
      _id: "1",
      name: "Javascript",
      totalQuestions: 5,
    },
    {
      _id: "2",
      name: "React",
      totalQuestions: 2,
    },
    {
      _id: "3",
      name: "Typescript",
      totalQuestions: 1,
    },
    {
      _id: "4",
      name: "Javascript",
      totalQuestions: 5,
    },
    {
      _id: "5",
      name: "Javascript",
      totalQuestions: 5,
    },
  ];
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar dark:shadow-none sticky right-0 top-0 flex h-screen w-[350px] flex-col  overflow-y-auto border-l p-6 pt-36  max-xl:hidden ">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((questions) => (
            <Link
              href={`/questions/${questions._id}`}
              key={questions._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {questions.title}
              </p>
              <Image
                src={"/assets/icons/chevron-right.svg"}
                alt=">"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}{" "}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {populatTag.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
