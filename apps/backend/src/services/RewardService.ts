import { QuizService } from './QuizService';
import { Prisma, Reward, Take } from '@prisma/client';
import { RewardDao } from '../dao/RewardDao';
import { TakeService } from './TakeService';

export class RewardService {
  constructor(
    private rewardDao = new RewardDao(),
    private takeService: TakeService = new TakeService(),
    private quizService: QuizService = new QuizService(),
  ) {}

  public async createReward(
    rewardData: Prisma.RewardUncheckedCreateInput,
  ): Promise<Reward> {
    return this.rewardDao.createReward(rewardData);
  }

  private async findHighestMarksPerQuiz(
    takes: Take[],
  ): Promise<{ [quizId: string]: number }> {
    const highestMarksPerQuiz: { [quizId: string]: number } = {};

    for (const take of takes) {
      const { marks, quizId } = take;

      if (
        !(quizId in highestMarksPerQuiz) ||
        marks > highestMarksPerQuiz[quizId]
      ) {
        highestMarksPerQuiz[quizId] = marks;
      }
    }

    return highestMarksPerQuiz;
  }

  public async getRewardPointsByStudentId(studentId: string): Promise<number> {
    const takes = await this.takeService.getTakesByStudent(studentId);
    const highestMarksPerQuiz = await this.findHighestMarksPerQuiz(takes);

    let totalRewardPoints = 0;

    for (const [quizId, marks] of Object.entries(highestMarksPerQuiz)) {
      const quiz = await this.quizService.getQuizById(quizId);
      if (marks >= quiz.rewardMinimumMarks) {
        totalRewardPoints += quiz.rewardPoints;
      }
    }

    return totalRewardPoints;
  }

  public async getAllRewards(): Promise<Reward[]> {
    return this.rewardDao.getAllRewards();
  }

  public async getActiveRewards(): Promise<Reward[]> {
    return this.rewardDao.getActiveRewards();
  }

  public async getRewardById(rewardId: string): Promise<Reward> {
    return this.rewardDao.getRewardById(rewardId);
  }

  public async updateReward(
    rewardId: string,
    rewardData: Prisma.RewardUncheckedUpdateInput,
  ): Promise<Reward> {
    return this.rewardDao.updateReward(rewardId, rewardData);
  }

  public async deleteReward(rewardId: string): Promise<Reward> {
    return this.rewardDao.deleteReward(rewardId);
  }
}
