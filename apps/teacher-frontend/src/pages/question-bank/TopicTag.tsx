import { topicEnumUIMap } from '@acer-academy-learning/common-ui';
import { QuizQuestionTopicEnum } from '@acer-academy-learning/data-access';

export const TopicTag: React.FC<{
  index: React.Key;
  topicEnum: QuizQuestionTopicEnum;
  removeTagCallback?: Function;
}> = (props) => {
  const { index, topicEnum, removeTagCallback } = props;

  const topicInfo = topicEnumUIMap.get(topicEnum);

  return (
    <div
      key={index}
      className={`${
        topicInfo ? topicInfo.bgColor : ''
      } rounded-xl pl-3 pr-3 py-1 flex gap-2 font-light shadow text-xs max-w-fit`}
    >
      <span className="py-1">{topicInfo ? topicInfo.prettyText : ''}</span>
      {removeTagCallback && (
        <button
          className=""
          onClick={() => {
            removeTagCallback();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-zinc-800 hover:fill-zinc-900"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
