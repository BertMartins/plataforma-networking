"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "membro",
  });

  const [filtro, setFiltro] = useState({
    nome: "",
    email: "",
    role: "",
  });

  async function carregar() {
    const params = new URLSearchParams();

    if (filtro.nome) params.append("nome", filtro.nome);
    if (filtro.email) params.append("email", filtro.email);
    if (filtro.role) params.append("role", filtro.role);

    const res = await fetch(`/api/usuarios?${params.toString()}`);
    const data = await res.json();
    setUsuarios(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  function novo() {
    setEditing(null);
    setForm({ nome: "", email: "", senha: "", role: "membro" });
    setOpenModal(true);
  }

  function editar(u: any) {
    setEditing(u);
    setForm({
      nome: u.nome,
      email: u.email,
      senha: "",
      role: u.role,
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir usuário?")) return;

    await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    const payload = { ...form };
    if (!payload.senha) delete (payload as any).senha;

    if (editing) {
      await fetch(`/api/usuarios/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setOpenModal(false);
    carregar();
  }

  function aplicarFiltro() {
    carregar();
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Usuários</h1>
          <button className="btn btn-primary" onClick={novo}>
            Novo Usuário
          </button>
        </div>

        {/* FILTROS */}
        <div className="content-card" style={{ marginBottom: 20 }}>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12 }}>
            <input
              className="form-input"
              placeholder="Nome..."
              value={filtro.nome}
              onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
            />

            <input
              className="form-input"
              placeholder="E-mail..."
              value={filtro.email}
              onChange={(e) => setFiltro({ ...filtro, email: e.target.value })}
            />

            <select
              className="form-select"
              value={filtro.role}
              onChange={(e) => setFiltro({ ...filtro, role: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="admin">Admin</option>
              <option value="membro">Membro</option>
            </select>

            <button className="btn btn-primary" onClick={aplicarFiltro}>
              Filtrar
            </button>
          </div>
        </div>

        {/* LISTA */}
        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge approved">{u.role}</span>
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button className="action-btn edit" onClick={() => editar(u)}>
                          ✏️
                        </button>

                        <button className="action-btn delete" onClick={() => excluir(u.id)}>
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
              <h2 className="modal-title">{editing ? "Editar Usuário" : "Novo Usuário"}</h2>

              <form onSubmit={salvar}>
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input
                    className="form-input"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                {!editing && (
                  <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-input"
                      value={form.senha}
                      onChange={(e) => setForm({ ...form, senha: e.target.value })}
                      required={!editing}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="admin">Admin</option>
                    <option value="membro">Membro</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" className="btn btn-secondary" onClick={() => setOpenModal(false)}>
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
