import {
  FullscreenSpinner,
  GenericAccordion,
  getSubjectPathFrom,
  useAuth,
} from '@acer-academy-learning/common-ui';
import {
  QuizPaginationFilter,
  SubjectEnum,
  getPaginatedFilteredQuizzes,
} from '@acer-academy-learning/data-access';
import { Student } from 'libs/data-access/src/lib/types/student';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { QuizRow } from './components/QuizRow';
import { AdaptiveQuizRow } from './components/AdaptiveQuizRow';

const accordionTitleClassName =
  'px-6 py-4 bg-student-primary-600 text-white hover:bg-student-primary-700';

export const ViewAllQuizzes = () => {
  // Will query all quizzes for now, but will be changed to query quizzes by subject
  const { subject } = useParams();
  const { user } = useAuth<Student>();
  const currentSubject = useMemo(
    () =>
      Object.values(SubjectEnum).find(
        (subj) => getSubjectPathFrom(subj).path === subject,
      ),
    [subject],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const quizFilterOptions: QuizPaginationFilter = useMemo(
    () => ({
      levels: user ? [user.level] : [],
      subjects: currentSubject ? [currentSubject] : [],
      showLatestOnly: true,
    }),
    [currentSubject, user],
  );
  const { data: quizzes, isLoading } = useQuery(
    ['quiz', pageSize, currentPage, quizFilterOptions],
    () => getPaginatedFilteredQuizzes(currentPage, pageSize, quizFilterOptions),
  );

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <GenericAccordion
        title="All Quizzes"
        titleClassName={accordionTitleClassName}
        arrowClassName="text-white"
        content={
          <ul>
            {quizzes?.data.quizzes.map((quiz, index) => (
              <QuizRow
                iconStyles="text-student-primary-600"
                key={quiz.id}
                quiz={quiz}
                className="hover:bg-student-primary-100"
              />
            ))}
            {/* <div className="flex gap-5 justify-end">
          <span className="py-2">Rows per page:</span>
          <select
            className=" rounded-md"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={isPrevPageDisabled()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={currentPage === 1 ? 'grey' : 'currentColor'}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <span className="py-2">
            {`${
              quizzes?.data.totalCount === 0
                ? `0 of 0`
                : `${(currentPage - 1) * pageSize + 1}-${
                    (currentPage - 1) * pageSize + quizzes?.data.quizzes.length
                  } of ${totalCount}`
            }`}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={isNextPageDisabled()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={isNextPageDisabled() ? 'grey' : 'currentColor'}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div> */}
          </ul>
        }
      />
      <GenericAccordion
        title="Special Quizzes"
        titleClassName={accordionTitleClassName}
        arrowClassName="text-white"
        content={
          <ul>
            <AdaptiveQuizRow
              iconStyles="text-student-primary-600"
              className="hover:bg-student-primary-100"
            />
          </ul>
        }
      />
    </div>
  );
};
