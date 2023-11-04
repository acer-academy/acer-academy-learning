const {
  whitelistURL,
  createCentreURL,
  createTeacherURL,
  createQuizQuestionURL,
  createQuizURL,
  createStudentURL,
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
  };
  if (Math.random() > 0.2) {
    return quizData;
  }
  const { timeAllowed, ...rest } = quizData;
  return rest;
};

const generateRandomTake = () => {
  const quizToTake = getRandomItem(quizDataArray);
  let studentAnswers = [];
  for (const quizQuestion of quizToTake.quizQuestions) {
    const wrongAnswer =
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sample incorrect answer","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';
    const correctAnswers = quizQuestion.quizQuestion.answers.filter(
      (x) => x.isCorrect,
    ); //[0].answer;
    if (correctAnswers.length > 1) {
      for (const correctAnswer of correctAnswers) {
        studentAnswers.push({
          questionId: quizQuestion.quizQuestionId,
          timeTaken: Math.round(Math.random() * 30) + 30,
          studentAnswer:
            Math.random() > 0.1 ? correctAnswer.answer : wrongAnswer,
        });
      }
    } else {
      studentAnswers.push({
        questionId: quizQuestion.quizQuestionId,
        timeTaken: Math.round(Math.random() * 30) + 30,
        studentAnswer:
          Math.random() > 0.3 ? correctAnswers[0].answer : wrongAnswer,
      });
    }
  }
  const takeData = {
    timeTaken: quizToTake.timeAllowed
      ? Math.max(
          Math.round(quizToTake.timeAllowed * 0.75),
          Math.round(Math.random() * quizToTake.timeAllowed),
        )
      : 3600,
    takenById: getRandomItem(studentIdsArray),
    quizId: quizToTake.id,
    studentAnswers: studentAnswers,
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
    submittedOn: '2023-01-14T09:00:05.123Z',
    score: score,
    feedback: feedback,
    assignmentId: assignmentToTake.id,
    studentId: getRandomItem(studentIdsArray),
  };
  return assignmentAttemptData;
};

const main = async () => {
  await setupPrerequisites();
  await createRandomQuestions(numberOfQuestionsToCreate);
  await createRandomQuizzes(numberOfQuizzesToCreate);
  await createRandomTakes(numberOfTakesToCreate);
  await createRandomAssignments(numberOfAssignmentsToCreate);
  await createRandomAssignmentAttempts(numberOfAssignmentAttemptsToCreate);
};

main();
