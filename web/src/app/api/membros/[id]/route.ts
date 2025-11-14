import prisma from "@/lib/prisma";


export async function GET(req: Request, context: any) {
  const { id } = await context.params;

  const membro = await prisma.membro.findUnique({
    where: { id },
  });

  return new Response(JSON.stringify(membro), { status: 200 });
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params; 
    const data = await req.json();

    const atualizado = await prisma.membro.update({
      where: { id },
      data,
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

    await prisma.membro.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
