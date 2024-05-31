import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionsCard from "../card/QuestionsCard";
import Pagination from "./Pagination";

interface QuestionTabProps extends SearchParamsProps {
  searchParams: any;
  userId: string;
  clerkId: string | null | any;
}
const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.pageSize || 10,
  });
  return (
    <>
      {result.questions.map((question: any) => (
        <QuestionsCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes.length}
          views={question.views}
          answers={question?.answer?.length ? question.answer.length : 0}
          createdAt={question.createdAt}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default QuestionTab;
