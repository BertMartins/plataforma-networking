import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params;

    const item = await prisma.obrigado.findUnique({
      where: { id },
      include: { membro: true },
    });

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const atualizado = await prisma.obrigado.update({
      where: { id },
      data: {
        membroId: data.membroId,
        mensagem: data.mensagem,
      },
    });

    return new Response(JSON.stringify(atualizado), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;

    await prisma.obrigado.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
