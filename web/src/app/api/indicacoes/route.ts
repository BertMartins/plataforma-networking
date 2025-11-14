import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const indicacoes = await prisma.indicacao.findMany({
    include: {
      deMembro: true,
      paraMembro: true,
    },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(indicacoes);
}

export async function POST(req: Request) {
  const data = await req.json();

  const nova = await prisma.indicacao.create({
    data: {
      deMembroId: data.deMembroId,
      paraMembroId: data.paraMembroId,
      descricao: data.descricao,
    },
  });

  return NextResponse.json(nova, { status: 201 });
}
