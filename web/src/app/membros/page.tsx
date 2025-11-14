"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function MembrosPage() {
  const [membros, setMembros] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    empresa: "",
    cargo: "",
  });

  async function carregar() {
    const res = await fetch("/api/membros");
    const data = await res.json();
    setMembros(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function novo() {
    setEditing(null);
    setForm({ nome: "", email: "", empresa: "", cargo: "" });
    setOpenModal(true);
  }

  function editar(m: any) {
    setEditing(m);
    setForm({
      nome: m.nome,
      email: m.email,
      empresa: m.empresa || "",
      cargo: m.cargo || "",
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Tem certeza que deseja excluir este membro?")) return;

    await fetch(`/api/membros/${id}`, {
      method: "DELETE",
    });

    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    if (editing) {
      await fetch(`/api/membros/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/membros", {
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
          <h1 className="page-title">Membros</h1>

          <button className="btn btn-primary" onClick={novo}>
            Novo Membro
          </button>
        </div>

        {/* TABELA BONITA */}
        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Empresa</th>
                <th>Cargo</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {membros.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Nenhum membro encontrado
                  </td>
                </tr>
              ) : (
                membros.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nome}</td>
                    <td>{m.email}</td>
                    <td>{m.empresa ?? "-"}</td>
                    <td>{m.cargo ?? "-"}</td>

                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          title="Editar"
                          className="action-btn edit"
                          onClick={() => editar(m)}
                        >
                          ✏️
                        </button>

                        <button
                          title="Excluir"
                          className="action-btn delete"
                          onClick={() => excluir(m.id)}
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
                  {editing ? "Editar Membro" : "Novo Membro"}
                </h2>
              </div>

              <form onSubmit={salvar}>
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input
                    name="nome"
                    className="form-input"
                    value={form.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input
                    name="email"
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Empresa</label>
                  <input
                    name="empresa"
                    className="form-input"
                    value={form.empresa}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cargo</label>
                  <input
                    name="cargo"
                    className="form-input"
                    value={form.cargo}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
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
