const axios = require('axios');

const whitelistURL = 'http://localhost:8000/api/v1/whitelist/create';
const createCentreURL = 'http://localhost:8000/api/v1/centres';
const createTeacherURL = 'http://localhost:8000/api/v1/teachers';
const createQuizQuestionURL = 'http://localhost:8000/api/v1/quiz-questions/';
const createQuizURL = 'http://localhost:8000/api/v1/quiz';
const createStudentURL = 'http://localhost:8000/api/v1/students/create';
const createTakeURL = 'http://localhost:8000/api/v1/take';

let placeholderTeacherId = '';
let questionIndexesArray = [];
let quizDataArray = [];
let studentIdsArray = [];

const getRandomItem = (array) => {
  const uniqueItems = [...new Set(array)];
  return uniqueItems[Math.floor(Math.random() * uniqueItems.length)];
};

const QuizQuestionTopicEnum = [
  'WHOLE_NUMBERS',
  'MONEY',
  'MEASUREMENT',
  'GEOMETRY',
  'DATA_REPRESENTATION_AND_INTERPRETATION',
  'FRACTIONS',
  'AREA_AND_VOLUME',
  'DECIMALS',
  'PERCENTAGE',
  'RATIO',
  'RATE_AND_SPEED',
  'DATA_ANALYSIS',
  'ALGEBRA',
  'NUMBERS_AND_OPERATIONS',
  'RATIO_AND_PROPORTION',
  'ALGEBRAIC_EXPRESSIONS_AND_FORMULAE',
  'FUNCTIONS_AND_GRAPHS',
  'EQUATIONS_AND_INEQUALITIES',
  'SET_LANGUAGE_AND_NOTATION',
  'MATRICES',
  'ANGLES_TRIANGLES_AND_POLYGONS',
  'CONGRUENCE_AND_SIMILARITY',
  'PROPERTIES_OF_CIRCLES',
  'PYTHAGORAS_THEOREM_AND_TRIGONOMETRY',
  'MENSURATION',
  'COORDINATE_GEOMETRY',
  'VECTORS_IN_2D',
  'DATA_HANDLING_AND_ANALYSIS',
  'PROBABILITY',
  'SEQUENCE_AND_SERIES',
  'VECTORS',
  'INTRODUCTION_TO_COMPLEX_NUMBERS',
  'CALCULUS',
  'PROBABILITY_AND_STATISTICS',
];

const LevelEnum = [
  'P1',
  'P2',
  'P3',
  'P4',
  'P5',
  'P6',
  'S1',
  'S2',
  'S3',
  'S4',
  'S5',
  'J1',
  'J2',
];

const QuizQuestionDifficultyEnum = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];

const QuizQuestionStatusEnum = [
  'READY',
  'READY',
  'READY',
  'READY',
  'READY',
  'DRAFT',
  'DISABLED',
];

const QuizQuestionTypeEnum = {
  MCQ: 'MCQ',
  MRQ: 'MRQ',
  TFQ: 'TFQ',
  SHORT_ANSWER: 'SHORT_ANSWER',
};

const numberOfQuestionsToCreate = 500;
const numberOfQuizzesToCreate = 50;
const numberOfTakesToCreate = 100;

const setupPrerequisites = async () => {
  try {
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
    // console.log(
    //   'Prerequisite teacher successfully created:',
    //   (placeholderTeacherId),
    // );
    for (let i = 1; i < 10; i++) {
      const whitelistStudentResponse = await axios.post(whitelistURL, {
        email: `student${i}@student.com`,
        role: 'STUDENT',
      });
      const createStudentResponse = await axios.post(createStudentURL, {
        firstName: `Student${i}`,
        lastName: `Student${i}`,
        email: `student${i}@student.com`,
        password: 'password',
        level: getRandomItem(LevelEnum),
        subjects: ['MATHEMATICS'],
        school: 'School Placeholder',
        phoneNumber: '90909090',
        centreId: createCentreResponse.data.id,
        whitelistItemId: whitelistStudentResponse.data.id,
      });
      studentIdsArray.push(createStudentResponse.data.student.id);
      // console.log(
      //   'Prerequisite student successfully created:',
      //   createStudentResponse.data.student.id,
      // );
    }
  } catch (error) {
    console.log('Error creating placeholder data', error);
  }
};

const createRandomQuestions = async (count) => {
  try {
    for (let i = 0; i < count; i++) {
      const questionData = generateRandomQuestion();
      const createQuestionResponse = await axios.post(
        createQuizQuestionURL,
        questionData,
      );
      questionIndexesArray.push(createQuestionResponse.data.id);
      //console.log(`Question ${i + 1} created.`);
    }
    console.log(`${numberOfQuestionsToCreate} questions created successfully.`);
  } catch (error) {
    console.error('Error creating questions:', error);
  }
};

const createRandomQuizzes = async (count) => {
  try {
    for (let i = 0; i < count; i++) {
      const quizData = generateRandomQuiz(i);
      const createQuizResponse = await axios.post(createQuizURL, quizData);
      quizDataArray.push(createQuizResponse.data);
      //console.log(`Quiz ${i + 1} created.`);
    }
    console.log(`${numberOfQuizzesToCreate} quizzes created successfully.`);
  } catch (error) {
    console.error('Error creating quizzes:', error);
  }
};

const createRandomTakes = async (count) => {
  try {
    for (let i = 0; i < count; i++) {
      const takeData = generateRandomTake();
      const createTakeResponse = await axios.post(createTakeURL, takeData);
      //console.log(`Take ${i + 1} created.`);
    }
    console.log(`${numberOfTakesToCreate} takes created successfully.`);
  } catch (error) {
    console.error('Error creating takes:', error);
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

  const answers = [
    {
      answer:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Option A","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
      explanation: '',
      isCorrect: true,
    },
    {
      answer:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Option B","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
      explanation: '',
      isCorrect: false,
    },
  ];

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
        answers,
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
        answers,
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
  const randomQuestionsLength = Math.min(
    Math.floor(Math.random() * 20) + 1,
    20,
  );
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
  const quizData = {
    title: `Sample Quiz ${titleIdx + 1}`,
    description:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a sample quiz.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    subject: 'MATHEMATICS',
    levels: randomLevels,
    topics: randomTopics,
    totalMarks: totalMarks,
    rewardPoints: Math.min(Math.floor(Math.random() * 10) + 1, 10),
    rewardMinimumMarks: Math.round(totalMarks * 0.8),
    teacherCreated: placeholderTeacherId,
    allocatedTo: [],
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
    const correctAnswer = quizQuestion.quizQuestion.answers.filter(
      (x) => x.isCorrect,
    )[0].answer;
    studentAnswers.push({
      questionId: quizQuestion.quizQuestionId,
      timeTaken: Math.round(Math.random() * 30) + 30,
      studentAnswer: Math.random() > 0.3 ? correctAnswer : wrongAnswer,
    });
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

const main = async () => {
  await setupPrerequisites();
  await createRandomQuestions(numberOfQuestionsToCreate);
  await createRandomQuizzes(numberOfQuizzesToCreate);
  await createRandomTakes(numberOfTakesToCreate);
};

main();
