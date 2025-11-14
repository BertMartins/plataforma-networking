import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const avisos = await prisma.aviso.findMany({
      orderBy: { criadoEm: "desc" },
      include: {
        criadoPor: {
          select: { id: true, nome: true, email: true },
        },
      },
    });

    return new Response(JSON.stringify(avisos), { status: 200 });
  } catch (e: any) {
    console.error("GET /api/avisos error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, mensagem, criadoPorId } = body;

    if (!titulo || !mensagem || !criadoPorId) {
      return new Response(JSON.stringify({ erro: "Campos obrigatórios faltando" }), {
        status: 400,
      });
    }

    const created = await prisma.aviso.create({
      data: {
        titulo,
        mensagem,
        criadoEm: new Date(),
        criadoPorId,
      },
      include: {
        criadoPor: { select: { id: true, nome: true, email: true } },
      },
    });

    return new Response(JSON.stringify(created), { status: 201 });
  } catch (e: any) {
    console.error("POST /api/avisos error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
