import {
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import { QuizQuestionDifficultyEnum } from '@acer-academy-learning/data-access';

const difficultyEnums = Object.values(QuizQuestionDifficultyEnum);

interface QuizDifficultyFieldProps {
  difficulties: QuizQuestionDifficultyEnum[];
  onChange: (difficulties: QuizQuestionDifficultyEnum[]) => void;
}

export const QuizDifficultyField: React.FC<QuizDifficultyFieldProps> = (
  props: QuizDifficultyFieldProps,
) => {
  const { difficulties, onChange } = props;

  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Difficulty:
      </h3>
      <>
        <GenericBadges
          onChange={onChange}
          badges={difficulties}
          getDisplayValue={(badge) => screamingSnakeToTitleCase(badge)}
          allowRemove
        />
        <GenericComboBox
          options={difficultyEnums}
          onChange={onChange}
          selected={difficulties}
          displayValue={(difficulty) => screamingSnakeToTitleCase(difficulty)}
        />
      </>
    </>
  );
};
