import { TakeAnswerService } from './TakeAnswerService';
import { QuizService } from './QuizService';
import { QuizQuestionService } from './QuizQuestionService';

class QuizStatisticsService {
  constructor(
    private takeAnswerService = new TakeAnswerService(),
    private quizService = new QuizService(),
    private quizQuestionService = new QuizQuestionService(),
  ) {}

  // View correct/incorrect statistics per question
  public async correctRateByQuestionId(
    quizQuestionId: string,
  ): Promise<string> {
    const correctTakeAnswers =
      await this.takeAnswerService.getCorrectTakeAnswersByQuestionId(
        quizQuestionId,
      );
    const takeAnswers = await this.takeAnswerService.getTakeAnswersByQuestionId(
      quizQuestionId,
    );

    return ((correctTakeAnswers.length / takeAnswers.length) * 100).toFixed(2);
  }

  // View time taken statistics per question
  public async averageTimeTakenByQuestionId(
    quizQuestionId: string,
  ): Promise<string> {
    const takeAnswers = await this.takeAnswerService.getTakeAnswersByQuestionId(
      quizQuestionId,
    );
    let totalTime = 0;
    for (let take of takeAnswers) {
      totalTime += take.timeTaken;
    }
    return (totalTime / takeAnswers.length).toFixed(2);
  }

  // View attempt analysis per question

  // View Spider Chart analysis for quiz attempt
  public async spiderChartAnalysis(
    quizId: string,
    takeId: string,
  ): Promise<{ subjArr: string[]; averageScoreArr: number[] }> {
    const quiz = await this.quizService.getQuizById(quizId);
    const topics = quiz.topics;
    const attempts = await this.takeAnswerService.getTakeAnswersByTakeId(
      takeId,
    );
    const map = new Map();
    for (let attempt of attempts) {
      const quizQuestion = await this.quizQuestionService.getQuizQuestionById(
        attempt.questionId,
      );
      for (let topic of quizQuestion.topics) {
        if (map.get(topic)) {
          const temp = map.get(topic).concat([attempt.isCorrect]);
          map.set(topic, temp);
        } else {
          map.set(topic, [attempt.isCorrect]);
        }
      }
    }
    const subjArr = [];
    const averageScoreArr = [];
    map.forEach((values, key) => {
      let sum = 0;
      const average = values.forEach((bool) => {
        if (bool) {
          sum++;
        }
      });
      averageScoreArr.push((sum / values.length) * 10);
      subjArr.push(key);
    });
    return { subjArr, averageScoreArr };
  }
}

export default new QuizStatisticsService();
