-- CreateTable
CREATE TABLE "Presenca" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "membroId" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'presente',
    CONSTRAINT "Presenca_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Aviso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Indicacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deMembroId" TEXT NOT NULL,
    "paraMembroId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Indicacao_deMembroId_fkey" FOREIGN KEY ("deMembroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Indicacao_paraMembroId_fkey" FOREIGN KEY ("paraMembroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Obrigado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "membroId" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Obrigado_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reuniao1a1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deId" TEXT NOT NULL,
    "paraId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "observacoes" TEXT,
    CONSTRAINT "Reuniao1a1_deId_fkey" FOREIGN KEY ("deId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reuniao1a1_paraId_fkey" FOREIGN KEY ("paraId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mensalidade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "membroId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "vencimento" DATETIME NOT NULL,
    "pagoEm" DATETIME,
    CONSTRAINT "Mensalidade_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Presenca_membroId_idx" ON "Presenca"("membroId");

-- CreateIndex
CREATE INDEX "Indicacao_deMembroId_idx" ON "Indicacao"("deMembroId");

-- CreateIndex
CREATE INDEX "Indicacao_paraMembroId_idx" ON "Indicacao"("paraMembroId");

-- CreateIndex
CREATE INDEX "Obrigado_membroId_idx" ON "Obrigado"("membroId");

-- CreateIndex
CREATE INDEX "Reuniao1a1_deId_idx" ON "Reuniao1a1"("deId");

-- CreateIndex
CREATE INDEX "Reuniao1a1_paraId_idx" ON "Reuniao1a1"("paraId");

-- CreateIndex
CREATE INDEX "Mensalidade_membroId_idx" ON "Mensalidade"("membroId");

-- CreateIndex
CREATE UNIQUE INDEX "Mensalidade_membroId_mes_ano_key" ON "Mensalidade"("membroId", "mes", "ano");
