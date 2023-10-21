import React, { useMemo } from 'react';
import mathLogo from '../assets/subjects-math-image.jpg';
import englishLogo from '../assets/subjects-english-image.jpg';
import { SubjectEnum } from '@acer-academy-learning/data-access';

export type SubjectImageProps = {
  className?: string;
  subject: SubjectEnum;
};

const getImgSrc = (subject: SubjectEnum) => {
  switch (subject) {
    case SubjectEnum.ENGLISH:
      return englishLogo;
    default:
      // Default is math
      return mathLogo;
  }
};

export const SubjectImage = ({ className, subject }: SubjectImageProps) => {
  const imgSrc = useMemo(() => getImgSrc(subject), [subject]);
  return <img src={imgSrc} alt={`${subject}`} className={`${className}`} />;
};
