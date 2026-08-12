import { useEffect, useRef, useState } from "react";
import { getJobResult, waitForJobCompletion } from "../api/client";
import { useSettings } from "../context/SettingsContext";

const SLOW_HINT_DELAY_MS = 6000;

export function useJobSubmit(storageKey) {
  const { t } = useSettings();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [jobStatus, setJobStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const slowTimerRef = useRef(null);

  // Restaurar el último job de esta pantalla tras un refresh; el backend
  // persiste los jobs en disco, así que basta con recordar el job_id.
  useEffect(() => {
    if (!storageKey) return undefined;
    const savedJobId = localStorage.getItem(storageKey);
    if (!savedJobId) return undefined;

    let cancelled = false;
    getJobResult(savedJobId)
      .then((completed) => {
        if (cancelled) return;
        setResult(completed);
        setJobStatus(t("shared.jobRestored", savedJobId));
      })
      .catch(() => {
        // Job purgado o servidor reiniciado sin ese job: olvidarlo
        if (!cancelled) localStorage.removeItem(storageKey);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  async function run(kickoffPromise, { onComplete } = {}) {
    setError("");
    setResult(null);
    setJobStatus("");
    setIsLoading(true);
    setIsSlow(false);
    slowTimerRef.current = setTimeout(() => setIsSlow(true), SLOW_HINT_DELAY_MS);

    try {
      const kickoff = await kickoffPromise;
      setJobStatus(t("shared.jobRunning", kickoff.job_id));
      const completed = await waitForJobCompletion(kickoff.job_id);
      setResult(completed);
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, kickoff.job_id);
        } catch {
          // Almacenamiento lleno o bloqueado — seguir sin persistir
        }
      }
      onComplete?.(completed);
      setJobStatus(t("shared.jobCompleted", kickoff.job_id));
    } catch (err) {
      setError(err.message === "REQUEST_TIMEOUT" ? t("shared.requestTimeout") : err.message);
      setJobStatus("");
    } finally {
      clearTimeout(slowTimerRef.current);
      setIsLoading(false);
      setIsSlow(false);
    }
  }

  function reset() {
    clearTimeout(slowTimerRef.current);
    setResult(null);
    setError("");
    setJobStatus("");
    setIsLoading(false);
    setIsSlow(false);
    if (storageKey) localStorage.removeItem(storageKey);
  }

  return { result, error, jobStatus, isLoading, isSlow, run, reset, setError };
}
