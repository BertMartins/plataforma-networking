// src/app/api/presencas/route.ts
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const presencas = await prisma.presenca.findMany({
      orderBy: { data: "desc" },
      include: { membro: true },
    });
    return new Response(JSON.stringify(presencas), { status: 200 });
  } catch (e: any) {
    console.error("GET /api/presencas error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // validações básicas
    if (!body.membroId) {
      return new Response(JSON.stringify({ erro: "membroId é obrigatório" }), { status: 400 });
    }
    if (!body.data) {
      return new Response(JSON.stringify({ erro: "data é obrigatória" }), { status: 400 });
    }

    // Garante que data está em formato compatível (ISO)
    const dataISO = new Date(body.data);
    if (isNaN(dataISO.getTime())) {
      return new Response(JSON.stringify({ erro: "data inválida" }), { status: 400 });
    }

    // opcional: checar se membro existe
    const membro = await prisma.membro.findUnique({ where: { id: body.membroId } });
    if (!membro) {
      return new Response(JSON.stringify({ erro: "Membro não encontrado" }), { status: 400 });
    }

    const criado = await prisma.presenca.create({
      data: {
        membroId: body.membroId,
        data: dataISO,
        status: body.status ?? "presente",
      },
    });

    return new Response(JSON.stringify(criado), { status: 201 });
  } catch (e: any) {
    console.error("POST /api/presencas error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
