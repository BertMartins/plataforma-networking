"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

export default function FinanceiroPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    tipo: "entrada",
    descricao: "",
    valor: "",
    data: "",
  });

  async function carregar() {
    const res = await fetch("/api/financeiro");
    const json = await res.json();
    setLista(json);
  }

  useEffect(() => {
    carregar();
  }, []);

  function novo() {
    setEditing(null);
    setForm({
      tipo: "entrada",
      descricao: "",
      valor: "",
      data: "",
    });
    setOpenModal(true);
  }

  function editar(item: any) {
    setEditing(item);
    setForm({
      tipo: item.tipo,
      descricao: item.descricao,
      valor: item.valor,
      data: item.data.split("T")[0],
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir registro financeiro?")) return;
    await fetch(`/api/financeiro/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    const payload = {
      ...form,
      valor: Number(form.valor),
    };

    if (editing) {
      await fetch(`/api/financeiro/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/financeiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          <h1 className="page-title">Financeiro</h1>
          <button className="btn btn-primary" onClick={novo}>
            Novo Registro
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Nenhum registro financeiro
                  </td>
                </tr>
              ) : (
                lista.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <span
                        className={`badge ${
                          i.tipo === "entrada" ? "approved" : "rejected"
                        }`}
                      >
                        {i.tipo}
                      </span>
                    </td>
                    <td>{i.descricao}</td>
                    <td>R$ {i.valor.toFixed(2)}</td>
                    <td>{new Date(i.data).toLocaleDateString()}</td>

                    <td>
                      <div className="flex gap-2">
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

        {openModal && (
          <div className="modal active">
            <div className="modal-content">
              <h2 className="modal-title">
                {editing ? "Editar Registro" : "Novo Registro"}
              </h2>

              <form onSubmit={salvar}>
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select
                    className="form-select"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <input
                    className="form-input"
                    value={form.descricao}
                    onChange={(e) =>
                      setForm({ ...form, descricao: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={form.valor}
                    onChange={(e) =>
                      setForm({ ...form, valor: e.target.value })
                    }
                    required
                  />
                </div>

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
