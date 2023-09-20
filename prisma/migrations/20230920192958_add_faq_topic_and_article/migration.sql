-- CreateTable
CREATE TABLE "FaqTopic" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "FaqTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqArticle" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "faqTopicId" UUID NOT NULL,

    CONSTRAINT "FaqArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FaqTopic_title_key" ON "FaqTopic"("title");

-- AddForeignKey
ALTER TABLE "FaqArticle" ADD CONSTRAINT "FaqArticle_faqTopicId_fkey" FOREIGN KEY ("faqTopicId") REFERENCES "FaqTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
