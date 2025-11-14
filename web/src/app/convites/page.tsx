"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function ConvitesPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [intencoes, setIntencoes] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    intencaoId: "",
  });

  async function carregar() {
    const [conv, intents] = await Promise.all([
      fetch("/api/convites").then((r) => r.json()),
      fetch("/api/intencoes").then((r) => r.json()),
    ]);

    setLista(conv);
    setIntencoes(intents.filter((i: any) => !i.convite)); // só intenções sem convite
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e: any) {
    e.preventDefault();

    await fetch("/api/convites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpenModal(false);
    carregar();
  }

  async function excluir(id: string) {
    if (!confirm("Deseja excluir este convite?")) return;

    await fetch(`/api/convites/${id}`, { method: "DELETE" });
    carregar();
  }

  function novo() {
    setForm({ intencaoId: "" });
    setOpenModal(true);
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Convites</h1>
          <button className="btn btn-primary" onClick={novo}>
            Novo Convite
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Token</th>
                <th>Status</th>
                <th>Criado em</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Nenhum convite encontrado
                  </td>
                </tr>
              ) : (
                lista.map((c) => (
                  <tr key={c.id}>
                    <td>{c.intencao?.nome}</td>
                    <td>{c.intencao?.email}</td>
                    <td>{c.token}</td>

                    <td>
                      <span
                        className={`badge ${
                          c.usado ? "approved" : "pending"
                        }`}
                      >
                        {c.usado ? "Usado" : "Pendente"}
                      </span>
                    </td>

                    <td>
                      {new Date(c.criadoEm).toLocaleDateString("pt-BR")}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          className="action-btn delete"
                          onClick={() => excluir(c.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {openModal && (
          <div className="modal active">
            <div className="modal-content">
              <h2 className="modal-title">Novo Convite</h2>

              <form onSubmit={salvar}>
                <div className="form-group">
                  <label className="form-label">Intenção</label>
                  <select
                    className="form-select modern-select"
                    value={form.intencaoId}
                    onChange={(e) =>
                      setForm({ ...form, intencaoId: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecione...</option>
                    {intencoes.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nome} — {i.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancelar
                  </button>

                  <button className="btn btn-primary" type="submit">
                    Gerar Convite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
