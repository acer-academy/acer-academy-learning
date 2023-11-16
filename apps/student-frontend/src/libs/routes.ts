// Auth routes
export const LOGIN = '/login';
export const SIGN_UP = '/sign-up';
export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/reset-password';

// Dashboard routes
export const DASHBOARD = '/';

// Subject routes
export const SUBJECTS = '/subjects';
export const TAKES = `${SUBJECTS}/:subject/takes`;
export const SUBJECT_MAIN = `${SUBJECTS}/:subject`;
export const ASSIGNMENTS = `${SUBJECT_MAIN}/assignments`;
export const VIEW_ASSIGNMENT = `${SUBJECT_MAIN}/assignments/:assignmentId`;

// Quizzes
export const QUIZZES = `${SUBJECT_MAIN}/quizzes`;
export const VIEW_QUIZ = `${QUIZZES}/:quizId`;
export const QUIZ_RESULT = `${QUIZZES}/result/:takeId`;
export const ATTEMPT_QUIZ = `${QUIZZES}/:quizId/take`;
export const VIEW_ADAPTIVE_QUIZ = `${QUIZZES}/adaptive`;
export const ATTEMPT_ADAPTIVE_QUIZ = `${QUIZZES}/adaptive/take`;

export const RECORDINGS = `${SUBJECT_MAIN}/recordings`;
export const ZOOM_LINK = `${SUBJECT_MAIN}/zoom-link`;

// Booking routes
export const BOOKING = '/booking';
export const BOOK_CLASSES = `${BOOKING}/book-classes`;
export const BUY_CREDITS = `${BOOKING}/buy-credits`;
export const PAST_TRANSACTIONS = `${BOOKING}/past-transactions`;

// Rewards routes
export const REWARDS = '/rewards';

// Account routes
export const ACCOUNT = '/account';
export const PROFILE = `${ACCOUNT}/profile`;
export const NOTIFICATIONS = `${ACCOUNT}/notifications`;
export const SETTINGS = `${ACCOUNT}/settings`;
export const FAQ = `${ACCOUNT}/faq`;

//Attendance
export const ATTENDANCE = `/attendance/:sessionId`;
