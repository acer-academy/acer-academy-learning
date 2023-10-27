import {
  GenericAccordion,
  Spinner,
  getSubjectPathFrom,
  useAuth,
  useDebounceValue,
} from '@acer-academy-learning/common-ui';
import {
  QuizPaginationFilter,
  SubjectEnum,
  getPaginatedFilteredQuizzes,
} from '@acer-academy-learning/data-access';
import { Student } from 'libs/data-access/src/lib/types/student';
import { useMemo, useState } from 'react';
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
  const adaptiveString = useMemo(() => 'adaptivequiz, challenge yourself', []);
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPageForAllocated, setCurrentPageForAllocated] = useState(1);
  const [pageSizeForAllocated, setPageSizeForAllocated] = useState(10);
  const [pageSizeForSpecial, setPageSizeForSpecial] = useState(10);
  const debouncedString = useDebounceValue<string>(searchString, 300);
  const quizFilterOptions: QuizPaginationFilter = useMemo(
    () => ({
      searchString: debouncedString,
      levels: user ? [user.level] : [],
      subjects: currentSubject ? [currentSubject] : [],
      showLatestOnly: true,
      strictPublicOrAllocated: true,
    }),
    [currentSubject, user, debouncedString],
  );
  const allocatedFilterOptions: QuizPaginationFilter = useMemo(
    () => ({
      searchString: debouncedString,
      subjects: currentSubject ? [currentSubject] : [],
      allocatedTo: user ? [user.id] : [],
      showLatestOnly: true,
      strictPublicOrAllocated: true,
    }),
    [user, currentSubject, debouncedString],
  );
  const { data: publicQuizzes, isLoading } = useQuery(
    ['quiz', pageSize, currentPage, quizFilterOptions],
    () => getPaginatedFilteredQuizzes(currentPage, pageSize, quizFilterOptions),
  );

  const { data: allocatedQuizzes, isLoading: isAllocatedLoading } = useQuery(
    [
      'quiz',
      pageSizeForAllocated,
      currentPageForAllocated,
      allocatedFilterOptions,
    ],
    () =>
      getPaginatedFilteredQuizzes(
        currentPageForAllocated,
        pageSizeForAllocated,
        allocatedFilterOptions,
      ),
  );

  const isPrevPageDisabled = (currentPage: number) => {
    return currentPage === 1;
  };

  const isNextPageDisabled = (
    currentPage: number,
    pageSize: number,
    totalCount: number,
  ) => {
    return currentPage * pageSize >= totalCount;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <input
          type="text"
          className="h-14 w-96 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none focus:ring-student-primary-600"
          placeholder="Search anything..."
          onChange={(e) => setSearchString(e.target.value)}
          value={searchString}
        />

        <div className="absolute top-4 right-3">
          <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
        </div>
      </div>
      <GenericAccordion
        title="Special Quizzes"
        titleClassName={accordionTitleClassName}
        arrowClassName="text-white"
        content={
          <ul>
            {(adaptiveString.includes(searchString.toLowerCase()) && (
              <AdaptiveQuizRow
                iconStyles="text-student-primary-600"
                className="hover:bg-student-primary-100"
              />
            )) || (
              <p className="text-base border-x border-b h-8 w-full flex items-center justify-center py-8 text-gray-600 ">
                <span>No Quizzes Found.</span>
              </p>
            )}
            <li>
              <div className="flex gap-5 justify-end p-4">
                <span className="py-2 text-base">Rows per page:</span>
                <select
                  className="rounded-md"
                  value={pageSizeForSpecial}
                  onChange={(e) =>
                    setPageSizeForSpecial(Number(e.target.value))
                  }
                >
                  {[10, 20, 30, 40, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <button disabled={true}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke={'grey'}
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <span className="py-2 text-base">{`${`1-1 of 1`}`}</span>
                <button
                  onClick={() => setCurrentPageForAllocated(currentPage + 1)}
                  disabled={isNextPageDisabled(
                    currentPageForAllocated,
                    pageSizeForAllocated,
                    allocatedQuizzes?.data.totalCount ?? 0,
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke={'grey'}
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        }
      />
      <GenericAccordion
        title="Allocated Quizzes"
        titleClassName={accordionTitleClassName}
        arrowClassName="text-white"
        content={
          <ul>
            {isAllocatedLoading && !allocatedQuizzes && <Spinner />}
            {!isAllocatedLoading &&
              allocatedQuizzes?.data?.quizzes?.length === 0 && (
                <p className="text-base border-x border-b h-8 w-full flex items-center justify-center py-8 text-gray-600 ">
                  <span>No Quizzes Found.</span>
                </p>
              )}
            {allocatedQuizzes?.data?.quizzes?.map((quiz, index) => (
              <QuizRow
                iconStyles="text-student-primary-600"
                key={quiz.id}
                quiz={quiz}
                className="hover:bg-student-primary-100"
              />
            ))}
            <li>
              <div className="flex gap-5 justify-end p-4">
                <span className="py-2 text-base">Rows per page:</span>
                <select
                  className="rounded-md"
                  value={pageSize}
                  onChange={(e) =>
                    setPageSizeForAllocated(Number(e.target.value))
                  }
                >
                  {[10, 20, 30, 40, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setCurrentPageForAllocated(currentPage - 1)}
                  disabled={isPrevPageDisabled(currentPageForAllocated)}
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
                <span className="py-2 text-base">
                  {`${
                    publicQuizzes?.data.totalCount === 0
                      ? `0 of 0`
                      : `${(currentPageForAllocated - 1) * pageSize + 1}-${
                          (currentPageForAllocated - 1) * pageSize +
                          (allocatedQuizzes?.data?.quizzes?.length ?? 0)
                        } of ${allocatedQuizzes?.data.totalCount}`
                  }`}
                </span>
                <button
                  onClick={() => setCurrentPageForAllocated(currentPage + 1)}
                  disabled={isNextPageDisabled(
                    currentPageForAllocated,
                    pageSizeForAllocated,
                    allocatedQuizzes?.data.totalCount ?? 0,
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke={
                      isNextPageDisabled(
                        currentPageForAllocated,
                        pageSizeForAllocated,
                        allocatedQuizzes?.data.totalCount ?? 0,
                      )
                        ? 'grey'
                        : 'currentColor'
                    }
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        }
      />
      <GenericAccordion
        title="All Quizzes"
        titleClassName={accordionTitleClassName}
        arrowClassName="text-white"
        content={
          <ul>
            {isLoading && !publicQuizzes && <Spinner />}
            {!isLoading && publicQuizzes?.data?.quizzes?.length === 0 && (
              <p className="text-base border-x border-b h-8 w-full flex items-center justify-center py-8 text-gray-600 ">
                <span>No Quizzes Found.</span>
              </p>
            )}
            {publicQuizzes?.data?.quizzes?.map((quiz, index) => (
              <QuizRow
                iconStyles="text-student-primary-600"
                key={quiz.id}
                quiz={quiz}
                className="hover:bg-student-primary-100"
              />
            ))}
            <li>
              <div className="flex gap-5 justify-end p-4">
                <span className="py-2 text-base">Rows per page:</span>
                <select
                  className="rounded-md"
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
                  disabled={isPrevPageDisabled(currentPage)}
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
                <span className="py-2 text-base">
                  {`${
                    publicQuizzes?.data.totalCount === 0
                      ? `0 of 0`
                      : `${(currentPage - 1) * pageSize + 1}-${
                          (currentPage - 1) * pageSize +
                          (publicQuizzes?.data?.quizzes?.length ?? 0)
                        } of ${publicQuizzes?.data.totalCount}`
                  }`}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={isNextPageDisabled(
                    currentPage,
                    pageSize,
                    publicQuizzes?.data.totalCount ?? 0,
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke={
                      isNextPageDisabled(
                        currentPage,
                        pageSize,
                        publicQuizzes?.data.totalCount ?? 0,
                      )
                        ? 'grey'
                        : 'currentColor'
                    }
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        }
      />
    </div>
  );
};
