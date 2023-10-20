import {
  GenericBadges,
  LexOutput,
  formatDate,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import { QuizData } from '@acer-academy-learning/data-access';
import React, { useEffect, useMemo } from 'react';

export type ViewQuizDetailsSectionProps = {
  quiz: QuizData;
};

export const ViewQuizDetailsSection = ({
  quiz,
}: ViewQuizDetailsSectionProps) => {
  const timeAllowed = useMemo(() => {
    const timeAllowed = quiz.timeAllowed;
    if (timeAllowed) {
      const minutes = Math.floor(timeAllowed / 60);
      const hours = Math.floor(minutes / 60);
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${
          minutes % 60 === 0 ? '' : (minutes % 60) + ' minutes'
        }`;
      } else {
        return `${minutes} minutes`;
      }
    }
  }, [quiz.timeAllowed]);
  return (
    <>
      <div className="flex justify-around">
        <span>
          <strong>Total Marks:</strong> {quiz.totalMarks}
        </span>
        <span>
          <strong>Reward Points:</strong> {quiz.rewardPoints}
        </span>
        <span>
          <strong>Reward Minimum Marks:</strong> {quiz.rewardMinimumMarks}
        </span>
        <span>
          <strong>Time Limit:</strong> {timeAllowed}
        </span>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <h1 className="text-3xl font-bold tracking-tight ">Description</h1>
      <LexOutput editorStateStr={quiz.description} />
      <p className="font-bold" style={{ marginTop: 'auto' }}>
        Topics:{' '}
      </p>
      <GenericBadges
        badges={quiz.topics}
        getDisplayValue={(topic) => screamingSnakeToTitleCase(topic)}
      />
      <p className="font-bold">Levels: </p>
      <GenericBadges
        badges={quiz.levels}
        getDisplayValue={(level) => screamingSnakeToTitleCase(level)}
      />
      <p>
        <strong>Created By: </strong>
        {quiz.teacherCreated?.firstName + ' ' + quiz.teacherCreated?.lastName} (
        <a
          className="underline text-blue-500"
          href={`mailto:${quiz.teacherCreated.email}`}
        >
          {quiz.teacherCreated.email}
        </a>
        )
      </p>
      <p>
        <strong>Date Created: </strong>
        {formatDate(quiz.createdAt)}
      </p>
    </>
  );
};
