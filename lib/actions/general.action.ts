"use server";

import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.type";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const SearchableTypes = ["question", "user", "answer", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params as SearchParams;

    const regexQuery = { $regex: query, $options: "i" };
    let result = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // search across everything
      for (const { model, searchField, type } of modelsAndTypes) {
        const searchQuery = { [searchField]: regexQuery };

        const searchResult = await model.find(searchQuery).limit(2);
        result.push(
          ...searchResult.map((item) => ({
            title:
              type === "answer"
                ? `Answer containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.question
                : item._id,
          }))
        );
      }
      return JSON.stringify(result);
    } else {
      //  search only in the specified type
      const modelInfo = modelsAndTypes.find(
        (model: any) => model.type === typeLower
      );

      if (!modelInfo) throw new Error("Invalid type provided for search");
      const searchQuery = { [modelInfo.searchField]: regexQuery };

      const searchResult = await modelInfo.model.find(searchQuery).limit(5);

      result = searchResult.map((item) => ({
        title:
          type === "answer"
            ? `Answer containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question
            : item._id,
      }));
      return JSON.stringify(result);
    }
  } catch (error) {
    console.log(`Error in globalSearch: ${error}`);
    throw error;
  }
}
