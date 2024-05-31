import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Props {
  _id: string;
  clerkId?: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: {
    name: string;
    _id: string;
    picture: string;
    clerkId: string;
  };
  upvotes: number;
  views: number;
  answers: number;
  createdAt: string;
}
const QuestionsCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
  clerkId,
}: Props) => {
  const showActionButton = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] border  p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButton && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      {/* if signed in add edit delete actions */}

      {/* map through tags */}
      <div className="mt-2 flex gap-2">
        {tags.map((tag) => (
          <RenderTag _id={tag._id} name={tag.name} key={tag._id} />
        ))}
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

        <div className="flex  items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatLargeNumber(upvotes)}
            title="Votes"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatLargeNumber(answers)}
            title="Answers"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatLargeNumber(views)}
            title="Views"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
