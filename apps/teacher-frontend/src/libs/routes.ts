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
export const CREATE_QUIZ = `/create-quiz`;
export const CREATE_QUIZ_DETAILS_HASH = '';
export const CREATE_QUIZ_QUESTIONS_HASH = 'questions';

export const ANALYTICS = '/analytics';
export const SCHEDULING = '/scheduling';
export const REWARDS = '/rewards';

// Acccount
export const ACCOUNT = '/account';
export const PROFILE = `${ACCOUNT}/profile`;
export const CHANGE_PASSWORD = `${PROFILE}/change-password`;
export const SETTINGS = `${ACCOUNT}/settings`;

export const WITHOUT_SIDEBARS = [SUBJECTS];
