const {
  whitelistURL,
  createCentreURL,
  createTeacherURL,
  createQuizQuestionURL,
  createQuizURL,
  createStudentURL,
  getStudentByIdURL,
  createTakeURL,
  createAssignmentAttemptURL,
  createAssignmentURL,
  randomFirstNames,
  randomLastNames,
  QuizQuestionTypeEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTopicEnum,
  QuizQuestionDifficultyEnum,
  LevelEnum,
  answers,
  answers2,
  adminURL,
} = require('./generatorMockData');
const axios = require('axios');

const args = process.argv.slice(2);

const setArgumentValue = (arg, defaultValue) => {
  const index = args.indexOf(arg);
  if (index !== -1 && index + 1 < args.length) {
    const value = parseInt(args[index + 1]);
    return isNaN(value) ? defaultValue : value;
  }
  return defaultValue;
};

const numberOfStudentsToCreate = setArgumentValue('--students', 20);
const numberOfQuestionsToCreate = setArgumentValue('--questions', 1000);
const numberOfQuizzesToCreate = setArgumentValue('--quizzes', 100);
const numberOfTakesToCreate = setArgumentValue('--takes', 500);
const numberOfAssignmentsToCreate = setArgumentValue('--assignments', 100);
const numberOfAssignmentAttemptsToCreate = setArgumentValue('--attempts', 500);
const numberOfTakesToCreateForStudents = setArgumentValue(
  '--takesForStudents',
  10,
);

console.log(
  `
  Usage: node quizQuestionsGenerator.js --students 20 --questions 1000 --quizzes 100 --takes 500 --assignments 100 --attempts 500\n
  ========== Args Parsed ==========
  Students:${numberOfStudentsToCreate}
  Questions: ${numberOfQuestionsToCreate}
  Quizzes: ${numberOfQuizzesToCreate}
  Takes: ${numberOfTakesToCreate}
  Assignments: ${numberOfAssignmentsToCreate}
  Attempts: ${numberOfAssignmentAttemptsToCreate}
  =================================
  \nCreating...\n`,
);

let placeholderTeacherId = '';
let questionIndexesArray = [];
let quizDataArray = [];
let studentIdsArray = [];
let assignmentDataArray = [];

const getRandomItem = (array) => {
  const uniqueItems = [...new Set(array)];
  return uniqueItems[Math.floor(Math.random() * uniqueItems.length)];
};

const setupPrerequisites = async () => {
  try {
    const startTime = Date.now();
    // Additional super-admin and admin creation
    const createSuperAdminResponse = await axios.post(`${adminURL}/register`, {
      email: 'su@su.com',
      firstName: 'super',
      lastName: 'admin',
      password: 'password',
      type: 'SUPER_ADMIN',
    });
    const whitelistResponse = await axios.post(whitelistURL, {
      email: 'teacher@teacher.com',
      role: 'TEACHER',
    });
    const createCentreResponse = await axios.post(createCentreURL, {
      name: 'Acer Academy',
      address: 'Address Line Placeholder',
    });
    const createTeacherResponse = await axios.post(createTeacherURL, {
      email: 'teacher@teacher.com',
      firstName: 'Teacher',
      lastName: 'One',
      password: 'password',
      centreId: createCentreResponse.data.id,
      subjects: ['MATHEMATICS'],
      levels: ['P3'],
    });
    placeholderTeacherId = createTeacherResponse.data.id;

    for (let i = 1; i < numberOfStudentsToCreate; i++) {
      const whitelistStudentResponse = await axios.post(whitelistURL, {
        email: `student${i}@student.com`,
        role: 'STUDENT',
      });
      const createStudentResponse = await axios.post(createStudentURL, {
        firstName: getRandomItem(randomFirstNames),
        lastName: getRandomItem(randomLastNames),
        email: `student${i}@student.com`,
        password: 'password',
        level: getRandomItem(LevelEnum),
        subjects: ['MATHEMATICS'],
        school: 'School Placeholder',
        phoneNumber: '90909090',
        centreId: createCentreResponse.data.id,
        whitelistItemId: whitelistStudentResponse.data.id,
        parents: {
          create: [
            {
              firstName: `Parent${i}`,
              lastName: 'One',
              phoneNumber: '80808080',
            },
          ],
        },
      });
      studentIdsArray.push(createStudentResponse.data.student.id);
    }
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `${numberOfStudentsToCreate} students created successfully (${duration} ms).`,
    );
  } catch (error) {
    console.log('Error creating placeholder data', error);
  }
};

const createRandomQuestions = async (count) => {
  try {
    const startTime = Date.now();
    for (let i = 0; i < count; i++) {
      const questionData = generateRandomQuestion();
      const createQuestionResponse = await axios.post(
        createQuizQuestionURL,
        questionData,
      );
      questionIndexesArray.push(createQuestionResponse.data.id);
    }
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `${numberOfQuestionsToCreate} questions created successfully (${duration} ms).`,
    );
  } catch (error) {
    console.error('Error creating questions:', error);
  }
};

const createRandomQuizzes = async (count) => {
  try {
    const startTime = Date.now();
    for (let i = 0; i < count; i++) {
      const quizData = generateRandomQuiz(i);
      const createQuizResponse = await axios.post(createQuizURL, quizData);
      quizDataArray.push(createQuizResponse.data);
    }
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `${numberOfQuizzesToCreate} quizzes created successfully (${duration} ms).`,
    );
  } catch (error) {
    console.error('Error creating quizzes:', error);
  }
};

const createRandomTakes = async (count) => {
  try {
    const startTime = Date.now();
    for (let i = 0; i < count; i++) {
      const takeData = generateRandomTake();
      const createTakeResponse = await axios.post(createTakeURL, takeData);
    }
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `${numberOfTakesToCreate} takes created successfully (${duration} ms).`,
    );
  } catch (error) {
    console.error('Error creating takes:', error);
  }
};

const createRandomAssignments = async (count) => {
  try {
    const startTime = Date.now();
    for (let i = 0; i < count; i++) {
      const assignmentData = generateRandomAssignment(i);
      const createAssignmentResponse = await axios.post(
        createAssignmentURL,
        assignmentData,
      );
      assignmentDataArray.push(createAssignmentResponse.data);
    }
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `${numberOfAssignmentsToCreate} assignments created successfully (${duration} ms).`,
    );
  } catch (error) {
    console.error('Error creating assignments:', error);
  }
};

const createRandomAssignmentAttempts = async (count) => {
  try {
    const startTime = Date.now();
    for (let i = 0; i < count; i++) {
      const assignmentAttemptData = generateRandomAssignmentAttempt();
      const createAssignmentAttemptResponse = await axios.post(
        createAssignmentAttemptURL,
        assignmentAttemptData,
      );
    }
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `${numberOfAssignmentAttemptsToCreate} attempts created successfully (${duration} ms).\n`,
    );
  } catch (error) {
    console.error('Error creating attempts:', error);
  }
};

const generateRandomQuestion = () => {
  const questionType = getRandomItem(Object.values(QuizQuestionTypeEnum));
  const randomTopicsLength = Math.min(Math.floor(Math.random() * 3) + 1, 4);
  const randomLevelsLength = Math.min(Math.floor(Math.random() * 3) + 1, 2);

  const randomTopics = Array.from({ length: randomTopicsLength }, () =>
    getRandomItem(QuizQuestionTopicEnum),
  );

  const randomLevels = Array.from({ length: randomLevelsLength }, () =>
    getRandomItem(LevelEnum),
  );

  switch (questionType) {
    case QuizQuestionTypeEnum.TFQ:
      return {
        topics: randomTopics,
        levels: randomLevels,
        difficulty: getRandomItem(QuizQuestionDifficultyEnum),
        questionText:
          '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a TFQ sample","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        status: getRandomItem(QuizQuestionStatusEnum),
        questionType: QuizQuestionTypeEnum.TFQ,
        answers,
      };
    case QuizQuestionTypeEnum.MCQ:
      return {
        topics: randomTopics,
        levels: randomLevels,
        difficulty: getRandomItem(QuizQuestionDifficultyEnum),
        questionText:
          '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a MCQ sample","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        status: getRandomItem(QuizQuestionStatusEnum),
        questionType: QuizQuestionTypeEnum.MCQ,
        answers,
      };
    case QuizQuestionTypeEnum.MRQ:
      return {
        topics: randomTopics,
        levels: randomLevels,
        difficulty: getRandomItem(QuizQuestionDifficultyEnum),
        questionText:
          '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a MRQ sample","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        status: getRandomItem(QuizQuestionStatusEnum),
        questionType: QuizQuestionTypeEnum.MRQ,
        answers: [...answers, ...answers2],
      };
    case QuizQuestionTypeEnum.SHORT_ANSWER:
      return {
        topics: randomTopics,
        levels: randomLevels,
        difficulty: getRandomItem(QuizQuestionDifficultyEnum),
        questionText:
          '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a short answer sample","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        status: getRandomItem(QuizQuestionStatusEnum),
        questionType: QuizQuestionTypeEnum.SHORT_ANSWER,
        answers: [...answers, ...answers2],
      };
    default:
      return generateTFQ();
  }
};

const generateRandomQuiz = (titleIdx) => {
  const quizQuestionsTaken = [];
  const randomTopicsLength = Math.min(Math.floor(Math.random() * 3) + 1, 4);
  const randomLevelsLength = Math.min(Math.floor(Math.random() * 3) + 1, 2);
  const randomTopics = Array.from({ length: randomTopicsLength }, () =>
    getRandomItem(QuizQuestionTopicEnum),
  );
  const randomLevels = Array.from({ length: randomLevelsLength }, () =>
    getRandomItem(LevelEnum),
  );
  let randomQuestionsLength = Math.min(Math.floor(Math.random() * 20) + 1, 20);
  randomQuestionsLength =
    randomQuestionsLength > numberOfQuestionsToCreate
      ? numberOfQuestionsToCreate
      : randomQuestionsLength;
  let totalMarks = 0;
  let quizQuestions = [];
  for (let i = 1; i <= randomQuestionsLength; i++) {
    let quizQuestionId = getRandomItem(questionIndexesArray);
    while (quizQuestionsTaken.includes(quizQuestionId)) {
      quizQuestionId = getRandomItem(questionIndexesArray);
    }
    quizQuestionsTaken.push(quizQuestionId);
    const qsMarks = Math.min(Math.floor(Math.random() * 5) + 1, 5);
    quizQuestions.push({
      quizQuestionId: quizQuestionId,
      quizQuestionIndex: i,
      quizQuestionMarks: qsMarks,
    });
    totalMarks += qsMarks;
  }
  const isPublic = Math.random() > 0.2;
  const quizData = {
    title: `${randomLevels[0]} ${randomTopics[0]
      .split('_')
      .map((x) => {
        x = x.toLowerCase();
        return x.charAt(0).toUpperCase() + x.slice(1);
      })
      .reduce((x, y) => `${x} ${y}`)} Quiz ${titleIdx + 1}`,
    description:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a sample quiz.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    subject: 'MATHEMATICS',
    levels: randomLevels,
    topics: randomTopics,
    totalMarks: totalMarks,
    rewardPoints: Math.min(Math.floor(Math.random() * 10) + 1, 10),
    rewardMinimumMarks: Math.round(totalMarks * 0.8),
    teacherCreated: placeholderTeacherId,
    isPublic: isPublic,
    allocatedTo: isPublic
      ? []
      : studentIdsArray.slice(Math.random() * studentIdsArray.length),
    timeAllowed: Math.max(Math.floor(Math.random() * 7200) + 1, 600),
    quizQuestions: quizQuestions,
    createdAt: getRandomPastOrFutureDate(),
  };
  if (Math.random() > 0.2) {
    return quizData;
  }
  const { timeAllowed, ...rest } = quizData;
  return rest;
};

const getRandomPastOrFutureDate = (dateToBeCurrent, isFuture) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const millisecondsPerWeek = 7 * millisecondsPerDay;
  const millisecondsPerYear = 365 * millisecondsPerDay;
  const currentDate = dateToBeCurrent ? new Date(dateToBeCurrent) : new Date();
  const now = Date.now();
  const diffInMilliseconds = Math.abs(now - currentDate.getTime());
  const daysRange = isFuture
    ? Math.min(Math.floor(diffInMilliseconds / millisecondsPerDay), 7)
    : 7;
  const weeksRange = isFuture
    ? Math.min(Math.floor(diffInMilliseconds / millisecondsPerWeek), 52)
    : 52;
  const yearRange = isFuture
    ? Math.min(Math.floor(diffInMilliseconds / millisecondsPerYear), 10)
    : 10;

  const randomValue = Math.random();
  const shouldBeWithinYear = isFuture ? randomValue > 0.3 : false;

  // Get a random number of years, weeks, and days to subtract (or add)
  const yearsAgo = shouldBeWithinYear
    ? yearRange
    : Math.floor(Math.random() * yearRange);
  const weeksAgo = Math.floor(Math.random() * weeksRange); // 52 weeks in a year
  const daysAgo = Math.floor(Math.random() * daysRange); // 7 days in a week

  // Calculate the total milliseconds to subtract
  const totalMillisecondsAgo =
    yearsAgo * millisecondsPerYear + // Years to milliseconds
    weeksAgo * millisecondsPerWeek + // Weeks to milliseconds
    daysAgo * millisecondsPerDay; // Days to milliseconds

  // Calculate the random past date
  const randomPastOrFutureDate = isFuture
    ? currentDate.getTime() + totalMillisecondsAgo
    : currentDate.getTime() - totalMillisecondsAgo;

  const randomPastDate = new Date(randomPastOrFutureDate);

  return randomPastDate;
};

const generateRandomTake = (customQuizToTake, customStudentIdToTake) => {
  const quizToTake = customQuizToTake ?? getRandomItem(quizDataArray);
  let studentAnswers = [];
  for (const quizQuestion of quizToTake.quizQuestions) {
    const wrongOpenEndedAnswer =
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sample incorrect open-ended answer","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';
    const wrongAnswer =
      quizQuestion.quizQuestion.questionType ===
      QuizQuestionTypeEnum.SHORT_ANSWER
        ? wrongOpenEndedAnswer
        : quizQuestion.quizQuestion.answers.filter((x) => !x.isCorrect)?.[0]
            ?.answer;
    const correctAnswers = quizQuestion.quizQuestion.answers.filter(
      (x) => x.isCorrect,
    ); //[0].answer;
    if (correctAnswers.length > 1) {
      for (const correctAnswer of correctAnswers) {
        const inputCorrectAnswer = Math.random() > 0.1;
        if (!inputCorrectAnswer || wrongAnswer) {
          studentAnswers.push({
            questionId: quizQuestion.quizQuestionId,
            timeTaken: Math.round(Math.random() * 30) + 30,
            studentAnswer: inputCorrectAnswer
              ? correctAnswer.answer
              : wrongAnswer,
          });
        }
      }
    } else {
      const inputCorrectAnswer = Math.random() > 0.3;
      if (!inputCorrectAnswer || wrongAnswer) {
        studentAnswers.push({
          questionId: quizQuestion.quizQuestionId,
          timeTaken: Math.round(Math.random() * 30) + 30,
          studentAnswer: inputCorrectAnswer
            ? correctAnswers[0].answer
            : wrongAnswer,
        });
      }
    }
  }
  const takeData = {
    timeTaken: quizToTake.timeAllowed
      ? Math.max(
          Math.round(quizToTake.timeAllowed * 0.75),
          Math.round(Math.random() * quizToTake.timeAllowed),
        )
      : 3600,
    takenById: customStudentIdToTake ?? getRandomItem(studentIdsArray),
    quizId: quizToTake.id,
    studentAnswers: studentAnswers,
    attemptedAt: getRandomPastOrFutureDate(quizToTake.createdAt, true),
  };
  return takeData;
};

const generateRandomAssignment = (titleIdx) => {
  const randomLevelsLength = Math.min(Math.floor(Math.random() * 3) + 1, 2);
  const randomLevels = Array.from({ length: randomLevelsLength }, () =>
    getRandomItem(LevelEnum),
  );
  const assignmentData = {
    title: `${randomLevels[0]} ${getRandomItem(QuizQuestionTopicEnum)
      .split('_')
      .map((x) => {
        x = x.toLowerCase();
        return x.charAt(0).toUpperCase() + x.slice(1);
      })
      .reduce((x, y) => `${x} ${y}`)} Assignment ${titleIdx + 1}`,
    description:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a sample assignment.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    subject: 'MATHEMATICS',
    levels: randomLevels,
    totalMarks: Math.round(Math.random() * 80) + 20,
    teacherId: placeholderTeacherId,
    fileName: 'Maths-Refresher-Workbook-1.pdf',
    fileUrl:
      'https://www.jcu.edu.au/__data/assets/pdf_file/0006/115548/Maths-Refresher-Workbook-1.pdf',
    dueDate: '2023-01-14T09:00:05.123Z',
  };
  return assignmentData;
};

const generateRandomAssignmentAttempt = () => {
  const assignmentToTake = getRandomItem(assignmentDataArray);
  const score =
    (Math.random() * assignmentToTake.totalMarks * 2) / 3 +
    (1 / 3) * assignmentToTake.totalMarks;
  let feedback;
  if (score < assignmentToTake.totalMarks / 4) {
    feedback = 'Student has a poor understanding of topics tested';
  } else if (score < assignmentToTake.totalMarks / 2) {
    feedback = 'Student needs much improvement';
  } else if (score < (assignmentToTake.totalMarks / 100) * 65) {
    feedback = 'Student has a basic understanding of content tested';
  } else if (score < (assignmentToTake.totalMarks / 100) * 80) {
    feedback =
      'Student has achieved a satisfactory grade with room for improvement';
  } else {
    feedback = 'Student has a good understanding of topics tested';
  }
  const assignmentAttemptData = {
    submittedOn: getRandomPastOrFutureDate(),
    score: score,
    feedback: feedback,
    assignmentId: assignmentToTake.id,
    studentId: getRandomItem(studentIdsArray),
  };
  return assignmentAttemptData;
};

const createMultipleTakesForStudents = async (count) => {
  for (const studentId of studentIdsArray) {
    const start = Date.now();
    const response = await axios.get(`${getStudentByIdURL}/${studentId}`);
    const student = response.data.student;
    const studentLevel = student.level;
    const quizToTake = quizDataArray.find((quiz) =>
      quiz.levels.includes(studentLevel),
    );
    if (quizToTake) {
      for (let i = 0; i < count ?? 10; i++) {
        const takeData = generateRandomTake(quizToTake, student.id);
        await axios.post(createTakeURL, takeData);
      }
    }
    const end = Date.now();
    console.log(
      `${count} takes (to view in quiz analytics) created successfully for ${
        student.firstName
      } (${end - start} ms).`,
    );
  }
};

const main = async () => {
  await setupPrerequisites();
  await createRandomQuestions(numberOfQuestionsToCreate);
  await createRandomQuizzes(numberOfQuizzesToCreate);
  await createRandomTakes(numberOfTakesToCreate);
  await createMultipleTakesForStudents(numberOfTakesToCreateForStudents);
  await createRandomAssignments(numberOfAssignmentsToCreate);
  await createRandomAssignmentAttempts(numberOfAssignmentAttemptsToCreate);
};

main();
