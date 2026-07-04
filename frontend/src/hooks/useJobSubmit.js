import { useState } from "react";
import { waitForJobCompletion } from "../api/client";

export function useJobSubmit() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [jobStatus, setJobStatus] = useState("");

  async function run(kickoffPromise, { onComplete } = {}) {
    setError("");
    setResult(null);
    setJobStatus("");

    try {
      const kickoff = await kickoffPromise;
      setJobStatus(`Job ${kickoff.job_id} running...`);
      const completed = await waitForJobCompletion(kickoff.job_id);
      setResult(completed);
      onComplete?.(completed);
      setJobStatus(`Job ${kickoff.job_id} completed.`);
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
