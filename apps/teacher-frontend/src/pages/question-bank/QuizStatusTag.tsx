import React from 'react';
import { QuizQuestionStatusEnum } from '@acer-academy-learning/data-access';
import { quizStatusEnumUIMap } from '@acer-academy-learning/common-ui';

export const QuizStatusTag: React.FC<{
  status: QuizQuestionStatusEnum;
  removeTagCallback?: Function;
}> = (props) => {
  const { status, removeTagCallback } = props;

  const statusInfo = quizStatusEnumUIMap.get(status);

  if (!removeTagCallback)
    return (
      <div
        className={`max-w-min flex align-middle justify-center rounded-md font-extralight border text-sm ${
          statusInfo ? `${statusInfo.borderColor} ${statusInfo.textColor}` : ''
        } text-center px-2`}
      >
        <span className="py-1 min-w-max">
          {statusInfo ? statusInfo.prettyText : 'Unknown'}
        </span>
      </div>
    );

  return (
    <div
      className={`max-w-min flex gap-2 align-middle justify-centre rounded-md border font-extralight text-sm ${
        statusInfo ? `${statusInfo.borderColor} ${statusInfo.textColor}` : ''
      } text-center py-0 pl-2 pr-1`}
    >
      <span className="py-1">
        {statusInfo ? statusInfo.prettyText : 'Unknown'}
      </span>
      {removeTagCallback && (
        <button
          className=""
          onClick={() => {
            removeTagCallback();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-5 h-5 ${statusInfo?.svgStyle}`}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
