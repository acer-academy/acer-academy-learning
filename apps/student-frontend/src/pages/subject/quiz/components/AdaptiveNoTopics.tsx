import { GenericButton } from '@acer-academy-learning/common-ui';
import { FaceFrownIcon } from '@heroicons/react/24/solid';
import { SUBJECTS } from '../../../../libs/routes';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const AdaptiveNoTopics = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-semibold">Ooooops!</h1>
      <p className="text-2xl font-semibold">
        Looks like you didn't chose any topics to start the quiz...
      </p>
      <FaceFrownIcon className="h-full w-full max-w-xs text-student-primary-600" />
      <GenericButton
        className="bg-student-primary-600 hover:bg-student-primary-700 text-whie text-3xl"
        text="Go back to Choose Topics"
        onClick={() => navigate(`${SUBJECTS}/${subject}/quizzes/adaptive`)}
      />
    </div>
  );
};
