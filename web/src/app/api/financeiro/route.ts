import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const lista = await prisma.financeiro.findMany({
      orderBy: { data: "desc" }
    });

    return new Response(JSON.stringify(lista), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const criado = await prisma.financeiro.create({
      data: {
        tipo: data.tipo,
        descricao: data.descricao,
        valor: Number(data.valor),
        data: new Date(data.data),
      },
    });

    return new Response(JSON.stringify(criado), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
