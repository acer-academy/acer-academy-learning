import { LevelEnum } from '@acer-academy-learning/data-access';
import {
  QuizQuestionDifficultyEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTopicEnum,
  QuizQuestionTypeEnum,
} from '@acer-academy-learning/data-access';
import { QuizQuestionPaginationFilter } from 'libs/data-access/src/lib/types/question';

import { useEffect, useState } from 'react';
import { LevelTag } from './LevelTag';
import { TopicTag } from './TopicTag';
import { QuizStatusTag } from './QuizStatusTag';
import DifficultyTag from './DifficultyTag';
import TypeTag from './QuestionTypeTag';

export const Filter: React.FC<{ filterSubmitCallback: Function }> = (props) => {
  const [difficulties, setDifficulties] = useState<
    QuizQuestionDifficultyEnum[]
  >([]);
  const [levels, setLevels] = useState<LevelEnum[]>([]);
  const [topics, setTopics] = useState<QuizQuestionTopicEnum[]>([]);
  const [statuses, setStatuses] = useState<QuizQuestionStatusEnum[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuizQuestionTypeEnum[]>(
    [],
  );
  const [showAllVersions, setShowAllVersions] = useState<boolean>(false);

  // Used to bypass html select value no change
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');

  const { filterSubmitCallback } = props;

  useEffect(() => {
    const filterOptions: QuizQuestionPaginationFilter = {
      difficulty: difficulties,
      levels: levels,
      topics: topics,
      status: statuses,
      questionType: questionTypes,
      showLatestOnly: !showAllVersions,
    };
    console.log(filterOptions);
    filterSubmitCallback(filterOptions);
  }, [difficulties, levels, topics, statuses, questionTypes, showAllVersions]);

  const handleDifficultyPress = (difficulty: QuizQuestionDifficultyEnum) => {
    if (difficulties.includes(difficulty)) {
      const newDifficulties = difficulties.filter(
        (other) => other !== difficulty,
      );
      setDifficulties(newDifficulties);
    } else {
      const newDifficulties = difficulties.concat(difficulty);
      setDifficulties(newDifficulties);
    }
    setSelectedDifficulty('');
  };

  const handleLevelPress = (level: LevelEnum) => {
    if (levels.includes(level)) {
      const newLevels = levels.filter((other) => other !== level);
      setLevels(newLevels);
    } else {
      const newLevels = levels.concat(level);
      setLevels(newLevels);
    }
    setSelectedLevel('');
  };

  const handleTopicPress = (topic: QuizQuestionTopicEnum) => {
    if (topics.includes(topic)) {
      const newTopics = topics.filter((other) => other !== topic);
      setTopics(newTopics);
    } else {
      const newTopics = topics.concat(topic);
      setTopics(newTopics);
    }
    setSelectedTopic('');
  };

  const handleStatusPress = (status: QuizQuestionStatusEnum) => {
    if (statuses.includes(status)) {
      const newStatuses = statuses.filter((other) => other !== status);
      setStatuses(newStatuses);
    } else {
      const newStatuses = statuses.concat(status);
      setStatuses(newStatuses);
    }
    setSelectedStatus('');
  };

  const handleQuestionTypePress = (questionType: QuizQuestionTypeEnum) => {
    if (questionTypes.includes(questionType)) {
      const newQuestionTypes = questionTypes.filter(
        (other) => other !== questionType,
      );
      setQuestionTypes(newQuestionTypes);
    } else {
      const newQuestionTypes = questionTypes.concat(questionType);
      setQuestionTypes(newQuestionTypes);
    }
    setSelectedQuestionType('');
  };

  const handleResetAll = () => {
    setDifficulties([]);
    setLevels([]);
    setTopics([]);
    setStatuses([]);
    setQuestionTypes([]);
  };

  const formatStringEnumToText = (strEnum: string) => {
    if (['MCQ', 'MRQ', 'TFQ'].includes(strEnum)) return strEnum;
    return strEnum
      .split('_')
      .map((t) => t.slice(0, 1) + t.slice(1).toLowerCase())
      .reduce((a, b) => `${a} ${b}`);
  };

  return (
    <>
      <div className="flex gap-5 justify-start sm:flex-wrap">
        <select
          className=" rounded-md"
          value={selectedLevel}
          onChange={(e) => handleLevelPress(e.target.value as LevelEnum)}
        >
          <option value="" disabled>
            Level
          </option>
          {Object.values(LevelEnum).map((level, index) => (
            <option key={index} value={level}>
              {level}
            </option>
          ))}
        </select>
        <select
          className=" rounded-md"
          value={selectedTopic}
          onChange={(e) =>
            handleTopicPress(e.target.value as QuizQuestionTopicEnum)
          }
        >
          <option value="" disabled>
            Topic
          </option>
          {Object.values(QuizQuestionTopicEnum).map((topic, index) => (
            <option key={index} value={topic}>
              {formatStringEnumToText(topic)}
            </option>
          ))}
        </select>
        <select
          className=" rounded-md"
          value={selectedDifficulty}
          onChange={(e) =>
            handleDifficultyPress(e.target.value as QuizQuestionDifficultyEnum)
          }
        >
          <option value="" disabled>
            Difficulty
          </option>
          {Object.values(QuizQuestionDifficultyEnum).map(
            (difficulty, index) => (
              <option key={index} value={difficulty}>
                {formatStringEnumToText(difficulty)}
              </option>
            ),
          )}
        </select>
        <select
          className="rounded-md"
          value={selectedStatus}
          onChange={(e) =>
            handleStatusPress(e.target.value as QuizQuestionStatusEnum)
          }
        >
          <option value="" disabled>
            Status
          </option>
          {Object.values(QuizQuestionStatusEnum).map((status, index) => (
            <option key={index} value={status}>
              {formatStringEnumToText(status)}
            </option>
          ))}
        </select>
        <select
          className="rounded-md"
          value={selectedQuestionType}
          onChange={(e) =>
            handleQuestionTypePress(e.target.value as QuizQuestionTypeEnum)
          }
        >
          <option value="" disabled>
            Type
          </option>
          {Object.values(QuizQuestionTypeEnum).map((questionType, index) => (
            <option key={index} value={questionType}>
              {formatStringEnumToText(questionType)}
            </option>
          ))}
        </select>
        <button
          className="bg-teacherBlue-500 hover:bg-teacherBlue-700 text-white rounded-md px-4 py-2 ml-auto"
          onClick={handleResetAll}
        >
          Reset
        </button>
      </div>
      <div className="flex gap-2 mt-2 items-center">
        <input
          type="checkbox"
          id="showAllVersionsCheckbox"
          checked={showAllVersions}
          onChange={() => {
            setShowAllVersions(!showAllVersions);
          }}
        />
        <label htmlFor="showAllVersionsCheckbox">Show all versions</label>
      </div>
      <div className="mt-5 flex gap-5 flex-wrap items-center">
        {levels.map((level, index) => {
          return (
            <LevelTag
              key={index}
              index={index}
              levelEnum={level}
              removeTagCallback={() => {
                handleLevelPress(level);
              }}
            />
          );
        })}
        {topics.map((topic, index) => {
          return (
            <TopicTag
              key={index}
              index={index}
              topicEnum={topic}
              removeTagCallback={() => {
                handleTopicPress(topic);
              }}
            />
          );
        })}
        {difficulties.map((difficulty, index) => {
          return (
            <div key={index}>
              <DifficultyTag
                difficulty={difficulty}
                removeTagCallback={() => {
                  handleDifficultyPress(difficulty);
                }}
              />
            </div>
          );
        })}
        {statuses.map((status, index) => (
          <div key={index}>
            <QuizStatusTag
              status={status}
              removeTagCallback={() => {
                handleStatusPress(status);
              }}
            />
          </div>
        ))}
        {questionTypes.map((questionType, index) => (
          <div key={index}>
            <TypeTag
              type={questionType}
              removeTagCallback={() => {
                handleQuestionTypePress(questionType);
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
