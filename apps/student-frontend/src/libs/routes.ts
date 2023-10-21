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

// Quizzes
export const QUIZZES = `${SUBJECT_MAIN}/quizzes`;
export const ATTEMPT_QUIZ = `${QUIZZES}/take`

export const RECORDINGS = `${SUBJECT_MAIN}/recordings`;
export const ZOOM_LINK = `${SUBJECT_MAIN}/zoom-link`;

// Booking routes
export const BOOKING = '/booking';
export const VIEW_CLASSES = `${BOOKING}/view-classes`;
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
