import React, { useState } from 'react';
import { QuestionCard } from './components/QuestionCard';

export const CreateQuestion = () => {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <QuestionCard />
    </div>
  );
};
