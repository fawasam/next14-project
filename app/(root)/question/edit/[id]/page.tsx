import QuestionForm from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const QuestionEdit = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const user = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm
          type="Edit"
          mongoUserId={user._id}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default QuestionEdit;
