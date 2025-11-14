import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const lista = await prisma.mensalidade.findMany({
      orderBy: [
        { ano: "desc" },
        { mes: "desc" },
      ],
      include: { membro: true },
    });

    return new Response(JSON.stringify(lista), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { membroId, mes, ano, valor, vencimento } = body;

    if (!membroId) return Response.json({ erro: "membroId obrigatório" }, { status: 400 });
    if (!mes) return Response.json({ erro: "mes obrigatório" }, { status: 400 });
    if (!ano) return Response.json({ erro: "ano obrigatório" }, { status: 400 });
    if (!valor) return Response.json({ erro: "valor obrigatório" }, { status: 400 });
    if (!vencimento) return Response.json({ erro: "vencimento obrigatório" }, { status: 400 });

    const criado = await prisma.mensalidade.create({
      data: {
        membroId,
        mes: Number(mes),
        ano: Number(ano),
        valor: Number(valor),
        vencimento: new Date(vencimento),
        status: body.status ?? "pendente",
        pagoEm: body.status === "pago" ? new Date() : null,
      },
    });

    return new Response(JSON.stringify(criado), { status: 201 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
