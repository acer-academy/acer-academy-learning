import { QuizQuestionTypeEnum } from '@acer-academy-learning/data-access';
import { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { FaRegDotCircle } from 'react-icons/fa';
import { MdOutlineCheckBox, MdNotes } from 'react-icons/md';
import { TbSquareRoundedLetterT } from 'react-icons/tb';

export type QuestionTypeIconProps = {
  type: QuizQuestionTypeEnum;
};

export const QuestionTypeIcon = ({ type }: QuestionTypeIconProps) => {
  const icon = useMemo(() => {
    switch (type) {
      case QuizQuestionTypeEnum.MCQ:
        return <FaRegDotCircle />;
      case QuizQuestionTypeEnum.MRQ:
        return <MdOutlineCheckBox />;
      case QuizQuestionTypeEnum.TFQ:
        return <TbSquareRoundedLetterT />;
      default:
        return <MdNotes />;
    }
  }, [type]);
  return (
    <IconContext.Provider
      value={{
        className: 'mr-3 h-5 w-5',
      }}
    >
      {icon}
    </IconContext.Provider>
  );
};
