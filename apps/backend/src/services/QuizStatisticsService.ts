import { TakeAnswerService } from './TakeAnswerService';
import { QuizService } from './QuizService';
import { QuizQuestionService } from './QuizQuestionService';
import {
  QuizQuestionTypeEnum,
  QuizQuestion,
  QuizAnswer,
  QuizQuestionTopicEnum,
} from '@prisma/client';
import { QuizAnswerService } from './QuizAnswerService';
import { QuizOnQuizQuestionDao } from '../dao/QuizOnQuizQuestionDao';
import { TakeService } from './TakeService';
import { TakeDao } from '../dao/TakeDao';
import { AllTakesStudentParams } from '../types/takes';
import { ElementOf, ThenArg } from '../types';

class QuizStatisticsService {
  constructor(
    private takeAnswerService = new TakeAnswerService(),
    private takeService = new TakeService(),
    private quizQuestionService = new QuizQuestionService(),
    private quizAnswerService = new QuizAnswerService(),
    private quizOnQuizQuestionDao = new QuizOnQuizQuestionDao(),
    private quizService = new QuizService(),
    private takeDao = new TakeDao(),
  ) {}

  // View correct/incorrect statistics per question
  public async correctRateByQuestionId(
    quizQuestionId: string,
  ): Promise<string> {
    const question = await this.quizQuestionService.getQuizQuestionById(
      quizQuestionId,
    );
    const correctTakeAnswers =
      await this.takeAnswerService.getCorrectTakeAnswersByQuestionId(
        quizQuestionId,
      );

    if (question.questionType === QuizQuestionTypeEnum.MRQ) {
      let correct = 0;
      let correctAnsLength = (
        await this.quizAnswerService.getCorrectAnswersByQuestion(quizQuestionId)
      ).length;
      const studentAnswerMap = new Map();
      correctTakeAnswers.forEach((correct) => {
        if (studentAnswerMap.get(correct.id)) {
          studentAnswerMap.set(
            correct.takeId,
            studentAnswerMap.get(correct.id) + 1,
          );
        } else {
          studentAnswerMap.set(correct.takeId, 1);
        }
      });
      Object.keys(studentAnswerMap).forEach((num) => {
        if (parseInt(num) === correctAnsLength) {
          correct++;
        }
      });
      return ((correct / studentAnswerMap.size) * 100).toFixed(2);
    }

    const takeAnswers =
      await this.takeAnswerService.getTakeAnswersByQuizQuestion(quizQuestionId);

    return ((correctTakeAnswers.length / takeAnswers.length) * 100).toFixed(2);
  }

  // View time taken statistics per question
  public async averageTimeTakenByQuestionId(
    quizQuestionId: string,
  ): Promise<string> {
    const takeAnswers =
      await this.takeAnswerService.getTakeAnswersByQuizQuestion(quizQuestionId);
    let totalTime = 0;
    for (let take of takeAnswers) {
      totalTime += take.timeTaken;
    }
    return (totalTime / takeAnswers.length).toFixed(2);
  }

  // View Spider Chart analysis for quiz attempt
  public async spiderChartAnalysis(
    takeId: string,
  ): Promise<{ subjectArr: string[]; averageScoreArr: number[] }> {
    const take = await this.takeService.getTakeById(takeId);
    const quizOnQuizQuestions =
      await this.quizOnQuizQuestionDao.getQuizOnQuizQuestionsByQuizId(
        take.quizId,
      );
    const quizQuestions: QuizQuestion[] = [];
    for (const quizOnQuiz of quizOnQuizQuestions) {
      quizQuestions.push(
        await this.quizQuestionService.getQuizQuestionById(
          quizOnQuiz.quizQuestionId,
        ),
      );
    }

    const subjectToAverageScoreMap = new Map();

    /* Get take answer for the question -> check whether take answer is right or wrong -> consolidate it in map based on topics */
    for (const ques of quizQuestions) {
      const takeAns =
        await this.takeAnswerService.getTakeAnswersByTakeAndQuizQuestion(
          takeId,
          ques.id,
        );
      let correct = takeAns.length > 0 ? takeAns[0].isCorrect : false;
      if (ques.questionType === QuizQuestionTypeEnum.MRQ) {
        let correctAnsLength = (
          await this.quizAnswerService.getCorrectAnswersByQuestion(ques.id)
        ).length;
        let correctLength = 0;
        takeAns.forEach((take) => {
          if (take.isCorrect) {
            correctLength++;
          }
        });
        correct = correctLength === correctAnsLength;
      }
      for (const topic of ques.topics) {
        if (subjectToAverageScoreMap.get(topic)) {
          const temp = subjectToAverageScoreMap.get(topic).concat([correct]);
          subjectToAverageScoreMap.set(topic, temp);
        } else {
          subjectToAverageScoreMap.set(topic, [correct]);
        }
      }
    }

    const subjectArr = [];
    const averageScoreArr = [];

    subjectToAverageScoreMap.forEach((values, key) => {
      let sum = 0;
      const average = values.forEach((bool) => {
        if (bool) {
          sum++;
        }
      });
      averageScoreArr.push((sum / values.length) * 10);
      subjectArr.push(key);
    });

    return { subjectArr, averageScoreArr };
  }

  // Gets consolidated quiz statistics per quiz
  public async quizStatisticsByQuizId(quizId: string): Promise<any> {
    const {
      rewardPoints,
      rewardMinimumMarks,
      teacherCreatedId,
      nextVersionId,
      allocatedTo,
      takes,
      quizQuestions,
      ...rest
    } = (await this.quizService.getQuizById(quizId)) as any;

    const questionOptionCountMap: Map<string, number> = new Map();
    for (const take of takes) {
      const takeAnswers = await this.takeAnswerService.getTakeAnswersByTake(
        take.id,
      );
      for (const takeAnswer of takeAnswers) {
        const key = `${takeAnswer.questionId}${takeAnswer.studentAnswer}`;
        const val = questionOptionCountMap.get(key) ?? 0;
        questionOptionCountMap.set(key, val + 1);
      }
    }

    let formattedQuizQuestions = [];
    for (const quizQuestion of quizQuestions) {
      formattedQuizQuestions.push({
        quizQuestionId: quizQuestion.quizQuestionId,
        quizQuestionIndex: quizQuestion.quizQuestionIndex,
        quizQuestionMarks: quizQuestion.quizQuestionMarks,
        questionText: quizQuestion.quizQuestion.questionText,
        correctRate: await this.correctRateByQuestionId(
          quizQuestion.quizQuestionId,
        ),
        averageTimeTaken: await this.averageTimeTakenByQuestionId(
          quizQuestion.quizQuestionId,
        ),
        options: [
          ...quizQuestion.quizQuestion.answers.map(
            (option: Partial<QuizAnswer>) => {
              const key = `${quizQuestion.quizQuestionId}${option.answer}`;
              const count = questionOptionCountMap.get(key) ?? 0;
              questionOptionCountMap.delete(key);
              return {
                answer: option.answer,
                isCorrect: option.isCorrect,
                count: count,
              };
            },
          ),
          ...Array.from(questionOptionCountMap.keys())
            .filter((key) => key.includes(quizQuestion.quizQuestionId))
            .map((key) => {
              return {
                answer: key.slice(key.indexOf('{')),
                isCorrect: false,
                count: questionOptionCountMap.get(key),
              };
            }),
        ],
      });
    }

    const quizTakes = await this.takeService.getTakesByQuiz(quizId);

    const totalMarksArr = quizTakes.map((take) => take.marks);

    const averageTotalTimeTaken =
      quizTakes.map((take) => take.timeTaken).reduce((x, y) => x + y, 0) /
      quizTakes.length;

    return {
      totalMarksArr: totalMarksArr,
      averageTotalTimeTaken: averageTotalTimeTaken,
      quizDetails: rest,
      quizQuestions: formattedQuizQuestions,
    };
  }

  public async getQuizStatisticsStudentTakesFilteredBy(
    filter: AllTakesStudentParams,
  ) {
    return this.takeDao.getAllTakesOfStudent(filter);
  }

  public async getTotalMarksByQuizId(quizId: string) {
    const res = await this.quizService.getQuizById(quizId);
    return res.totalMarks;
  }

  /**
   * Pre-cond: takes should already have been filtered by topics contained in subjects
   * This is just so that they are arranged by subject instead of by topics
   * this is just
   * @param takes
   * @param onlyAttemptedTopics
   */
  // private async getSpiderChartDataBySubject(takes: ThenArg<typeof this.getQuizStatisticsStudentTakesFilteredBy>) {

  // }

  private processTakeAnswersForAverageScore(
    takeAnswers: ElementOf<
      ThenArg<ReturnType<typeof this.getQuizStatisticsStudentTakesFilteredBy>>
    >['studentAnswers'],
    topicsToMarksMap: Map<string, boolean[]>,
  ) {
    // 1. Group up answers by questionId
    const questionIdToAnswerMap = new Map<string, typeof takeAnswers>();
    takeAnswers.forEach((answer) => {
      const currentQuestionId = answer.question.id;
      const currentAnswerArray =
        questionIdToAnswerMap.get(currentQuestionId) ?? [];
      currentAnswerArray.push(answer);
      if (!questionIdToAnswerMap.has(currentQuestionId)) {
        questionIdToAnswerMap.set(currentQuestionId, currentAnswerArray);
      }
    });

    // 2. For each question, check if it is correct and assign in a map based on topics chosen
    questionIdToAnswerMap.forEach((value) => {
      const currentQuestion = value[0].question;
      const correctOptionsByStudent = value.filter((value) => value.isCorrect);
      const correctOptions = currentQuestion.answers.filter(
        (value) => value.isCorrect,
      );
      const isCorrect =
        correctOptionsByStudent.length === correctOptions.length;
      const topics = currentQuestion.topics;
      topics.map((topic) => {
        //@TODO: To change if ever refactor topics
        const currentMarksArr = topicsToMarksMap.get(topic) ?? [];
        currentMarksArr.push(isCorrect);
        if (!topicsToMarksMap.has(topic)) {
          topicsToMarksMap.set(topic, currentMarksArr);
        }
      });
    });
  }

  public async getQuizStatisticsStudentSpiderChartDataBy(data: {
    filter: AllTakesStudentParams;
    onlyAttemptedTopics: boolean;
    topics?: QuizQuestionTopicEnum[];
  }) {
    const topicsToAverageScoreArrMap = new Map<string, boolean[]>();
    const filter = data.filter;
    const latestDatesByQuizId =
      await this.takeDao.getLatestAttemptDateOfQuizzesForStudentsWhere(filter);
    for (const latestDate of latestDatesByQuizId) {
      const startDate = latestDate._max.attemptedAt;
      const quizId = latestDate.quizId;
      filter.startDate = startDate.toISOString();
      filter.quizIds = [quizId];

      const currentTake = await this.getQuizStatisticsStudentTakesFilteredBy(
        filter,
      );

      this.processTakeAnswersForAverageScore(
        currentTake[0].studentAnswers,
        topicsToAverageScoreArrMap,
      );
    }
    // Group for each question
    const topics = data.topics;
    const labelsArr = [];
    const dataArr = [];
    topicsToAverageScoreArrMap.forEach((value, key) => {
      if (topics && !topics.includes(key as QuizQuestionTopicEnum)) {
        return;
      }
      labelsArr.push(key);
      const numOfCorrect = value.filter((value) => value);
      dataArr.push((numOfCorrect.length / value.length) * 10);
    });

    return {
      labelsArr: labelsArr,
      dataArr: dataArr,
    };
  }
}

export default new QuizStatisticsService();
