import {
  Divider,
  GenericBadges,
  GenericButton,
  LexOutput,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import { QuizData } from '@acer-academy-learning/data-access';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export type ViewQuizDetailsProps = {
  quiz: QuizData;
  timeAllowed: string;
};

export const ViewQuizDetails = ({
  quiz,
  timeAllowed,
}: ViewQuizDetailsProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Divider lineClassName="border-gray-900" />
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
      <Divider lineClassName="border-gray-900" />
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
      <GenericButton
        type="button"
        text={'Start Quiz'}
        onClick={() => navigate('take#1')}
        className="bg-student-primary-600 hover:bg-student-primary-700 self-center"
      />
    </>
  );
};
