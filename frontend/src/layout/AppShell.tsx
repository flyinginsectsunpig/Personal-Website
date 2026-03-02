import { Link, useLocation } from "react-router-dom";
import { PropsWithChildren } from "react";

const navItems = [
  { to: "/ml-lab", label: "ML Lab" },
  { to: "/java-spring", label: "Spring Boot" },
  { to: "/full-stack", label: "Full Stack" },
  { to: "/data-engineering", label: "Data" },
  { to: "/devops", label: "DevOps" },
  { to: "/interactive-3d", label: "3D Web" },
  { to: "/why-hire-me", label: "Why Hire Me" }
];

export default function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();

  return (
    <div className="app-root">
      <header className="topbar">
        <Link className="brand" to="/">
          ZKM Portfolio
        </Link>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.to}
              className={location.pathname === item.to ? "nav-link active" : "nav-link"}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
