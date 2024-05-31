import Link from "next/link";
import React from "react";
import Metric from "../shared/Metric";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Props {
  _id: string;
  clerkId?: string;
  author: {
    name: string;
    _id: string;
    picture: string;
    clerkId: string;
  };
  upvotes: number;
  question: {
    _id: string;
    title: string;
  };
  createdAt: string;
}
const AnswerCard = ({
  _id,
  clerkId,
  author,
  upvotes,
  question,
  createdAt,
}: Props) => {
  const showActionButton = clerkId && clerkId === author.clerkId;

  return (
    <Link
      href={`/question/${question?._id}/#${_id}`}
      className="card-wrapper rounded-[10px] border  py-9 sm:px-11"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </div>
        <SignedIn>
          {showActionButton && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="User"
          value={author.name}
          href={`/profile/${author._id}`}
          isAuthor
          title={`- asked ${getTimeStamp(createdAt)}`}
          textStyle="body-medium text-dark400_light700"
        />

        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          // value={"12"}
          value={formatLargeNumber(upvotes)}
          title="Votes"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
    </Link>
  );
};

export default AnswerCard;
