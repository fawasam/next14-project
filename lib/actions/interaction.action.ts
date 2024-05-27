"use server";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.type";
import Interaction from "@/database/interaction.model";

export async function ViewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, userId } = params;

    // update view count for the question
    await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true }
    );

    // if user alredy viewed the question, return

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (existingInteraction) {
        return console.log("User already viewed the question");
      }
    }

    // create interaction
    await Interaction.create({
      user: userId,
      question: questionId,
      action: "view",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
