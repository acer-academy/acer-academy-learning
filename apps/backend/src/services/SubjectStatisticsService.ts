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

  /**
   * Returns the performance of a subject/topic over time
   * Dynamically updates totalMarksAchieved / totalCurrentMarks for every take/assignmentAttempt point of time taken
   */
  public async getSubjectWiseAnalytics({
    startDate,
    studentId,
  }: SubjectWiseAnalyticsServiceParams): Promise<
    Array<number | [number | string, number | null] | null | PointOptionsObject>
  > {
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
    // 1. Maintain a Map<quizId, take> quizToMarksMap, running sum of currentMarksAchieved, running sum of currentTotalMarks
    const quizOrAssignmentToMarksMap = new Map<string, number>();
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

    let currentMarksAchieved = 0;
    let currentTotalMarks = 0;
    // let output = [];
    // 2. For every take (and attempt)
    const res = takesAndAttemptsSorted.reduce((currArray, takeOrAttempt) => {
      if (this.isAssignmentAttempt(takeOrAttempt)) {
        // 2.2.1 currentMarksAchieved += take.marks, currentTotalMarks += take.quiz.totalMarks
        const attemptTotalMarks = takeOrAttempt.assignment.totalMarks;
        currentTotalMarks += attemptTotalMarks;
        const attemptMarksAchieved = takeOrAttempt.score;
        currentMarksAchieved += attemptMarksAchieved;
        // 2.2 If current quizId of take is in the map, then cuirrentmarksAchieved -= quizToTakeMap.get(take.quizId).marks, update map to current take
        if (quizOrAssignmentToMarksMap.has(takeOrAttempt.assignment.id)) {
          currentMarksAchieved -= quizOrAssignmentToMarksMap.get(
            takeOrAttempt.assignment.id,
          );
          currentTotalMarks -= attemptTotalMarks;
        }
        // Update map
        quizOrAssignmentToMarksMap.set(
          takeOrAttempt.assignment.id,
          attemptMarksAchieved,
        );

        // 2.4 Update array to return
        const newEntry: PointOptionsObject = {
          x: takeOrAttempt.submittedOn.getTime(),
          y: (currentMarksAchieved / currentTotalMarks) * 100,
        };
        return [...currArray, newEntry];
      } else {
        const takeTotalMarks = takeOrAttempt.quiz.totalMarks;
        currentTotalMarks += takeTotalMarks;
        const takeMarksAchieved = takeOrAttempt.marks;
        currentMarksAchieved += takeMarksAchieved;

        if (quizOrAssignmentToMarksMap.has(takeOrAttempt.quiz.id)) {
          currentMarksAchieved -= quizOrAssignmentToMarksMap.get(
            takeOrAttempt.quiz.id,
          );
          currentTotalMarks -= takeTotalMarks;
        }

        // Update map
        quizOrAssignmentToMarksMap.set(
          takeOrAttempt.quiz.id,
          takeMarksAchieved,
        );

        const newEntry: PointOptionsObject = {
          x: takeOrAttempt.attemptedAt.getTime(),
          y: (currentMarksAchieved / currentTotalMarks) * 100,
        };
        return [...currArray, newEntry];
      }
    }, []);
    return res;
  }
}

export default new SubjectStatisticsService();
