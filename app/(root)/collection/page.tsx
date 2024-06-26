import QuestionsCard from "@/components/card/QuestionsCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

const Collection = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  if (!userId)
    return (
      <NoResult
        title={"Please login to save questions"}
        description={
          "Be the first to break the silence!🚀 Ask a Question and kiskstart the discussion, our query could be the next big thing others learn from, GetInvolved!💡"
        }
        link="/"
        linkTitle="All Questions"
      />
    );

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
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
            title={"Thers's no saved questions to show"}
            description={
              "Be the first to break the silence!🚀 Ask a Question and kiskstart the discussion, our query could be the next big thing others learn from, GetInvolved!💡"
            }
            link="/"
            linkTitle="All Questions"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};
export default Collection;
