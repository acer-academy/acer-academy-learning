import { TakeAnswerService } from './TakeAnswerService';
import { QuizService } from './QuizService';
import { QuizQuestionService } from './QuizQuestionService';
import { QuizQuestionTypeEnum, QuizQuestion } from '@prisma/client';
import { QuizAnswerService } from './QuizAnswerService';
import { QuizOnQuizQuestionDao } from '../dao/QuizOnQuizQuestionDao';
import { TakeService } from './TakeService';

class QuizStatisticsService {
  constructor(
    private takeAnswerService = new TakeAnswerService(),
    private takeService = new TakeService(),
    private quizQuestionService = new QuizQuestionService(),
    private quizAnswerService = new QuizAnswerService(),
    private quizOnQuizQuestionDao = new QuizOnQuizQuestionDao(),
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
}

export default new QuizStatisticsService();
