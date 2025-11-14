import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params;

    const aviso = await prisma.aviso.findUnique({
      where: { id },
      include: {
        criadoPor: {
          select: { id: true, nome: true, email: true },
        },
      },
    });

    if (!aviso) {
      return new Response(JSON.stringify({ erro: "Aviso não encontrado" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(aviso), { status: 200 });
  } catch (e: any) {
    console.error("GET /api/avisos/[id] error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const atualizado = await prisma.aviso.update({
      where: { id },
      data,
      include: {
        criadoPor: {
          select: { id: true, nome: true, email: true },
        },
      },
    });

    return new Response(JSON.stringify(atualizado), { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/avisos/[id] error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;

    await prisma.aviso.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    console.error("DELETE /api/avisos/[id] error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
