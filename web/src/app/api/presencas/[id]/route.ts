// src/app/api/presencas/[id]/route.ts
import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  const { id } = await context.params;
  const p = await prisma.presenca.findUnique({ where: { id }, include: { membro: true } });
  return new Response(JSON.stringify(p), { status: 200 });
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    if (data.data) {
      data.data = new Date(data.data);
    }

    const atualizado = await prisma.presenca.update({
      where: { id },
      data,
    });

    return new Response(JSON.stringify(atualizado), { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/presencas/[id] error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;
    await prisma.presenca.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (e: any) {
    console.error("DELETE /api/presencas/[id] error:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
