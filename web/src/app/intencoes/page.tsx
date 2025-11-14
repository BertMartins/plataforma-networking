"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

type Intencao = {
  id: string;
  nome: string;
  email: string;
  empresa?: string | null;
  cargo?: string | null;
  status: string;
  criadoEm: string;
  convite?: { id: string; token: string } | null;
};

export default function IntencoesPage() {
  const [lista, setLista] = useState<Intencao[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Intencao | null>(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    empresa: "",
    cargo: "",
    status: "pendente",
  });
  const [erro, setErro] = useState("");

  async function carregar() {
    const res = await fetch("/api/intencoes");
    if (res.ok) {
      const data = await res.json();
      setLista(Array.isArray(data) ? data : []);
    } else {
      console.error("Erro ao carregar intenções");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function novo() {
    setEditing(null);
    setForm({ nome: "", email: "", empresa: "", cargo: "", status: "pendente" });
    setErro("");
    setOpenModal(true);
  }

  function editar(item: Intencao) {
    setEditing(item);
    setForm({
      nome: item.nome,
      email: item.email,
      empresa: item.empresa ?? "",
      cargo: item.cargo ?? "",
      status: item.status,
    });
    setErro("");
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir intenção?")) return;
    await fetch(`/api/intencoes/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();
    setErro("");

    if (!form.nome || !form.email) {
      setErro("Nome e email são obrigatórios.");
      return;
    }

    try {
      if (editing) {
        await fetch(`/api/intencoes/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        const res = await fetch("/api/intencoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const resp = await res.json();
          setErro(resp.erro || "Erro ao criar intenção");
          return;
        }
      }

      setOpenModal(false);
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Intenções</h1>
          <button className="btn btn-primary" onClick={novo}>Nova Intenção</button>
        </div>

        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Nome</th>
                <th style={{ textAlign: "left" }}>Email</th>
                <th style={{ textAlign: "left" }}>Empresa</th>
                <th style={{ textAlign: "left" }}>Cargo</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Convite</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>Nenhuma intenção encontrada</td>
                </tr>
              ) : (
                lista.map((i) => (
                  <tr key={i.id}>
                    <td>{i.nome}</td>
                    <td>{i.email}</td>
                    <td>{i.empresa ?? "-"}</td>
                    <td>{i.cargo ?? "-"}</td>
                    <td>
                      <span className={`badge ${i.status === "aprovado" ? "approved" : i.status === "rejeitado" ? "rejected" : "pending"}`}>
                        {i.status}
                      </span>
                    </td>
                    <td>{i.convite ? <code style={{fontSize: 12}}>{i.convite.token}</code> : "-"}</td>

                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="action-btn edit"
                          onClick={() => editar(i)}
                          title="Editar"
                        >
                          ✏️
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => excluir(i.id)}
                          title="Excluir"
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
            <div className="modal-content" style={{ maxWidth: 640 }}>
              <div className="modal-header">
                <h2 className="modal-title">{editing ? "Editar Intenção" : "Nova Intenção"}</h2>
              </div>

              <form onSubmit={salvar}>
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input name="nome" className="form-input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Empresa</label>
                  <input name="empresa" className="form-input" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Cargo</label>
                  <input name="cargo" className="form-input" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select modern-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="rejeitado">Rejeitado</option>
                  </select>
                </div>

                {erro && <p style={{ color: "var(--danger)", marginBottom: 12 }}>{erro}</p>}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setOpenModal(false)}>Cancelar</button>
                  <button className="btn btn-primary" type="submit">{editing ? "Atualizar" : "Salvar"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
