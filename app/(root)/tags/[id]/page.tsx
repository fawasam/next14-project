import { getQuestionByTagId } from "@/lib/actions/tag.action";
import React from "react";
import QuestionsCard from "@/components/card/QuestionsCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { URLProps } from "@/types";

const TagDetails = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
      <div className="mt-11 w-full">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result?.questions?.length > 0 ? (
          result?.questions?.map((question: any) => (
            <QuestionsCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question?.answer?.length ? question.answer.length : 0}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title={"Thers's no tag questions to show"}
            description={
              "Be the first to break the silence!🚀 Ask a Question and kiskstart the discussion, our query could be the next big thing others learn from, GetInvolved!💡"
            }
            link="/"
            linkTitle="All Questions"
          />
        )}
      </div>
    </>
  );
};

export default TagDetails;
