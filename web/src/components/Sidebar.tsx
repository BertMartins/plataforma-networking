"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const menus = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/membros", label: "Membros", icon: "👥" },
    { href: "/indicacoes", label: "Indicações", icon: "🔁" },
    { href: "/presencas", label: "Presenças", icon: "✔️" },
    { href: "/mensalidades", label: "Mensalidades", icon: "💰" },
    { href: "/convites", label: "Convites", icon: "📩" },
    { href: "/avisos", label: "Avisos", icon: "🔔" },
    { href: "/financeiro", label: "Financeiro", icon: "🧾" },
    { href: "/reunioes", label: "Reuniões", icon: "🤝" },
    { href: "/obrigados", label: "Obrigados", icon: "📢" },
    { href: "/intencoes", label: "Intenções", icon: "📑" },
    { href: "/usuarios", label: "Usuários", icon: "🧑‍💻" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">NetHub</h1>
        <button className="logout-btn" onClick={logout}>
          🚪 Sair
        </button>
      </div>

      <ul className="nav-menu">
        {menus.map((item) => (
          <li key={item.href} className="nav-item">
            <Link
              href={item.href}
              className={`nav-link ${
                pathname === item.href ? "active" : ""
              }`}
            >
              {item.icon} <span className="ml-2">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

       
    </aside>
  );
}
