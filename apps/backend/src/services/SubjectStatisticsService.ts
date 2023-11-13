import { QuizQuestionTopicEnum } from '@prisma/client';
import { AssignmentAttemptDao } from '../dao/AssignmentAttemptDao';
import { TakeDao } from '../dao/TakeDao';
import { ElementOf, ThenArg } from '../types';
import { SubjectWiseAnalyticsServiceParams } from '../types/statistics';
import { AllTakesStudentParams } from '../types/takes';
import type { PointOptionsObject } from 'highcharts';

type SubjectWiseMetaDataPerTakeOrAssignment = {
  marksAchieved: number;
  totalMarks: number;
  questionIdToTakeIdMap: {
    [key: string]: string;
  };
};

type CustomPointOptionsObject = {
  metaData?: { [key: string]: string };
} & PointOptionsObject;

class SubjectStatisticsService {
  constructor(
    private assignmentAttemptDao = new AssignmentAttemptDao(),
    private takeDao = new TakeDao(),
  ) {}

  // Util Methods
  private isAssignmentAttempt = (
    item: ElementOf<
      ThenArg<
        ReturnType<
          | typeof this.takeDao.getAllTakesOfStudent
          | typeof this.assignmentAttemptDao.getAssignmentAttemptsByStudentId
        >
      >
    >,
  ): item is ElementOf<
    ThenArg<
      ReturnType<
        typeof this.assignmentAttemptDao.getAssignmentAttemptsByStudentId
      >
    >
  > => {
    return 'assignmentId' in item;
  };

  private compareTakeOrAttemptByCreatedAtAsc = (
    takeOrAttempt: ElementOf<
      ThenArg<
        ReturnType<
          | typeof this.takeDao.getAllTakesOfStudent
          | typeof this.assignmentAttemptDao.getAssignmentAttemptsByStudentId
        >
      >
    >,
    anotherTakeOrAttempt: ElementOf<
      ThenArg<
        ReturnType<
          | typeof this.takeDao.getAllTakesOfStudent
          | typeof this.assignmentAttemptDao.getAssignmentAttemptsByStudentId
        >
      >
    >,
  ) => {
    const firstCreatedAt = this.isAssignmentAttempt(takeOrAttempt)
      ? takeOrAttempt.submittedOn
      : takeOrAttempt.attemptedAt;
    const secondCreatedAt = this.isAssignmentAttempt(anotherTakeOrAttempt)
      ? anotherTakeOrAttempt.submittedOn
      : anotherTakeOrAttempt.attemptedAt;

    return firstCreatedAt < secondCreatedAt
      ? -1
      : firstCreatedAt > secondCreatedAt
      ? 1
      : 0;
  };

  private groupTakeAnswersByQuestionId = (
    takeAnswers: ElementOf<
      ThenArg<ReturnType<typeof this.takeDao.getAllTakesOfStudent>>
    >['studentAnswers'],
    questionIdToAnswerMap: Map<
      string,
      ElementOf<
        ThenArg<ReturnType<typeof this.takeDao.getAllTakesOfStudent>>
      >['studentAnswers']
    > = new Map(),
  ) => {
    takeAnswers.forEach((answer) => {
      const currentQuestionId = answer.question.id;
      const currentAnswerArray =
        questionIdToAnswerMap.get(currentQuestionId) ?? [];
      currentAnswerArray.push(answer);
      if (!questionIdToAnswerMap.has(currentQuestionId)) {
        questionIdToAnswerMap.set(currentQuestionId, currentAnswerArray);
      }
    });

    return questionIdToAnswerMap;
  };

  /**
   * Returns the performance of a subject/topic over time
   * Dynamically updates totalMarksAchieved / totalCurrentMarks for every take/assignmentAttempt point of time taken
   */
  public async getSubjectWiseAnalytics({
    startDate,
    studentId,
    topics,
    subject,
  }: SubjectWiseAnalyticsServiceParams): Promise<{
    [key: string]: Array<
      | number
      | [number | string, number | null]
      | null
      | CustomPointOptionsObject
    >;
  }> {
    // 0. Query all takes where time and sorted by time asc, all assignments by time asc
    const filterOptions: AllTakesStudentParams = {
      studentId: studentId,
    };

    if (startDate) {
      filterOptions.startDate = startDate;
    }
    const takes = await this.takeDao.getAllTakesOfStudent(filterOptions);
    const assignments =
      await this.assignmentAttemptDao.getAssignmentAttemptsByStudentId(
        studentId,
      );

    // Merge assignments and quiz and sort by created ascending
    const takesAndAttemptsSorted = [...takes, ...assignments].sort(
      this.compareTakeOrAttemptByCreatedAtAsc,
    );

    const questionOrAssignmentIdToMarksMap = new Map<string, number>();
    const topicsOrSubjectToMarksMap = new Map<
      string,
      SubjectWiseMetaDataPerTakeOrAssignment
    >();
    // Initialise entry for subject since it must always exist
    topicsOrSubjectToMarksMap.set(subject, {
      marksAchieved: 0,
      totalMarks: 0,
      questionIdToTakeIdMap: {},
    });
    // 2. For every take (and attempt)
    const res = takesAndAttemptsSorted.reduce((curr, takeOrAttempt) => {
      const subjectMarks = topicsOrSubjectToMarksMap.get(subject);
      const topicsForTake = new Set<QuizQuestionTopicEnum>();
      if (this.isAssignmentAttempt(takeOrAttempt)) {
        const attemptTotalMarks = takeOrAttempt.assignment.totalMarks;
        const attemptMarksAchieved = takeOrAttempt.score;
        subjectMarks.totalMarks += attemptTotalMarks;
        subjectMarks.marksAchieved += attemptMarksAchieved;
        if (questionOrAssignmentIdToMarksMap.has(takeOrAttempt.assignment.id)) {
          subjectMarks.marksAchieved -= questionOrAssignmentIdToMarksMap.get(
            takeOrAttempt.assignment.id,
          );
          subjectMarks.totalMarks -= attemptTotalMarks;
        }
        // Update map
        questionOrAssignmentIdToMarksMap.set(
          takeOrAttempt.assignment.id,
          attemptMarksAchieved,
        );
      } else {
        const localQuestionIdToAnswersMap = this.groupTakeAnswersByQuestionId(
          takeOrAttempt.studentAnswers,
        );
        localQuestionIdToAnswersMap.forEach((value) => {
          const currentQuestion = value[0].question;
          const topicsForQuestion = currentQuestion.topics;
          topicsForQuestion.forEach((topic) => topicsForTake.add(topic));
          const correctOptionsByStudent = value.filter(
            (value) => value.isCorrect,
          );
          const correctOptions = currentQuestion.answers.filter(
            (value) => value.isCorrect,
          );
          const isCorrect =
            correctOptionsByStudent.length === correctOptions.length;

          if (questionOrAssignmentIdToMarksMap.has(currentQuestion.id)) {
            const marks = questionOrAssignmentIdToMarksMap.get(
              currentQuestion.id,
            );
            subjectMarks.marksAchieved -= marks;
            subjectMarks.totalMarks--;
          }

          topics?.forEach((topic) => {
            if (topicsForQuestion.includes(topic)) {
              const marks = topicsOrSubjectToMarksMap.get(topic) ?? {
                marksAchieved: 0,
                totalMarks: 0,
                questionIdToTakeIdMap: {},
              };
              if (questionOrAssignmentIdToMarksMap.has(currentQuestion.id)) {
                marks.marksAchieved -= questionOrAssignmentIdToMarksMap.get(
                  currentQuestion.id,
                );
                marks.totalMarks--;
              }
              marks.marksAchieved += isCorrect ? 1 : 0;
              marks.totalMarks++;
              topicsOrSubjectToMarksMap.set(topic, marks);
              // Remove questionId from object if it exists
              if (isCorrect) {
                delete marks.questionIdToTakeIdMap[currentQuestion.id];
              } else {
                marks.questionIdToTakeIdMap[currentQuestion.id] =
                  takeOrAttempt.id;
              }
            }
          });
          subjectMarks.totalMarks++;
          if (isCorrect) {
            subjectMarks.marksAchieved++;
            questionOrAssignmentIdToMarksMap.set(currentQuestion.id, 1);
          } else {
            questionOrAssignmentIdToMarksMap.set(currentQuestion.id, 0);
          }
        });
      }
      // For every topic for take, update
      topicsForTake.forEach((topic) => {
        const marks = topicsOrSubjectToMarksMap.get(topic);
        if (!marks) return;
        const newEntry: CustomPointOptionsObject = {
          x: this.isAssignmentAttempt(takeOrAttempt)
            ? takeOrAttempt.submittedOn.getTime()
            : takeOrAttempt.attemptedAt.getTime(),
          y: (marks.marksAchieved / marks.totalMarks) * 100,
          metaData: { ...marks.questionIdToTakeIdMap },
        };
        const currentData = curr[topic] ?? [];
        currentData.push(newEntry);
        if (!curr[topic]) {
          curr[topic] = currentData;
        }
      });
      const newEntry: CustomPointOptionsObject = {
        x: this.isAssignmentAttempt(takeOrAttempt)
          ? takeOrAttempt.submittedOn.getTime()
          : takeOrAttempt.attemptedAt.getTime(),
        y: (subjectMarks.marksAchieved / subjectMarks.totalMarks) * 100,
      };
      const currentSubjectData = curr[subject] ? curr[subject] : [];
      currentSubjectData.push(newEntry);
      if (!curr[subject]) {
        curr[subject] = currentSubjectData;
      }
      return curr;
    }, {} as ThenArg<ReturnType<typeof this.getSubjectWiseAnalytics>>);
    return res;
  }
}

export default new SubjectStatisticsService();
