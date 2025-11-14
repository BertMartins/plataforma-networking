import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { nome, email, senha, role } = await req.json();

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hash, role: role ?? "membro" },
    });

    return NextResponse.json(usuario, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Erro ao registrar usuário" }, { status: 500 });
  }
}
