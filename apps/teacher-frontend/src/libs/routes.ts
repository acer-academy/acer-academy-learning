// Auth routes
export const LOGIN = '/login';
export const SIGN_UP = '/sign-up';

// DASHBOARD
export const DASHBOARD = '/';

// Subjects
export const SUBJECTS = '/subjects';
export const SUBJECT_MAIN = `${SUBJECTS}/:subject`;
// Question Bank
export const QUESTION_BANK = `${SUBJECTS}/:subject/question-bank`;
export const CREATE_QUESTION = `${QUESTION_BANK}/create`;
export const UPDATE_QUESTION = `${QUESTION_BANK}/:questionId`;

// Quizzes
export const QUIZZES = `${SUBJECTS}/:subject/quizzes`;
export const CREATE_QUIZ = `${QUIZZES}/create-quiz`;
export const CREATE_QUIZ_DETAILS_HASH = '';
export const CREATE_QUIZ_QUESTIONS_HASH = 'questions';
export const CREATE_QUIZ_STUDENTS_HASH = 'students';
export const UPDATE_QUIZ = `${QUIZZES}/:quizId`;

// Assignments
export const ASSIGNMENTS = `${SUBJECTS}/:subject/assignments`;
export const VIEW_ASSIGNMENT = `${ASSIGNMENTS}/:assignmentId`;
export const CREATE_ASSIGNMENT = `${ASSIGNMENTS}/create`;
export const EDIT_ASSIGNMENT = `${ASSIGNMENTS}/edit/:assignmentId`;
export const VIEW_ASSIGNMENT_ATTEMPTS = `${VIEW_ASSIGNMENT}/attempts`;

// Analytics
export const ANALYTICS = '/analytics';
export const QUIZ_ANALYTICS_MGMT = `${ANALYTICS}/quizzes`;
export const VIEW_QUIZ_ANALYTICS = `${ANALYTICS}/quizzes/:quizId`;
export const VIEW_QUIZ_ANALYTICS_SUMMARY_HASH = `summary`;
export const VIEW_QUIZ_ANALYTICS_ITEMS_HASH = `items`;
export const VIEW_QUIZ_ANALYTICS_STUDENTS_HASH = `students`;
export const ASSIGNMENT_ANALYTICS_MGMT = `${ANALYTICS}/assignments/`;
export const VIEW_ASSIGNMENT_ANALYTICS = `${ANALYTICS}/assignments/:assignmentId`;

// Scheduling
export const SCHEDULING = '/scheduling';
export const VIEW_CLASSES = `${SCHEDULING}/view-classes`;
export const BOOK_CLASSES = `${SCHEDULING}/book-classes`;
export const SESSIONS_FOR_ATTENDANCE = `${SCHEDULING}/attendance`;

export const REWARDS = '/rewards';

// Acccount
export const ACCOUNT = '/account';
export const PROFILE = `${ACCOUNT}/profile`;
export const CHANGE_PASSWORD = `${PROFILE}/change-password`;
export const SETTINGS = `${ACCOUNT}/settings`;
