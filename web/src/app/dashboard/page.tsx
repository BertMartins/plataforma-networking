"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    membros: 0,
    presencas: { presentes: 0, faltas: 0 },
    indicacoes: 0,
    mensalidades: 0,
    mensalidadesPendentes: 0,
  });

  useEffect(() => {
    async function load() {
      const [membrosRes, presencasRes, indicacoesRes, mensalidadesRes] =
        await Promise.all([
          fetch("/api/membros"),
          fetch("/api/presencas"),
          fetch("/api/indicacoes"),
          fetch("/api/mensalidades"),
        ]);

      const membros = await membrosRes.json();
      const presencas = await presencasRes.json();
      const indicacoes = await indicacoesRes.json();
      const mensalidades = await mensalidadesRes.json();

      const presentes = presencas.filter((p: any) => p.status === "presente").length;
      const faltas = presencas.filter((p: any) => p.status === "falta").length;

      const totalPago = mensalidades
        .filter((m: any) => m.status === "pago")
        .reduce((acc: number, m: any) => acc + m.valor, 0);

      const totalPendente = mensalidades
        .filter((m: any) => m.status === "pendente")
        .reduce((acc: number, m: any) => acc + m.valor, 0);

      setStats({
        membros: membros.length,
        presencas: { presentes, faltas },
        indicacoes: indicacoes.length,
        mensalidades: totalPago,
        mensalidadesPendentes: totalPendente,
      });
    }

    load();
  }, []);

  // --- GRÁFICO DE PRESENÇAS ---
  const presencaChart = {
    labels: ["Presentes", "Faltas"],
    datasets: [
      {
        data: [stats.presencas.presentes, stats.presencas.faltas],
        backgroundColor: ["#0066ff", "#ff5252"],
        borderWidth: 0,
      },
    ],
  };

  // --- GRÁFICO FINANCEIRO ---
  const financeiroChart = {
    labels: ["Pagas", "Pendentes"],
    datasets: [
      {
        data: [stats.mensalidades, stats.mensalidadesPendentes],
        backgroundColor: ["#00c853", "#ff9800"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <>
      <Sidebar />

      <div className="bg-pattern"></div>

      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Dashboard</h1>
        </div>

        {/* CARDS */}
        <div className="card-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Membros</span>
              <div className="stat-icon blue">👥</div>
            </div>
            <div className="stat-value">{stats.membros}</div>
            <span className="stat-change">Total</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Presenças</span>
              <div className="stat-icon green">📅</div>
            </div>
            <div className="stat-value">
              {stats.presencas.presentes + stats.presencas.faltas}
            </div>
            <span className="stat-change">Presentes x Faltas</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Indicações</span>
              <div className="stat-icon orange">🔗</div>
            </div>
            <div className="stat-value">{stats.indicacoes}</div>
            <span className="stat-change">Total</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Mensalidades Pagas</span>
              <div className="stat-icon cyan">💰</div>
            </div>
            <div className="stat-value">
              R$ {stats.mensalidades.toLocaleString("pt-BR")}
            </div>
            <span className="stat-change">No período</span>
          </div>
        </div>

        {/* GRÁFICOS RESPONSIVOS */}
        <div className="charts-grid">
          <div className="content-card">
            <h2 className="card-title">Presenças</h2>
            <div className="chart-wrapper">
              <Doughnut data={presencaChart} />
            </div>
          </div>

          <div className="content-card">
            <h2 className="card-title">Financeiro</h2>
            <div className="chart-wrapper">
              <Doughnut data={financeiroChart} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
