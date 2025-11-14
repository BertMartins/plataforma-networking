import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const reunioes = await prisma.reuniao1a1.findMany({
      orderBy: { data: "desc" },
      include: {
        de: { select: { id: true, nome: true, email: true } },
        para: { select: { id: true, nome: true, email: true } },
      },
    });

    return new Response(JSON.stringify(reunioes), { status: 200 });
  } catch (e: any) {
    console.error("GET /api/reunioes error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deId, paraId, data, observacoes } = body;

    if (!deId || !paraId || !data) {
      return new Response(JSON.stringify({ erro: "Campos obrigatórios faltando" }), { status: 400 });
    }

    const created = await prisma.reuniao1a1.create({
      data: {
        deId,
        paraId,
        data: new Date(data),
        observacoes: observacoes ?? null,
      },
      include: {
        de: { select: { id: true, nome: true, email: true } },
        para: { select: { id: true, nome: true, email: true } },
      },
    });

    return new Response(JSON.stringify(created), { status: 201 });
  } catch (e: any) {
    console.error("POST /api/reunioes error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
