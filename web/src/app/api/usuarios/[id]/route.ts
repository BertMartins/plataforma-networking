import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // usa o prisma global ✨

// GET /api/usuarios/:id
export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params; // <- obrigatório agora

    const user = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Erro ao buscar usuário" }, { status: 500 });
  }
}

// PUT /api/usuarios/:id
export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params; // <- ajuste
    const body = await req.json();

    const update = await prisma.usuario.update({
      where: { id },
      data: {
        nome: body.nome,
        email: body.email,
        role: body.role,
      },
    });

    return NextResponse.json(update);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

// DELETE /api/usuarios/:id
export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params; // <- ajuste

    await prisma.usuario.delete({
      where: { id },
    });

    return NextResponse.json({ mensagem: "Usuário removido" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Erro ao remover usuário" }, { status: 500 });
  }
}
