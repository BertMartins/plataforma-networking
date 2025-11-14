import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const item = await prisma.intencao.findUnique({ where: { id }, include: { convite: true } });
    return new Response(JSON.stringify(item), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    // Somente campos permitidos
    const payload: any = {};
    if (data.nome !== undefined) payload.nome = data.nome;
    if (data.email !== undefined) payload.email = data.email;
    if (data.empresa !== undefined) payload.empresa = data.empresa;
    if (data.cargo !== undefined) payload.cargo = data.cargo;
    if (data.status !== undefined) payload.status = data.status;

    const atualizado = await prisma.intencao.update({
      where: { id },
      data: payload,
    });

    return new Response(JSON.stringify(atualizado), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;
    await prisma.intencao.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
