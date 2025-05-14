-- AlterTable
ALTER TABLE "Major" ADD COLUMN     "showResultOrTimeUp" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "agendaUrl" TEXT NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);
