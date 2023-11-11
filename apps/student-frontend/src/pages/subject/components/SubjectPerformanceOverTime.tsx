import { useDebounceValue } from '@acer-academy-learning/common-ui';
import { QuizQuestionTopicEnum } from '@prisma/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const SubjectPerformanceOverTime = () => {
  const { subject } = useParams();
  const [selectedTopics, setSelectedTopics] = useState<QuizQuestionTopicEnum[]>(
    [],
  );
  const debouncedSelectedTopics = useDebounceValue<QuizQuestionTopicEnum[]>(
    selectedTopics,
    300,
  );
  return <div></div>;
};
