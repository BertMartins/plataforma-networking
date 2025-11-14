import prisma from "@/lib/prisma";

export async function GET() {
  const convites = await prisma.convite.findMany({
    orderBy: { criadoEm: "desc" },
    include: { intencao: true },
  });

  return new Response(JSON.stringify(convites), { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { intencaoId } = await req.json();

    const token = crypto.randomUUID();

    const convite = await prisma.convite.create({
      data: {
        intencaoId,
        token,
        criadoEm: new Date(),
      },
    });

    return new Response(JSON.stringify(convite), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ erro: e.message }), {
      status: 500,
    });
  }
}
