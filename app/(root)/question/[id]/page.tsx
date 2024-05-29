import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseCode from "@/components/shared/ParseCode";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    page: string;
    filter: string;
  };
};
const page = async ({ params, searchParams }: Props) => {
  const result = await getQuestionById({ questionId: params.id });

  const { userId: clerkId } = auth();
  let user;
  if (clerkId) {
    user = await getUserById({ userId: clerkId });
  }
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author?.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(user._id)}
              upvotes={result.upvotes.length}
              hasupvoted={result.upvotes.includes(user._id)}
              downvotes={result.downvotes.length}
              hasdownvoted={result.downvotes.includes(user._id)}
              hasSaved={user.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="Upvotes"
            // value={"12"}
            value={` asked ${getTimeStamp(result.createdAt)}`}
            title="Asked"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            // value={"12"}
            value={formatLargeNumber(result.answers.length)}
            title="Answers"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            // value={"12"}
            value={formatLargeNumber(result.views)}
            title="Views"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
      <ParseCode data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <AllAnswers
        questionId={result._id}
        userId={user._id}
        page={searchParams.page}
        filter={searchParams.filter}
        totalAnswers={result.answers.length}
      />
      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(user._id)}
      />
    </>
  );
};

export default page;
