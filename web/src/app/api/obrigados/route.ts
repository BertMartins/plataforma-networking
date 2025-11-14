import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const lista = await prisma.obrigado.findMany({
      orderBy: { criadoEm: "desc" },
      include: {
        membro: true,
      },
    });

    return new Response(JSON.stringify(lista), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const criado = await prisma.obrigado.create({
      data: {
        membroId: data.membroId,
        mensagem: data.mensagem,
      },
    });

    return new Response(JSON.stringify(criado), { status: 201 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
