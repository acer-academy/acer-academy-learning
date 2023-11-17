import { JwtPayload } from 'jsonwebtoken';

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type ElementOf<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementOf> ? ElementOf : never;
export type StudentJWTPayload = {
  id: string;
} & JwtPayload;
