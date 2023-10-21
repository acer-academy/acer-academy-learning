import {
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import { QuizQuestionTypeEnum } from '@acer-academy-learning/data-access';

const typesEnums = Object.values(QuizQuestionTypeEnum);

interface QuestionTypeFieldProps {
  questionTypes: QuizQuestionTypeEnum[];
  onChange: (questionTypes: QuizQuestionTypeEnum[]) => void;
}

export const QuestionTypeField: React.FC<QuestionTypeFieldProps> = (
  props: QuestionTypeFieldProps,
) => {
  const { questionTypes, onChange } = props;

  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Question Type(s):
      </h3>
      <>
        <GenericBadges
          onChange={onChange}
          badges={questionTypes}
          getDisplayValue={(badge) =>
            screamingSnakeToTitleCase(badge).toUpperCase()
          }
          allowRemove
        />
        <GenericComboBox
          options={typesEnums}
          onChange={onChange}
          selected={questionTypes}
          displayValue={(type) => screamingSnakeToTitleCase(type).toUpperCase()}
        />
      </>
    </>
  );
};
