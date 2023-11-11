import React from 'react';
import { SubjectSpiderChart } from './components/SubjectSpiderChart';
import { SubjectPerformanceOverTime } from './components/SubjectPerformanceOverTime';

export const Subject = () => {
  return (
    <div className="h-full flex flex-col justify-start space-y-4">
      <SubjectPerformanceOverTime />
      <SubjectSpiderChart />
    </div>
  );
};
