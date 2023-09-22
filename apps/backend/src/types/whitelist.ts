import { Prisma } from '@prisma/client';

const whitelistWithUser = Prisma.validator<Prisma.WhitelistItemDefaultArgs>()({
  include: { student: true, teacher: true, admin: true },
});

export type WhitelistWithUser = Prisma.WhitelistItemGetPayload<
  typeof whitelistWithUser
>;
