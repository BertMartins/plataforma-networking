import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  const { id } = await context.params;

  const convite = await prisma.convite.findUnique({
    where: { id },
    include: { intencao: true },
  });

  return new Response(JSON.stringify(convite), { status: 200 });
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const atualizado = await prisma.convite.update({
      where: { id },
      data,
    });

    return new Response(JSON.stringify(atualizado), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;

    await prisma.convite.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
