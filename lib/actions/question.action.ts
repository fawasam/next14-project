"use server";

import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  VoteParams,
} from "./shared.type";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

async function handleVote({
  id,
  userId,
  hasdownVoted,
  hasupVoted,
  path,
  voteType,
  model,
  modelName,
}: VoteParams & { voteType: "upvote" | "downvote"; model: any }) {
  try {
    connectToDatabase();

    let updateQuery = {};
    if (voteType === "upvote") {
      if (hasupVoted) {
        updateQuery = { $pull: { upvotes: userId } };
      } else if (hasdownVoted) {
        updateQuery = {
          $push: { upvotes: userId },
          $pull: { downvotes: userId },
        };
      } else {
        updateQuery = { $addToSet: { upvotes: userId } };
      }
    } else if (voteType === "downvote") {
      if (hasdownVoted) {
        updateQuery = { $pull: { downvotes: userId } };
      } else if (hasupVoted) {
        updateQuery = {
          $push: { downvotes: userId },
          $pull: { upvotes: userId },
        };
      } else {
        updateQuery = { $addToSet: { downvotes: userId } };
      }
    }

    const item = await model.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    const reputationChange =
      modelName === "Answer"
        ? hasupVoted || hasdownVoted
          ? -2
          : 2
        : hasupVoted || hasdownVoted
        ? -1
        : 1;
    const answerReputationChange = hasupVoted || hasdownVoted ? -10 : 10;

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: reputationChange },
    });

    await User.findByIdAndUpdate(item.author, {
      $inc: { reputation: answerReputationChange },
    });

    if (!item) throw new Error(`${model.modelName} not found`);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestions(params?: GetQuestionsParams) {
  try {
    connectToDatabase();

    const {
      searchQuery,
      filter,
      page = 1,
      pageSize = 10,
    } = params as GetQuestionsParams;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answer = { $size: 0 };
        break;
      default:
        break;
    }
    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);
    // 100 questions, skipped 4 pages 20*4 = 80, 100-80 = 20
    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params?: CreateQuestionParams) {
  // eslint-disable-next-line no-empty
  try {
    connectToDatabase();

    const { title, content, tags, author, path } =
      params as CreateQuestionParams;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for the user's ask_questions action
    await Interaction.create({
      user: author,
      question: question._id,
      action: "ask_question",
      tags: tagDocuments,
    });
    //  increment author's reputation by 5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionById(params?: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params as GetQuestionByIdParams;

    const questions = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upVoteQuestion(params: VoteParams) {
  return handleVote({
    ...params,
    voteType: "upvote",
    model: Question,
    modelName: "question",
  });
}

export async function downVoteQuestion(params: VoteParams) {
  return handleVote({
    ...params,
    voteType: "downvote",
    model: Question,
    modelName: "question",
  });
}

export async function upVoteAnswer(params: VoteParams) {
  return handleVote({
    ...params,
    voteType: "upvote",
    model: Answer,
    modelName: "answer",
  });
}

export async function downVoteAnswer(params: VoteParams) {
  return handleVote({
    ...params,
    voteType: "downvote",
    model: Answer,
    modelName: "answer",
  });
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function EditQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path, content, title } = params;
    const question = await Question.findById(questionId).populate("tags");

    if (!question) throw new Error("Question not found");
    question.title = title;
    question.content = content;
    await question.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({ upvotes: -1, views: -1 })
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
