// Auth routes
export const LOGIN = '/login';
export const SIGN_UP = '/sign-up';
export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/reset-password';

// Dashboard routes
export const DASHBOARD = '/';

// Subject routes
export const SUBJECTS = '/subjects';
export const ASSIGNMENTS = `${SUBJECTS}/assignments`;
export const QUIZZES = `${SUBJECTS}/quizzes`;
export const TAKES = `${SUBJECTS}/takes`;
export const RECORDINGS = `${SUBJECTS}/recordings`;
export const ZOOM_LINK = `${SUBJECTS}/zoom-link`;

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
