-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Convite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "intencaoId" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Convite_intencaoId_fkey" FOREIGN KEY ("intencaoId") REFERENCES "Intencao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Convite" ("criadoEm", "id", "intencaoId", "token", "usado") SELECT "criadoEm", "id", "intencaoId", "token", "usado" FROM "Convite";
DROP TABLE "Convite";
ALTER TABLE "new_Convite" RENAME TO "Convite";
CREATE UNIQUE INDEX "Convite_token_key" ON "Convite"("token");
CREATE UNIQUE INDEX "Convite_intencaoId_key" ON "Convite"("intencaoId");
CREATE TABLE "new_Intencao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "empresa" TEXT,
    "cargo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criadoEm" DATETIME NOT NULL
);
INSERT INTO "new_Intencao" ("cargo", "criadoEm", "email", "empresa", "id", "nome", "status") SELECT "cargo", "criadoEm", "email", "empresa", "id", "nome", "status" FROM "Intencao";
DROP TABLE "Intencao";
ALTER TABLE "new_Intencao" RENAME TO "Intencao";
CREATE TABLE "new_Membro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "empresa" TEXT,
    "cargo" TEXT,
    "dataCadastro" DATETIME NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Membro" ("ativo", "cargo", "dataCadastro", "email", "empresa", "id", "nome") SELECT "ativo", "cargo", "dataCadastro", "email", "empresa", "id", "nome" FROM "Membro";
DROP TABLE "Membro";
ALTER TABLE "new_Membro" RENAME TO "Membro";
CREATE UNIQUE INDEX "Membro_email_key" ON "Membro"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
