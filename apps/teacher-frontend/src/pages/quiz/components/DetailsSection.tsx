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
    </>
  );
};

export default DetailsSection;
