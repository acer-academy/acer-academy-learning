const whitelistURL = 'http://localhost:8000/api/v1/whitelist/create';
const adminURL = 'http://localhost:8000/api/v1/admins';
const createCentreURL = 'http://localhost:8000/api/v1/centres';
const createTeacherURL = 'http://localhost:8000/api/v1/teachers';
const createQuizQuestionURL = 'http://localhost:8000/api/v1/quiz-questions/';
const createQuizURL = 'http://localhost:8000/api/v1/quiz';
const createStudentURL = 'http://localhost:8000/api/v1/students/create';
const createTakeURL = 'http://localhost:8000/api/v1/take';
const createAssignmentURL = 'http://localhost:8000/api/v1/assignments';
const createAssignmentAttemptURL =
  'http://localhost:8000/api/v1/assignment-attempts';

const randomFirstNames = [
  'John',
  'Mary',
  'Robert',
  'Linda',
  'William',
  'Susan',
  'James',
  'Karen',
  'Michael',
  'Jennifer',
  'David',
  'Nancy',
  'Richard',
  'Lisa',
  'Joseph',
  'Betty',
  'Charles',
  'Helen',
  'Thomas',
  'Margaret',
  'Richard',
  'Linda',
  'Christopher',
  'Deborah',
  'Daniel',
  'Patricia',
  'Matthew',
  'Sandra',
  'Anthony',
  'Elizabeth',
  'Donald',
  'Carol',
  'Mark',
  'Susan',
  'Paul',
  'Jessica',
  'Kevin',
  'Cynthia',
  'Edward',
  'Pamela',
  'Brian',
  'Dorothy',
  'George',
  'Kathy',
  'Steven',
  'Donna',
  'Kenneth',
  'Michelle',
  'Lisa',
  'Barbara',
];

const randomLastNames = [
  'Lim',
  'Tan',
  'Ng',
  'Lee',
  'Ong',
  'Goh',
  'Chua',
  'Yeo',
  'Teo',
  'Tan',
  'Wong',
  'Chen',
  'Zhang',
  'Liu',
  'Wang',
  'Xu',
  'Lin',
  'Yang',
  'Wu',
  'Li',
  'Liang',
  'Wu',
  'Guan',
  'Chen',
  'Lai',
  'Koh',
  'Chen',
  'Hsu',
  'Chang',
  'Liu',
  'Hu',
  'Han',
  'Yoon',
  'Kang',
  'Hong',
];

const QuizQuestionTypeEnum = {
  MCQ: 'MCQ',
  MRQ: 'MRQ',
  TFQ: 'TFQ',
  SHORT_ANSWER: 'SHORT_ANSWER',
};

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

const answers2 = [
  {
    answer:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Option C","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    explanation: '',
    isCorrect: true,
  },
  {
    answer:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Option D","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    explanation: '',
    isCorrect: false,
  },
];

module.exports = {
  whitelistURL,
  adminURL,
  createCentreURL,
  createTeacherURL,
  createQuizQuestionURL,
  createQuizURL,
  createStudentURL,
  createTakeURL,
  createAssignmentURL,
  createAssignmentAttemptURL,
  randomFirstNames,
  randomLastNames,
  QuizQuestionTypeEnum,
  QuizQuestionDifficultyEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTopicEnum,
  LevelEnum,
  answers,
  answers2,
};
