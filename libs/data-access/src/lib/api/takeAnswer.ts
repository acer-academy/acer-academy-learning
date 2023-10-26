import { TakeAnswerData } from '../types/takeAnswer';
import client from './client';
import { Axios, AxiosResponse } from 'axios';

const URL = '/take-answers';

export async function getTakeAnswersByTakeAndQuizQuestion(
  questionId: string,
  takeId: string,
): Promise<AxiosResponse<TakeAnswerData[]>> {
  return client.get(`${URL}/questionAndTake/${questionId}/${takeId}`);
}
