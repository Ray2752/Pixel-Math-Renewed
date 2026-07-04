import { useSettings } from "../context/SettingsContext";

export default function Documentation() {
  const { t } = useSettings();

  return (
    <div>
      <div className="page-header">
        <h1>{t("docs.title")}</h1>
        <p>{t("docs.subtitle")}</p>
      </div>

      <section className="panel">
        <h2>{t("nav.matrixOps")}</h2>
        <p style={{ marginTop: "0.75rem", lineHeight: 1.7 }}>{t("docs.matrixOpsBody")}</p>
      </section>

      <section className="panel">
        <h2>{t("nav.imageFilters")}</h2>
        <p style={{ marginTop: "0.75rem", lineHeight: 1.7 }}>{t("docs.filtersBody")}</p>
      </section>

      <section className="panel">
        <h2>{t("nav.imageComposition")}</h2>
        <p style={{ marginTop: "0.75rem", lineHeight: 1.7 }}>{t("docs.compositionBody")}</p>
      </section>

      <section className="panel">
        <h2>{t("docs.source")}</h2>
        <p style={{ marginTop: "0.75rem" }}>
          <a
            href="https://github.com/Ray2752/Pixel-Math-Renewed"
            target="_blank"
            rel="noreferrer"
          >
            {t("docs.sourceLink")}
          </a>
        </p>
      </section>
    </div>
  );
}
