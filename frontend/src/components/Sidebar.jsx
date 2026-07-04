import { NavLink } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

const NAV_LINKS = [
  { to: "/matrix-operations", labelKey: "nav.matrixOps" },
  { to: "/image-filters", labelKey: "nav.imageFilters" },
  { to: "/image-composition", labelKey: "nav.imageComposition" },
];

export default function Sidebar() {
  const { t } = useSettings();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-title" style={{ textDecoration: "none" }}>
          Pixel-Math
        </NavLink>
        <div className="sidebar-subtitle">Terminal v1.0.4</div>
      </div>

      <nav className="sidebar-nav">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "sidebar-nav-link active" : "sidebar-nav-link"
            }
          >
            {t(link.labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings">{t("nav.settings")}</NavLink>
        <NavLink to="/documentation">{t("nav.documentation")}</NavLink>
      </div>
    </aside>
  );
}
