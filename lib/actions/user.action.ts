"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.type";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";

export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    // const {
    //   page = 1,
    //   pageSize = 20,
    //   filter,
    //   searchQuery,
    // } = params as GetAllUsersParams;

    const users = await User.find({}).sort({ createdAt: -1 });

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(UserData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(UserData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(UserData: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = UserData;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user from db
    // question, answers, comment etc

    // get user question ids
    // const userQuestionIds =
    await Question.find({ author: user._id }).distinct("_id");

    await Question.deleteMany({ author: user._id });

    // delete user answer

    const deletedUser = await User.findOneAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params as ToggleSaveQuestionParams;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const {
      clerkId,
      page = 1,
      pageSize = 10,
      // filter,
      searchQuery,
    } = params as GetSavedQuestionsParams;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
        limit: pageSize,
        skip: (page - 1) * pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) throw new Error("User not found");

    const savedQuestions = user.saved;
    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
