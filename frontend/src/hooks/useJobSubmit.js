import { useRef, useState } from "react";
import { waitForJobCompletion } from "../api/client";
import { useSettings } from "../context/SettingsContext";

const SLOW_HINT_DELAY_MS = 6000;

export function useJobSubmit() {
  const { t } = useSettings();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [jobStatus, setJobStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const slowTimerRef = useRef(null);

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
  }

  return { result, error, jobStatus, isLoading, isSlow, run, reset, setError };
}
