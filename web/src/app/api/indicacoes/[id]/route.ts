import prisma from "@/lib/prisma";

// ========================================================
// 🔹 GET /api/indicacoes/:id
// ========================================================
export async function GET(req: Request, context: any) {
  const { id } = await context.params; // mesmo padrão do membros

  const indicacao = await prisma.indicacao.findUnique({
    where: { id },
    include: {
      deMembro: true,
      paraMembro: true,
    },
  });

  return new Response(JSON.stringify(indicacao), { status: 200 });
}

// ========================================================
// 🔹 PUT /api/indicacoes/:id
// ========================================================
export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params; // funciona!
    const data = await req.json();

    const atualizado = await prisma.indicacao.update({
      where: { id },
      data,
    });

    return new Response(JSON.stringify(atualizado), { status: 200 });
  } catch (e: any) {
    console.error("ERRO NO UPDATE INDICAÇÃO:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

// ========================================================
// 🔹 DELETE /api/indicacoes/:id
// ========================================================
export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params; // funciona!

    await prisma.indicacao.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    console.error("ERRO NO DELETE INDICAÇÃO:", e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
