import { QuizQuestionTopicEnum } from '@prisma/client';
import { AssignmentAttemptDao } from '../dao/AssignmentAttemptDao';
import { TakeDao } from '../dao/TakeDao';
import { ElementOf, ThenArg } from '../types';
import { SubjectWiseAnalyticsServiceParams } from '../types/statistics';
import { AllTakesStudentParams } from '../types/takes';
import type { PointOptionsObject } from 'highcharts';

class SubjectStatisticsService {
  constructor(
    private assignmentAttemptDao = new AssignmentAttemptDao(),
    private takeDao = new TakeDao(),
  ) {}

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
  }: SubjectWiseAnalyticsServiceParams): Promise<{
    subject?: Array<
      number | [number | string, number | null] | null | PointOptionsObject
    >;
    [key: string]: Array<
      number | [number | string, number | null] | null | PointOptionsObject
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
      (item, anotherItem) => {
        let firstCreatedAt = new Date();
        if (this.isAssignmentAttempt(item)) {
          firstCreatedAt = item.submittedOn;
        } else {
          firstCreatedAt = item.attemptedAt;
        }

        let secondCreatedAt = new Date();
        if (this.isAssignmentAttempt(anotherItem)) {
          secondCreatedAt = anotherItem.submittedOn;
        } else {
          secondCreatedAt = anotherItem.attemptedAt;
        }

        return firstCreatedAt < secondCreatedAt
          ? -1
          : firstCreatedAt > secondCreatedAt
          ? 1
          : 0;
      },
    );

    // 1. Maintain a Map<quizId, take> quizToMarksMap, running sum of currentMarksAchieved, running sum of currentTotalMarks
    const quizOrAssignmentIdToMarksMap = new Map<string, number>();
    let currentMarksAchieved = 0;
    let currentTotalMarks = 0;
    const topicsToMarksMap = new Map<
      string,
      { marksAchieved: number; totalMarks: number }
    >();
    // 2. For every take (and attempt)
    const res = takesAndAttemptsSorted.reduce((curr, takeOrAttempt) => {
      if (this.isAssignmentAttempt(takeOrAttempt)) {
        // 2.2.1 currentMarksAchieved += take.marks, currentTotalMarks += take.quiz.totalMarks
        const attemptTotalMarks = takeOrAttempt.assignment.totalMarks;
        const attemptMarksAchieved = takeOrAttempt.score;
        currentTotalMarks += attemptTotalMarks;
        currentMarksAchieved += attemptMarksAchieved;
        // 2.2 If current quizId of take is in the map, then cuirrentmarksAchieved -= quizToTakeMap.get(take.quizId).marks, update map to current take
        if (quizOrAssignmentIdToMarksMap.has(takeOrAttempt.assignment.id)) {
          currentMarksAchieved -= quizOrAssignmentIdToMarksMap.get(
            takeOrAttempt.assignment.id,
          );
          currentTotalMarks -= attemptTotalMarks;
        }
        // Update map
        quizOrAssignmentIdToMarksMap.set(
          takeOrAttempt.assignment.id,
          attemptMarksAchieved,
        );

        // 2.4 Update array to return
        const newEntry: PointOptionsObject = {
          x: takeOrAttempt.submittedOn.getTime(),
          y: (currentMarksAchieved / currentTotalMarks) * 100,
        };
        // return [...currArray, newEntry];
        const currentSubjectData = curr.subject ? curr.subject : [];
        currentSubjectData.push(newEntry);
        if (!curr.subject) {
          curr.subject = currentSubjectData;
        }
        return curr;
      } else {
        const localQuestionIdToAnswersMap = this.groupTakeAnswersByQuestionId(
          takeOrAttempt.studentAnswers,
        );
        const topicsForTake = new Set<QuizQuestionTopicEnum>();
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

          if (quizOrAssignmentIdToMarksMap.has(currentQuestion.id)) {
            const marks = quizOrAssignmentIdToMarksMap.get(currentQuestion.id);
            currentMarksAchieved -= marks;
            currentTotalMarks--;
          }

          currentTotalMarks++;
          topics?.forEach((topic) => {
            if (topicsForQuestion.includes(topic)) {
              const marks = topicsToMarksMap.get(topic) ?? {
                marksAchieved: 0,
                totalMarks: 0,
              };
              if (quizOrAssignmentIdToMarksMap.has(currentQuestion.id)) {
                marks.marksAchieved -= quizOrAssignmentIdToMarksMap.get(
                  currentQuestion.id,
                );
                marks.totalMarks--;
              }
              marks.marksAchieved += isCorrect ? 1 : 0;
              marks.totalMarks++;
              topicsToMarksMap.set(topic, marks);
            }
          });

          if (isCorrect) {
            currentMarksAchieved++;
            quizOrAssignmentIdToMarksMap.set(currentQuestion.id, 1);
          } else {
            quizOrAssignmentIdToMarksMap.set(currentQuestion.id, 0);
          }
        });

        // For every topic for take, update
        topicsForTake.forEach((topic) => {
          const marks = topicsToMarksMap.get(topic);
          if (!marks) return;
          const newEntry: PointOptionsObject = {
            x: takeOrAttempt.attemptedAt.getTime(),
            y: (marks.marksAchieved / marks.totalMarks) * 100,
          };
          const currentData = curr[topic] ?? [];
          currentData.push(newEntry);
          if (!curr[topic]) {
            curr[topic] = currentData;
          }
        });
        // For every topic in the question, update the entry for it
        const newEntry: PointOptionsObject = {
          x: takeOrAttempt.attemptedAt.getTime(),
          y: (currentMarksAchieved / currentTotalMarks) * 100,
        };
        const currentSubjectData = curr.subject ? curr.subject : [];
        currentSubjectData.push(newEntry);
        if (!curr.subject) {
          curr.subject = currentSubjectData;
        }

        return curr;
      }
    }, {} as ThenArg<ReturnType<typeof this.getSubjectWiseAnalytics>>);
    return res;
  }
}

export default new SubjectStatisticsService();
