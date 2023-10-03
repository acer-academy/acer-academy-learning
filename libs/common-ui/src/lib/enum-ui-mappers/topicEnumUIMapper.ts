import { QuizQuestionTopicEnum } from '@acer-academy-learning/data-access';

export const topicEnumUIMap = new Map<
  QuizQuestionTopicEnum,
  { bgColor: string; prettyText: string }
>([
  // Group 1: Numerical Concepts
  [
    QuizQuestionTopicEnum.WHOLE_NUMBERS,
    { bgColor: 'bg-altYellow-50', prettyText: 'Whole Numbers' },
  ],
  [
    QuizQuestionTopicEnum.MONEY,
    { bgColor: 'bg-altYellow-100', prettyText: 'Money' },
  ],
  [
    QuizQuestionTopicEnum.MEASUREMENT,
    { bgColor: 'bg-altYellow-200', prettyText: 'Measurement' },
  ],
  [
    QuizQuestionTopicEnum.GEOMETRY,
    { bgColor: 'bg-altYellow-300', prettyText: 'Geometry' },
  ],
  [
    QuizQuestionTopicEnum.DATA_REPRESENTATION_AND_INTERPRETATION,
    {
      bgColor: 'bg-altYellow-400',
      prettyText: 'Data Representation & Interpretation',
    },
  ],
  [
    QuizQuestionTopicEnum.FRACTIONS,
    { bgColor: 'bg-altYellow-500', prettyText: 'Fractions' },
  ],
  [
    QuizQuestionTopicEnum.AREA_AND_VOLUME,
    { bgColor: 'bg-altYellow-600', prettyText: 'Area & Volume' },
  ],
  [
    QuizQuestionTopicEnum.DECIMALS,
    { bgColor: 'bg-altYellow-700', prettyText: 'Decimals' },
  ],

  // Group 2: Ratios and Data
  [
    QuizQuestionTopicEnum.PERCENTAGE,
    { bgColor: 'bg-altBrown-100', prettyText: 'Percentage' },
  ],
  [
    QuizQuestionTopicEnum.RATIO,
    { bgColor: 'bg-altBrown-200', prettyText: 'Ratio' },
  ],
  [
    QuizQuestionTopicEnum.RATE_AND_SPEED,
    { bgColor: 'bg-altBrown-300', prettyText: 'Rate & Speed' },
  ],
  [
    QuizQuestionTopicEnum.DATA_ANALYSIS,
    { bgColor: 'bg-altBrown-400', prettyText: 'Data Analysis' },
  ],

  // Group 3: Algebra and Expressions
  [
    QuizQuestionTopicEnum.ALGEBRA,
    { bgColor: 'bg-studentPink-50', prettyText: 'Algebra' },
  ],
  [
    QuizQuestionTopicEnum.NUMBERS_AND_OPERATIONS,
    { bgColor: 'bg-studentPink-100', prettyText: 'Numbers & Operations' },
  ],
  [
    QuizQuestionTopicEnum.RATIO_AND_PROPORTION,
    { bgColor: 'bg-studentPink-200', prettyText: 'Ratio & Proportion' },
  ],
  [
    QuizQuestionTopicEnum.ALGEBRAIC_EXPRESSIONS_AND_FORMULAE,
    {
      bgColor: 'bg-studentPink-300',
      prettyText: 'Algebraic Expressions & Formulae',
    },
  ],

  // Group 4: Functions and Equations
  [
    QuizQuestionTopicEnum.FUNCTIONS_AND_GRAPHS,
    { bgColor: 'bg-studentOrange-50', prettyText: 'Functions & Graphs' },
  ],
  [
    QuizQuestionTopicEnum.EQUATIONS_AND_INEQUALITIES,
    { bgColor: 'bg-studentOrange-100', prettyText: 'Equations & Inequalities' },
  ],
  [
    QuizQuestionTopicEnum.SET_LANGUAGE_AND_NOTATION,
    { bgColor: 'bg-studentOrange-200', prettyText: 'Set Language & Notation' },
  ],
  [
    QuizQuestionTopicEnum.MATRICES,
    { bgColor: 'bg-studentOrange-300', prettyText: 'Matrices' },
  ],
  [
    QuizQuestionTopicEnum.ANGLES_TRIANGLES_AND_POLYGONS,
    {
      bgColor: 'bg-studentOrange-400',
      prettyText: 'Angles, Triangles & Polygons',
    },
  ],
  [
    QuizQuestionTopicEnum.CONGRUENCE_AND_SIMILARITY,
    { bgColor: 'bg-studentOrange-500', prettyText: 'Congruence & Similarity' },
  ],
  [
    QuizQuestionTopicEnum.PROPERTIES_OF_CIRCLES,
    { bgColor: 'bg-studentOrange-600', prettyText: 'Properties of Circles' },
  ],
  [
    QuizQuestionTopicEnum.PYTHAGORAS_THEOREM_AND_TRIGONOMETRY,
    {
      bgColor: 'bg-studentOrange-700',
      prettyText: 'Pythagoras Theorem & Trigonometry',
    },
  ],

  // Group 5: Geometry and Data Handling
  [
    QuizQuestionTopicEnum.MENSURATION,
    { bgColor: 'bg-teacherBlue-100', prettyText: 'Mensuration' },
  ],
  [
    QuizQuestionTopicEnum.COORDINATE_GEOMETRY,
    { bgColor: 'bg-teacherBlue-200', prettyText: 'Coordinate Geometry' },
  ],
  [
    QuizQuestionTopicEnum.VECTORS_IN_2D,
    { bgColor: 'bg-teacherBlue-300', prettyText: 'Vectors in 2D' },
  ],
  [
    QuizQuestionTopicEnum.DATA_HANDLING_AND_ANALYSIS,
    { bgColor: 'bg-teacherBlue-400', prettyText: 'Data Handling & Analysis' },
  ],

  // Group 6: Advanced Topics
  [
    QuizQuestionTopicEnum.PROBABILITY,
    { bgColor: 'bg-teacherPurple-100', prettyText: 'Probability' },
  ],
  [
    QuizQuestionTopicEnum.SEQUENCE_AND_SERIES,
    { bgColor: 'bg-teacherPurple-200', prettyText: 'Sequence & Series' },
  ],
  [
    QuizQuestionTopicEnum.VECTORS,
    { bgColor: 'bg-teacherPurple-300', prettyText: 'Vectors' },
  ],
  [
    QuizQuestionTopicEnum.INTRODUCTION_TO_COMPLEX_NUMBERS,
    {
      bgColor: 'bg-teacherPurple-400',
      prettyText: 'Introduction to Complex Numbers',
    },
  ],
  [
    QuizQuestionTopicEnum.CALCULUS,
    { bgColor: 'bg-teacherPurple-500', prettyText: 'Calculus' },
  ],
  [
    QuizQuestionTopicEnum.PROBABILITY_AND_STATISTICS,
    { bgColor: 'bg-teacherPurple-600', prettyText: 'Probability & Statistics' },
  ],
]);
