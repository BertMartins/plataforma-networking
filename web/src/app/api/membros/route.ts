import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todos os membros
export async function GET() {
  try {
    const membros = await prisma.membro.findMany({
      orderBy: { nome: "asc" },
    });

    return NextResponse.json(membros);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { erro: "Erro ao listar membros" },
      { status: 500 }
    );
  }
}

// POST - Cria novo membro
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const novo = await prisma.membro.create({
      data: {
        nome: data.nome,
        email: data.email,
        empresa: data.empresa ?? null,
        cargo: data.cargo ?? null,
        dataCadastro: new Date(),
      },
    });

    return NextResponse.json(novo, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { erro: "Erro ao criar membro" },
      { status: 500 }
    );
  }
}
