"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function ObrigadosPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    membroId: "",
    mensagem: "",
  });

  async function carregar() {
    const [obrigados, mem] = await Promise.all([
      fetch("/api/obrigados").then((r) => r.json()),
      fetch("/api/membros").then((r) => r.json()),
    ]);

    setLista(obrigados);
    setMembros(mem);
  }

  useEffect(() => {
    carregar();
  }, []);

  function novo() {
    setEditing(null);
    setForm({
      membroId: "",
      mensagem: "",
    });
    setOpenModal(true);
  }

  function editar(o: any) {
    setEditing(o);
    setForm({
      membroId: o.membroId,
      mensagem: o.mensagem,
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Deseja excluir este agradecimento?")) return;

    await fetch(`/api/obrigados/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    if (editing) {
      await fetch(`/api/obrigados/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/obrigados", {
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
        {/* HEADER */}
        <div className="header">
          <h1 className="page-title">Obrigados</h1>
          <button className="btn btn-primary" onClick={novo}>
            Novo Obrigado
          </button>
        </div>

        {/* TABELA */}
        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>Membro</th>
                <th>Mensagem</th>
                <th>Data</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Nenhum agradecimento registrado
                  </td>
                </tr>
              ) : (
                lista.map((o) => (
                  <tr key={o.id}>
                    <td>{o.membro?.nome}</td>
                    <td>{o.mensagem}</td>
                    <td>{new Date(o.criadoEm).toLocaleDateString("pt-BR")}</td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          className="action-btn edit"
                          onClick={() => editar(o)}
                        >
                          ✏️
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => excluir(o.id)}
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
                  {editing ? "Editar Obrigado" : "Novo Obrigado"}
                </h2>
              </div>

              <form onSubmit={salvar}>
                {/* MEMBRO */}
                <div className="form-group">
                  <label className="form-label">Membro</label>
                  <select
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

                {/* MENSAGEM */}
                <div className="form-group">
                  <label className="form-label">Mensagem</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={form.mensagem}
                    onChange={(e) =>
                      setForm({ ...form, mensagem: e.target.value })
                    }
                    required
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
