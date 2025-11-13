import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDateTimeBrasil } from "@/utils/dateUtils";

const prisma = new PrismaClient();

// GET /api/intencoes -> lista todas as intenções (com filtro, data e paginação)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const nome = searchParams.get("nome")?.toLowerCase();
    const email = searchParams.get("email")?.toLowerCase();
    const empresa = searchParams.get("empresa")?.toLowerCase();
    const cargo = searchParams.get("cargo")?.toLowerCase();
    const status = searchParams.get("status");
    const dataInicio = searchParams.get("dataInicio");
    const dataFim = searchParams.get("dataFim");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Busca todas as intenções
    const todas = await prisma.intencao.findMany({
      orderBy: { criadoEm: "desc" },
    });

    // Filtro manual para contornar limitações do SQLite
    const listaFiltrada = todas.filter(
      (item: typeof todas[number]) => {
        const criadoEm = new Date(item.criadoEm);
        const dataOk =
          (!dataInicio || criadoEm >= new Date(dataInicio)) &&
          (!dataFim || criadoEm <= new Date(dataFim));

        return (
          (!nome || item.nome.toLowerCase().includes(nome)) &&
          (!email || item.email.toLowerCase().includes(email)) &&
          (!empresa || (item.empresa?.toLowerCase().includes(empresa))) &&
          (!cargo || (item.cargo?.toLowerCase().includes(cargo))) &&
          (!status || item.status === status) &&
          dataOk
        );
      }
    );

    const total = listaFiltrada.length;
    const totalPaginas = Math.ceil(total / limit);
    const resultados = listaFiltrada.slice(skip, skip + limit);

    return NextResponse.json(
      {
        total,
        paginaAtual: page,
        totalPaginas,
        resultados,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao listar intenções:", error);
    return NextResponse.json(
      { erro: "Erro ao listar intenções" },
      { status: 500 }
    );
  }
}


// POST /api/intencoes -> cria uma nova intenção
export async function POST(request: Request) {
  try {
    const { nome, email, empresa, cargo } = await request.json();

    if (!nome || !email) {
      return NextResponse.json(
        { erro: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    const intencao = await prisma.intencao.create({
      data: {
        nome,
        email,
        empresa,
        cargo,
        criadoEm: getDateTimeBrasil(),
      },
    });

    return NextResponse.json(intencao, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { erro: "Erro ao criar intenção" },
      { status: 500 }
    );
  }
}

// DELETE /api/intencoes -> exclui TODAS as intenções
export async function DELETE() {
  try {
    const resultado = await prisma.intencao.deleteMany({});

    return NextResponse.json(
      {
        mensagem: `Foram removidas ${resultado.count} intenções.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { erro: "Erro ao excluir intenções" },
      { status: 500 }
    );
  }
}
