import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export default function NotFound() {
  const { t } = useSettings();

  return (
    <div className="empty-state" style={{ minHeight: "50vh" }}>
      <span className="upload-zone-icon">∅</span>
      <p>{t("notFound.title")}</p>
      <p className="meta-text">{t("notFound.body")}</p>
      <Link className="btn btn-secondary" to="/">
        {t("notFound.back")}
      </Link>
    </div>
  );
}
