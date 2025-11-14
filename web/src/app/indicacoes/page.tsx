"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState<any[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    deMembroId: "",
    paraMembroId: "",
    descricao: "",
  });

  async function carregar() {
    const [indRes, memRes] = await Promise.all([
      fetch("/api/indicacoes"),
      fetch("/api/membros"),
    ]);

    setIndicacoes(await indRes.json());
    setMembros(await memRes.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function novo() {
    setEditing(null);
    setForm({ deMembroId: "", paraMembroId: "", descricao: "" });
    setOpenModal(true);
  }

  function editar(ind: any) {
    setEditing(ind);
    setForm({
      deMembroId: ind.deMembroId,
      paraMembroId: ind.paraMembroId,
      descricao: ind.descricao,
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta indicação?")) return;

    await fetch(`/api/indicacoes/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    const endpoint = editing
      ? `/api/indicacoes/${editing.id}`
      : "/api/indicacoes";

    const method = editing ? "PUT" : "POST";

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpenModal(false);
    carregar();
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Indicações</h1>
          <button className="btn btn-primary" onClick={novo}>
            Nova Indicação
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>De</th>
                <th>Para</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {indicacoes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Nenhuma indicação cadastrada
                  </td>
                </tr>
              ) : (
                indicacoes.map((i) => (
                  <tr key={i.id}>
                    <td>{i.deMembro?.nome}</td>
                    <td>{i.paraMembro?.nome}</td>
                    <td>{i.descricao}</td>

                    <td>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          className="action-btn edit"
                          onClick={() => editar(i)}
                        >
                          ✏️
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => excluir(i.id)}
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
              <div className="modal-header">
                <h2 className="modal-title">
                  {editing ? "Editar Indicação" : "Nova Indicação"}
                </h2>
              </div>

              <form onSubmit={salvar}>
                {/* De */}
                <div className="form-group">
                  <label className="form-label">De</label>
                  <select
                    name="deMembroId"
                    className="form-select"
                    value={form.deMembroId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione</option>
                    {membros.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Para */}
                <div className="form-group">
                  <label className="form-label">Para</label>
                  <select
                    name="paraMembroId"
                    className="form-select"
                    value={form.paraMembroId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione</option>
                    {membros.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <textarea
                    name="descricao"
                    className="form-input"
                    value={form.descricao}
                    onChange={handleChange}
                    required
                  ></textarea>
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
                    {editing ? "Atualizar" : "Salvar"}
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
