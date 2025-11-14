/*
  Warnings:

  - You are about to drop the column `criadoPor` on the `Aviso` table. All the data in the column will be lost.
  - Added the required column `criadoPorId` to the `Aviso` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'membro'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aviso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPorId" TEXT NOT NULL,
    CONSTRAINT "Aviso_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Aviso" ("criadoEm", "id", "mensagem", "titulo") SELECT "criadoEm", "id", "mensagem", "titulo" FROM "Aviso";
DROP TABLE "Aviso";
ALTER TABLE "new_Aviso" RENAME TO "Aviso";
CREATE INDEX "Aviso_criadoPorId_idx" ON "Aviso"("criadoPorId");
CREATE TABLE "new_Membro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "empresa" TEXT,
    "cargo" TEXT,
    "dataCadastro" DATETIME NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "usuarioId" TEXT,
    CONSTRAINT "Membro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Membro" ("ativo", "cargo", "dataCadastro", "email", "empresa", "id", "nome") SELECT "ativo", "cargo", "dataCadastro", "email", "empresa", "id", "nome" FROM "Membro";
DROP TABLE "Membro";
ALTER TABLE "new_Membro" RENAME TO "Membro";
CREATE UNIQUE INDEX "Membro_email_key" ON "Membro"("email");
CREATE UNIQUE INDEX "Membro_usuarioId_key" ON "Membro"("usuarioId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
