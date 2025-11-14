"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function ReunioesPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    deId: "",
    paraId: "",
    data: "",
    observacoes: "",
  });

  async function carregar() {
    const [reu, mem] = await Promise.all([
      fetch("/api/reunioes").then((r) => r.json()),
      fetch("/api/membros").then((r) => r.json()),
    ]);

    setLista(reu);
    setMembros(mem);
  }

  useEffect(() => {
    carregar();
  }, []);

  function novo() {
    setEditing(null);
    setForm({
      deId: "",
      paraId: "",
      data: "",
      observacoes: "",
    });
    setOpenModal(true);
  }

  function editar(r: any) {
    setEditing(r);
    setForm({
      deId: r.deId,
      paraId: r.paraId,
      data: r.data.split("T")[0],
      observacoes: r.observacoes || "",
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir reunião?")) return;

    await fetch(`/api/reunioes/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    if (editing) {
      await fetch(`/api/reunioes/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/reunioes", {
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
          <h1 className="page-title">Reuniões 1 a 1</h1>
          <button className="btn btn-primary" onClick={novo}>
            Nova Reunião
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>De</th>
                <th>Para</th>
                <th>Data</th>
                <th>Observações</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Nenhuma reunião registrada
                  </td>
                </tr>
              ) : (
                lista.map((r) => (
                  <tr key={r.id}>
                    <td>{r.de?.nome}</td>
                    <td>{r.para?.nome}</td>
                    <td>{new Date(r.data).toLocaleDateString()}</td>
                    <td>{r.observacoes || "-"}</td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          className="action-btn edit"
                          onClick={() => editar(r)}
                        >
                          ✏️
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => excluir(r.id)}
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
              <h2 className="modal-title">
                {editing ? "Editar Reunião" : "Nova Reunião"}
              </h2>

              <form onSubmit={salvar}>
                {/* DE MEMBRO */}
                <div className="form-group">
                  <label className="form-label">De (quem convidou)</label>
                  <select
                    className="form-select modern"
                    value={form.deId}
                    onChange={(e) =>
                      setForm({ ...form, deId: e.target.value })
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

                {/* PARA MEMBRO */}
                <div className="form-group">
                  <label className="form-label">Para</label>
                  <select
                    className="form-select modern"
                    value={form.paraId}
                    onChange={(e) =>
                      setForm({ ...form, paraId: e.target.value })
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
                    onChange={(e) =>
                      setForm({ ...form, data: e.target.value })
                    }
                    required
                  />
                </div>

                {/* OBS */}
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={form.observacoes}
                    onChange={(e) =>
                      setForm({ ...form, observacoes: e.target.value })
                    }
                  />
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
