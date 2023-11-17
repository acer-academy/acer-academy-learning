import { QuizQuestionRow } from '../quizResults/QuizQuestionRow';

export type QuestionsAnalysisForTopicProps = {
  metaData?: { [key: string]: string };
};

export const QuestionsAnalysisForTopic = ({
  metaData,
}: QuestionsAnalysisForTopicProps) => {
  return (
    <div className="p-4 mt-2 flex flex-col justify-center items-center space-y-4">
      {!metaData && (
        <span>
          Click on any topic data point to show questions attempted wrongly.
        </span>
      )}
      {metaData && Object.values(metaData).length === 0 && (
        <span>
          Nothing to show for this topic at this point. You have answered all
          questions correctly!
        </span>
      )}
      {Object.entries(metaData ?? {}).map(([questionId, takeId], index) => (
        <QuizQuestionRow
          key={index}
          questionId={questionId}
          takeId={takeId}
          marks={1}
          questionNumber={++index}
        />
      ))}
    </div>
  );
};
