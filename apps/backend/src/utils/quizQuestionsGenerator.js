const axios = require('axios');

const baseURL = 'http://localhost:8000/api/v1/quiz-questions/';

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
  OPEN_ENDED: 'OPEN_ENDED',
};

const numberOfQuestionsToCreate = 5;

const createRandomQuestions = async (count) => {
  try {
    for (let i = 0; i < count; i++) {
      const questionData = generateRandomQuestion();
      await axios.post(baseURL, questionData);
      console.log(`Question ${i + 1} created.`);
    }
    console.log('All questions created successfully.');
  } catch (error) {
    console.error('Error creating questions:', error.message);
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
    case QuizQuestionTypeEnum.OPEN_ENDED:
      return {
        topics: randomTopics,
        levels: randomLevels,
        difficulty: getRandomItem(QuizQuestionDifficultyEnum),
        questionText:
          '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a OE sample","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        status: getRandomItem(QuizQuestionStatusEnum),
        questionType: QuizQuestionTypeEnum.OPEN_ENDED,
        answers,
      };
    default:
      return generateTFQ();
  }
};

createRandomQuestions(numberOfQuestionsToCreate);
