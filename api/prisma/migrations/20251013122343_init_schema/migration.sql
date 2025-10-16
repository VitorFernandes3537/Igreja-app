/*
  Warnings:

  - You are about to drop the column `Atualizado_em` on the `igreja` table. All the data in the column will be lost.
  - You are about to drop the column `Atualizado_em` on the `membro` table. All the data in the column will be lost.
  - You are about to drop the column `Telefone` on the `membro` table. All the data in the column will be lost.
  - Added the required column `atualizado_em` to the `igreja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `membro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `membro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `igreja` DROP COLUMN `Atualizado_em`,
    ADD COLUMN `atualizado_em` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `membro` DROP COLUMN `Atualizado_em`,
    DROP COLUMN `Telefone`,
    ADD COLUMN `atualizado_em` DATETIME(3) NOT NULL,
    ADD COLUMN `telefone` VARCHAR(191) NOT NULL;
