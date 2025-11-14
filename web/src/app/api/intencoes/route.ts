import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.intencao.findMany({
      orderBy: { criadoEm: "desc" },
      include: { convite: true },
    });
    return new Response(JSON.stringify(list), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nome, email, empresa, cargo } = await req.json();

    const existente = await prisma.intencao.findUnique({ where: { email } });
    if (existente) {
      return new Response(JSON.stringify({ erro: "Intenção com esse email já existe" }), { status: 400 });
    }

    const criado = await prisma.intencao.create({
      data: {
        nome,
        email,
        empresa: empresa ?? null,
        cargo: cargo ?? null,
        status: "pendente",
        criadoEm: new Date(),
      },
    });

    return new Response(JSON.stringify(criado), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), { status: 500 });
  }
}
