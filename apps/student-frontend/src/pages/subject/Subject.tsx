import React from 'react';
import { SubjectSpiderChart } from './components/SubjectSpiderChart';
import { SubjectMasteryOverTime } from './components/SubjectMasteryOverTime';

export const Subject = () => {
  return (
    <div className="h-full flex flex-col justify-start space-y-4">
      <SubjectMasteryOverTime />
      <SubjectSpiderChart />
    </div>
  );
};
