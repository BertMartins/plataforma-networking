"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function PresencasPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    membroId: "",
    data: "",
    status: "presente",
  });

  async function carregar() {
    const [pres, mem] = await Promise.all([
      fetch("/api/presencas").then((r) => r.json()),
      fetch("/api/membros").then((r) => r.json()),
    ]);

    setLista(pres);
    setMembros(mem);
  }

  useEffect(() => {
    carregar();
  }, []);

  function novo() {
    setEditing(null);
    setForm({
      membroId: "",
      data: "",
      status: "presente",
    });
    setOpenModal(true);
  }

  function editar(p: any) {
    setEditing(p);
    setForm({
      membroId: p.membroId,
      data: p.data.split("T")[0],
      status: p.status,
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Deseja excluir esta presença?")) return;

    await fetch(`/api/presencas/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    if (editing) {
      await fetch(`/api/presencas/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/presencas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setOpenModal(false);
    carregar();
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Presenças</h1>
          <button className="btn btn-primary" onClick={novo}>
            Nova Presença
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>Membro</th>
                <th>Data</th>
                <th>Status</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Nenhuma presença registrada
                  </td>
                </tr>
              ) : (
                lista.map((p) => (
                  <tr key={p.id}>
                    <td>{p.membro?.nome}</td>
                    <td>{new Date(p.data).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.status === "presente" ? "approved" : "rejected"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          className="action-btn edit"
                          onClick={() => editar(p)}
                        >
                          ✏️
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => excluir(p.id)}
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

        {openModal && (
          <div className="modal active">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editing ? "Editar Presença" : "Nova Presença"}
                </h2>
              </div>

              <form onSubmit={salvar}>
                {/* MEMBRO */}
                <div className="form-group">
                  <label className="form-label">Membro</label>
                  <select
                    name="membroId"
                    className="form-select"
                    value={form.membroId}
                    onChange={(e) =>
                      setForm({ ...form, membroId: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecione...</option>
                    {membros.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DATA */}
                <div className="form-group">
                  <label className="form-label">Data</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    required
                  />
                </div>

                {/* STATUS */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="presente">Presente</option>
                    <option value="falta">Falta</option>
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
                    Salvar
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
