import { useState } from "react";
import { waitForJobCompletion } from "../api/client";
import { useSettings } from "../context/SettingsContext";

export function useJobSubmit() {
  const { t } = useSettings();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [jobStatus, setJobStatus] = useState("");

  async function run(kickoffPromise, { onComplete } = {}) {
    setError("");
    setResult(null);
    setJobStatus("");

    try {
      const kickoff = await kickoffPromise;
      setJobStatus(t("shared.jobRunning", kickoff.job_id));
      const completed = await waitForJobCompletion(kickoff.job_id);
      setResult(completed);
      onComplete?.(completed);
      setJobStatus(t("shared.jobCompleted", kickoff.job_id));
    } catch (err) {
      setError(err.message);
    }
  }

  function reset() {
    setResult(null);
    setError("");
    setJobStatus("");
  }

  return { result, error, jobStatus, run, reset, setError };
}
