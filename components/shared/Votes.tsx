"use client";
import { ViewQuestion } from "@/lib/actions/interaction.action";
import {
  downVoteAnswer,
  downVoteQuestion,
  upVoteAnswer,
  upVoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatLargeNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupvoted: boolean;
  downvotes: number;
  hasdownvoted: boolean;
  hasSaved?: boolean;
}
const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupvoted,
  downvotes,
  hasdownvoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
    return toast({
      title: `Question ${
        !hasSaved ? "Saved In" : "Removed from  your collection"
      }`,
      variant: !hasSaved ? "default" : "destructive",
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You need to log in to perform this action",
      });
    }
    if (action === "upvote") {
      if (type === "question") {
        await upVoteQuestion({
          id: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasdownvoted,
          hasupVoted: hasupvoted,
          path: pathname,
        });
      } else if (type === "answer") {
        await upVoteAnswer({
          id: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasdownvoted,
          hasupVoted: hasupvoted,
          path: pathname,
        });
      }
      toast({
        title: `Upvote ${!hasupvoted ? "added" : "removed"}`,
        variant: !hasupvoted ? "default" : "destructive",
      });
    }
    if (action === "downvote") {
      if (type === "question") {
        await downVoteQuestion({
          id: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasdownvoted,
          hasupVoted: hasupvoted,
          path: pathname,
        });
      } else if (type === "answer") {
        await downVoteAnswer({
          id: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasdownvoted,
          hasupVoted: hasupvoted,
          path: pathname,
        });
      }
      toast({
        title: `DownVote ${!hasdownvoted ? "added" : "removed"}`,
        variant: !hasdownvoted ? "default" : "destructive",
      });
    }
  };

  useEffect(() => {
    ViewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname]);
  return (
    <div className="flex gap-5 ">
      <div className="flex-center gap-2.5 ">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={20}
            height={20}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={20}
            height={20}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={20}
          height={20}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
