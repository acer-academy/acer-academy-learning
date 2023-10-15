-- CreateTable
CREATE TABLE "Quiz" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subject" "SubjectEnum" NOT NULL,
    "levels" "LevelEnum"[],
    "difficulty" "QuizQuestionDifficultyEnum" NOT NULL,
    "topics" "QuizQuestionTopicEnum"[],
    "totalMarks" INTEGER NOT NULL,
    "rewardPoints" INTEGER NOT NULL,
    "rewardMinimumMarks" INTEGER NOT NULL,
    "timeAllowed" INTEGER NOT NULL,
    "teacherCreatedId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizOnQuizQuestions" (
    "quizQuestionId" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "quizQuestionIndex" INTEGER NOT NULL,
    "quizQuestionMarks" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "QuizOnQuizQuestions_pkey" PRIMARY KEY ("quizId","quizQuestionId")
);

-- CreateTable
CREATE TABLE "Take" (
    "id" UUID NOT NULL,
    "marks" INTEGER NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeTaken" INTEGER NOT NULL,
    "takenById" UUID NOT NULL,
    "quizId" UUID NOT NULL,

    CONSTRAINT "Take_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TakeAnswer" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "studentAnswer" TEXT NOT NULL,
    "takeId" UUID NOT NULL,

    CONSTRAINT "TakeAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuizToStudent" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuizToStudent_AB_unique" ON "_QuizToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_QuizToStudent_B_index" ON "_QuizToStudent"("B");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_teacherCreatedId_fkey" FOREIGN KEY ("teacherCreatedId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizOnQuizQuestions" ADD CONSTRAINT "QuizOnQuizQuestions_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizOnQuizQuestions" ADD CONSTRAINT "QuizOnQuizQuestions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Take" ADD CONSTRAINT "Take_takenById_fkey" FOREIGN KEY ("takenById") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Take" ADD CONSTRAINT "Take_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TakeAnswer" ADD CONSTRAINT "TakeAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TakeAnswer" ADD CONSTRAINT "TakeAnswer_takeId_fkey" FOREIGN KEY ("takeId") REFERENCES "Take"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizToStudent" ADD CONSTRAINT "_QuizToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizToStudent" ADD CONSTRAINT "_QuizToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
