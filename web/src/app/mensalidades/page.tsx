"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function MensalidadesPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    membroId: "",
    mes: "",
    ano: "",
    valor: "",
    status: "pendente",
    vencimento: "",
  });

  async function carregar() {
    const [mensal, mem] = await Promise.all([
      fetch("/api/mensalidades").then((r) => r.json()),
      fetch("/api/membros").then((r) => r.json()),
    ]);

    setLista(mensal);
    setMembros(mem);
  }

  useEffect(() => {
    carregar();
  }, []);

  function novo() {
    setEditing(null);
    setForm({
      membroId: "",
      mes: "",
      ano: "",
      valor: "",
      status: "pendente",
      vencimento: "",
    });
    setOpenModal(true);
  }

  function editar(item: any) {
    setEditing(item);
    setForm({
      membroId: item.membroId,
      mes: item.mes,
      ano: item.ano,
      valor: item.valor,
      status: item.status,
      vencimento: item.vencimento?.split("T")[0] ?? "",
    });
    setOpenModal(true);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir mensalidade?")) return;

    await fetch(`/api/mensalidades/${id}`, { method: "DELETE" });
    carregar();
  }

  async function salvar(e: any) {
    e.preventDefault();

    const payload = {
      membroId: form.membroId,
      mes: Number(form.mes),
      ano: Number(form.ano),
      valor: Number(form.valor),
      status: form.status,
      vencimento: new Date(form.vencimento),
    };

    if (editing) {
      await fetch(`/api/mensalidades/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/mensalidades", {
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
          <h1 className="page-title">Mensalidades</h1>
          <button className="btn btn-primary" onClick={novo}>
            Nova Mensalidade
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-full">
            <thead>
              <tr>
                <th>Membro</th>
                <th>Mês Ref.</th>
                <th>Valor</th>
                <th>Status</th>
                <th style={{ width: 100 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Nenhuma mensalidade registrada
                  </td>
                </tr>
              ) : (
                lista.map((m) => (
                  <tr key={m.id}>
                    <td>{m.membro?.nome}</td>
                    <td>{m.mes}/{m.ano}</td>
                    <td>R$ {m.valor?.toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          m.status === "pago" ? "approved" : "rejected"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    <td>
                      <div className="button-action">
                        <button className="action-btn edit" onClick={() => editar(m)}>
                          ✏️
                        </button>
                        <button className="action-btn delete" onClick={() => excluir(m.id)}>
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
                {editing ? "Editar" : "Nova"} Mensalidade
              </h2>

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

                {/* MES + ANO */}
                <div className="form-group">
                  <label className="form-label">Mês Referência</label>
                  <input
                    type="month"
                    className="form-input"
                    value={
                      form.ano && form.mes
                        ? `${form.ano}-${String(form.mes).padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => {
                      const [ano, mes] = e.target.value.split("-");
                      setForm({
                        ...form,
                        ano,
                        mes,
                        vencimento: `${ano}-${mes}-05`,
                      });
                    }}
                    required
                  />
                </div>

                {/* VALOR */}
                <div className="form-group">
                  <label className="form-label">Valor</label>
                  <input
                    type="number"
                    className="form-input"
                    step="0.01"
                    value={form.valor}
                    onChange={(e) =>
                      setForm({ ...form, valor: e.target.value })
                    }
                    required
                  />
                </div>

                {/* STATUS */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
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
