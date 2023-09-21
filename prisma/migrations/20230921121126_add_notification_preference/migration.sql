-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" UUID NOT NULL,
    "isUnsubscribed" BOOLEAN NOT NULL,
    "subjectsPref" "SubjectEnum"[],
    "levelsPref" "LevelEnum"[],
    "teacherPref" TEXT[],
    "centrePref" TEXT[],
    "studentId" UUID NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_studentId_key" ON "NotificationPreference"("studentId");

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
