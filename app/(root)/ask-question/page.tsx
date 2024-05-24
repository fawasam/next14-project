import QuestionForm from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestions = async () => {
  // const { userId } = auth();
  const userId = "clerk12345";
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });
  console.log(mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask Question</h1>
      <div className="mt-9">
        <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default AskQuestions;
