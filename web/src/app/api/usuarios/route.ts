import prisma from "@/lib/prisma";

export async function GET() {
  const lista = await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, role: true },
    orderBy: { nome: "asc" },
  });

  return Response.json(lista);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const criado = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha, // já deve vir hasheada se quiser
        role: data.role || "membro",
      },
    });

    return Response.json(criado, { status: 201 });
  } catch (e: any) {
    return Response.json({ erro: e.message }, { status: 500 });
  }
}
