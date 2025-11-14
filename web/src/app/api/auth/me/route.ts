import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ erro: "Token inválido" }, { status: 401 });

  const usuario = await prisma.usuario.findUnique({
    where: { id: decoded.id },
    select: { id: true, nome: true, email: true, role: true },
  });

  return NextResponse.json(usuario);
}
