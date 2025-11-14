import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params;

    const item = await prisma.financeiro.findUnique({ where: { id } });

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const atualizado = await prisma.financeiro.update({
      where: { id },
      data: {
        tipo: data.tipo,
        descricao: data.descricao,
        valor: Number(data.valor),
        data: new Date(data.data),
      },
    });

    return new Response(JSON.stringify(atualizado), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;

    await prisma.financeiro.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
