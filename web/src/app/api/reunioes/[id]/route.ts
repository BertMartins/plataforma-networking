import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const reuniao = await prisma.reuniao1a1.findUnique({
      where: { id },
      include: {
        de: { select: { id: true, nome: true, email: true } },
        para: { select: { id: true, nome: true, email: true } },
      },
    });

    if (!reuniao) return new Response(JSON.stringify({ erro: "Não encontrado" }), { status: 404 });
    return new Response(JSON.stringify(reuniao), { status: 200 });
  } catch (e: any) {
    console.error("GET /api/reunioes/[id] error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    // sanitize/transform
    const payload: any = {};
    if (data.deId) payload.deId = data.deId;
    if (data.paraId) payload.paraId = data.paraId;
    if (data.data) payload.data = new Date(data.data);
    if (data.observacoes !== undefined) payload.observacoes = data.observacoes;

    const atualizado = await prisma.reuniao1a1.update({
      where: { id },
      data: payload,
      include: {
        de: { select: { id: true, nome: true, email: true } },
        para: { select: { id: true, nome: true, email: true } },
      },
    });

    return new Response(JSON.stringify(atualizado), { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/reunioes/[id] error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;

    await prisma.reuniao1a1.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    console.error("DELETE /api/reunioes/[id] error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
