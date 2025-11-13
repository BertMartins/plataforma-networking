import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDateTimeBrasil } from "@/utils/dateUtils";

const prisma = new PrismaClient();

// PUT /api/intencoes/[id] -> atualiza uma intenção
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const { nome, email, empresa, cargo, status } = data;

    const intencaoAtualizada = await prisma.intencao.update({
      where: { id },
      data: {
        nome,
        email,
        empresa,
        cargo,
        status,
      },
    });

    return NextResponse.json(intencaoAtualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { erro: "Erro ao atualizar intenção" },
      { status: 500 }
    );
  }
}

// DELETE /api/intencoes/[id] -> exclui uma intenção
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const intencao = await prisma.intencao.findUnique({
      where: { id },
    });

    if (!intencao) {
      return NextResponse.json(
        { erro: "Intenção não encontrada" },
        { status: 404 }
      );
    }

    await prisma.intencao.delete({
      where: { id },
    });

    return NextResponse.json(
      { mensagem: "Intenção removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { erro: "Erro ao excluir intenção" },
      { status: 500 }
    );
  }
}
