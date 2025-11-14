"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AvisosPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    titulo: "",
    mensagem: "",
    criadoPorId: "",
  });

  async function carregar() {
    const [avisos, users] = await Promise.all([
      fetch("/api/avisos").then((r) => r.json()),
      fetch("/api/usuarios").then((r) => r.json()),
    ]);

    setLista(avisos);
    setUsuarios(users);
  }

  useEffect(() => {
    carregar();
  }, []);

  function novo() {
    setEditing(null);
    setForm({
      titulo: "",
      mensagem: "",
      criadoPorId: "",
    });
    setOpenModal(true);
  }

  function editar(a: any) {
    setEditing(a);
    setForm({
      titulo: a.titulo,
      mensagem: a.mensagem,
      criadoPorId: a.criadoPorId,
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Deseja excluir este aviso?")) return;

    await fetch(`/api/avisos/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    if (editing) {
      // UPDATE
      await fetch(`/api/avisos/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // CREATE
      await fetch("/api/avisos", {
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
          <h1 className="page-title">Avisos</h1>
          <button className="btn btn-primary" onClick={novo}>
            Novo Aviso
          </button>
        </div>

        {/* TABELA */}
        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>Título</th>
                <th>Criado Por</th>
                <th>Data</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Nenhum aviso publicado
                  </td>
                </tr>
              ) : (
                lista.map((a) => (
                  <tr key={a.id}>
                    <td>{a.titulo}</td>
                    <td>{a.criadoPor?.nome}</td>
                    <td>
                      {new Date(a.criadoEm).toLocaleDateString("pt-BR")}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          className="action-btn edit"
                          onClick={() => editar(a)}
                        >
                          ✏️
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => excluir(a.id)}
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
                  {editing ? "Editar Aviso" : "Novo Aviso"}
                </h2>
              </div>

              <form onSubmit={salvar}>
                {/* TÍTULO */}
                <div className="form-group">
                  <label className="form-label">Título</label>
                  <input
                    className="form-input"
                    value={form.titulo}
                    onChange={(e) =>
                      setForm({ ...form, titulo: e.target.value })
                    }
                    required
                  />
                </div>

                {/* MENSAGEM */}
                <div className="form-group">
                  <label className="form-label">Mensagem</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    value={form.mensagem}
                    onChange={(e) =>
                      setForm({ ...form, mensagem: e.target.value })
                    }
                    required
                  />
                </div>

                {/* USUÁRIO CRIADOR */}
                <div className="form-group">
                  <label className="form-label">Criado Por</label>
                  <select
                    className="form-select"
                    value={form.criadoPorId}
                    onChange={(e) =>
                      setForm({ ...form, criadoPorId: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecione...</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
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
