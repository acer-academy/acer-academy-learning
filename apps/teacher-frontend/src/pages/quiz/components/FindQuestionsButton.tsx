interface FindQuestionsButtonProps {
  setIsQuestionBankModalOpen: (isOpen: boolean) => void;
}

export const FindQuestionsButton: React.FC<FindQuestionsButtonProps> = (
  props: FindQuestionsButtonProps,
) => {
  const { setIsQuestionBankModalOpen } = props;

  return (
    <div className="flex align-middle justify-between">
      <div className="flex align-middle gap-4"></div>
      <button
        type="button"
        className="inline-flex justify-center px-4 py-2 text-white bg-teacherBlue-500 border border-transparent rounded-md hover:bg-teacherBlue-700"
        onClick={() => {
          setIsQuestionBankModalOpen(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 mr-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        Find Questions
      </button>
    </div>
  );
};
