import { useSettings } from "../context/SettingsContext";
import RangeField from "../components/RangeField";

export default function Settings() {
  const { settings, update, restoreDefaults, t } = useSettings();

  return (
    <div>
      <div className="page-header">
        <h1>{t("settings.title")}</h1>
        <p>{t("settings.subtitle")}</p>
      </div>

      <section className="panel">
        <h2>{t("settings.language")}</h2>
        <div className="form-grid" style={{ marginTop: "1rem", maxWidth: "20rem" }}>
          <select
            aria-label={t("settings.language")}
            value={settings.language}
            onChange={(event) => update({ language: event.target.value })}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </section>

      <section className="panel">
        <h2>{t("settings.defaultParams")}</h2>
        <p className="meta-text" style={{ marginTop: "0.5rem" }}>
          {t("settings.defaultParamsHint")}
        </p>
        <div className="form-grid" style={{ marginTop: "1rem" }}>
          <RangeField
            label={t("shared.pixelSize")}
            value={settings.pixelSize}
            min={1}
            max={64}
            onChange={(value) => update({ pixelSize: value })}
          />
          <RangeField
            label={t("shared.colorLevels")}
            value={settings.colorLevels}
            min={2}
            max={256}
            onChange={(value) => update({ colorLevels: value })}
          />
          <RangeField
            label={t("composition.weightAlpha")}
            value={settings.alpha}
            min={0}
            max={1}
            step={0.05}
            onChange={(value) => update({ alpha: value })}
          />
          <RangeField
            label={t("composition.weightBeta")}
            value={settings.beta}
            min={0}
            max={1}
            step={0.05}
            onChange={(value) => update({ beta: value })}
          />
        </div>
      </section>

      <section className="panel">
        <h2>{t("settings.matrixViewer")}</h2>
        <div className="form-grid" style={{ marginTop: "1rem", maxWidth: "20rem" }}>
          <select
            aria-label={t("settings.matrixViewer")}
            value={settings.matrixView}
            onChange={(event) => update({ matrixView: event.target.value })}
          >
            <option value="table">{t("settings.matrixViewerTable")}</option>
            <option value="terminal">{t("settings.matrixViewerTerminal")}</option>
          </select>
        </div>
        <div style={{ marginTop: "1.25rem" }}>
          <button type="button" className="btn-secondary" onClick={restoreDefaults}>
            {t("settings.restore")}
          </button>
        </div>
      </section>
    </div>
  );
}
