import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  const { id } = await context.params;

  const mensalidade = await prisma.mensalidade.findUnique({
    where: { id },
    include: { membro: true },
  });

  return new Response(JSON.stringify(mensalidade), { status: 200 });
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const atualizada = await prisma.mensalidade.update({
      where: { id },
      data: {
        membroId: data.membroId,
        mes: Number(data.mes),
        ano: Number(data.ano),
        valor: Number(data.valor),
        vencimento: new Date(data.vencimento),
        status: data.status,
        pagoEm: data.status === "pago" ? new Date() : null,
      },
    });

    return new Response(JSON.stringify(atualizada), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;

    await prisma.mensalidade.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
