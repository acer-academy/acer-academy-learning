import React from 'react';
import { QuizTitle } from './QuizTitle';
import { QuizDescription } from './QuizDescription';
import { QuizTimeAllowedField } from './QuizTimeAllowedField';
import { QuizRewardMinimumMarksField } from './QuizRewardMinimumMarksField';
import { QuizRewardPointsField } from './QuizRewardPointsField';
import { GenericButton } from '@acer-academy-learning/common-ui';

const DetailsSection = () => {
  return (
    <>
      <QuizTitle />
      <QuizDescription />
      <div className="grid grid-cols-2 gap-4 w-[50%]">
        <QuizTimeAllowedField />
        <QuizRewardMinimumMarksField />
        <QuizRewardPointsField />
      </div>
      <GenericButton type="submit" text="Create Quiz" />
    </>
  );
};

export default DetailsSection;
