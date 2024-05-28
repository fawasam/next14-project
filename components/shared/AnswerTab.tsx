import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../card/AnswerCard";
interface AnswerTabProps extends SearchParamsProps {
  searchParams: any;
  userId: string;
  clerkId: string | null | any;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: AnswerTabProps) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page || 1,
    pageSize: searchParams.pageSize || 10,
  });
  return (
    <>
      {result.answers.map((answer: any) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          clerkId={clerkId}
          author={answer.author}
          upvotes={answer.upvotes.length}
          question={answer?.question}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};

export default AnswerTab;
