import { CustomHighChartsPoint } from '@acer-academy-learning/data-access';
import React from 'react';
import { QuizQuestionRow } from '../quizResults/QuizQuestionRow';

export type QuestionsAnalysisForTopicProps = {
  dataPoint?: CustomHighChartsPoint;
};

export const QuestionsAnalysisForTopic = ({
  dataPoint,
}: QuestionsAnalysisForTopicProps) => {
  return (
    <div className="p-4 mt-2 flex flex-col justify-center items-center space-y-4">
      {!dataPoint?.metaData && (
        <span>
          Click on any topic data point to show questions attempted wrongly.
        </span>
      )}
      {dataPoint?.metaData &&
        Object.values(dataPoint?.metaData).length === 0 && (
          <span>
            Nothing to show for this topic at this point. You have answered all
            questions correctly!
          </span>
        )}
      {Object.entries(dataPoint?.metaData ?? {}).map(
        ([questionId, takeId], index) => (
          <QuizQuestionRow
            key={index}
            questionId={questionId}
            takeId={takeId}
            marks={1}
            questionNumber={++index}
          />
        ),
      )}
    </div>
  );
};
