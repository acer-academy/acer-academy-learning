import React from 'react';
import { QuizTitle } from './QuizTitle';
import { QuizDescription } from './QuizDescription';
import { QuizTimeAllowedField } from './QuizTimeAllowedField';
import { QuizTotalMarksField } from './QuizTotalMarksField';
import { QuizRewardPointsField } from './QuizRewardPointsField';
import { GenericButton } from '@acer-academy-learning/common-ui';

const DetailsSection = () => {
  return (
    <>
      <QuizTitle />
      <QuizDescription />
      <div className="grid grid-cols-2 gap-4 w-[50%]">
        <QuizTimeAllowedField />
        <QuizTotalMarksField />
        <QuizRewardPointsField />
      </div>
      <GenericButton type="submit" text="Create Quiz" />
    </>
  );
};

export default DetailsSection;
