import { Prisma, PrismaClient, Quiz } from '@prisma/client';
import { QuizQuestionService } from './QuizQuestionService';

class QuizStatisticsService {
  constructor(private quizQuestionService = new QuizQuestionService()) {}
  // View correct/incorrect statistics per question
  public async correctRate(quizQuestionId: string): Promise<number> {
    const quizQuestion = await this.quizQuestionService.getQuizQuestionById(
      quizQuestionId,
    );
    console.log(quizQuestion);
    // console.log(quizQuestion.usedInTakes);
    // for (let take of quizQuestion.usedInTakes) {
    //   //
    // }
    return 0;
  }

  // View time taken statistics per question
  // View attempt analysis per question
  // View Spider Chart analysis for quiz attempt
  // View time management analysis for quiz attempt
}

export default new QuizStatisticsService();
