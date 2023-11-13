// Auth Routes
export const SIGN_UP = '/sign-up';
export const LOGIN = '/login';

// Settings
export const SETTINGS = '/settings';
export const CHANGE_PASSWORD = `${SETTINGS}/change-password`;

// HR routes
export const HUMAN_RESOURCES = '/human-resources';
export const TEACHERS = `${HUMAN_RESOURCES}/teachers`;
export const STUDENTS = `${HUMAN_RESOURCES}/students`;
export const ADMINS = `${HUMAN_RESOURCES}/admins`;

// Centre Routes
export const CENTRE = '/centre-management';

// FAQ Routs
export const FAQ = '/faq-management';

// Credit Resources Routes
export const CREDIT_RESOURCES = '/credit-resources';
export const PROMOTION = `${CREDIT_RESOURCES}/promotion`;
export const TERM = `${CREDIT_RESOURCES}/term`;
export const TRANSACTION = `${CREDIT_RESOURCES}/transaction`;
export const CREDIT_BUNDLE = `${CREDIT_RESOURCES}/credit-bundle`;
export const CLASS_CREDITS = `${CREDIT_RESOURCES}/class-credits`;

//Schedule Routes
export const SCHEDULING_RESOURCES = '/scheduling-resources';
export const VIEW_CLASSES = `${SCHEDULING_RESOURCES}/view-classes`;
export const BOOK_CLASSES = `${SCHEDULING_RESOURCES}/book-classes`;

export const SESSIONS_FOR_ATTENDANCE = `${SCHEDULING_RESOURCES}/attendance`;
export const MARK_ATTENDANCE = `${SCHEDULING_RESOURCES}/attendance/mark/:sessionId`;
