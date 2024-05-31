
    const skipAmount = (page - 1) * pageSize;
     .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);


const totalQuestions = await Question.countDocuments(query);
const isNext = totalQuestions > skipAmount + users.length;

return { users, isNext };
