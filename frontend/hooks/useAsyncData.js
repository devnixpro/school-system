"use client";

import { useEffect, useState } from "react";

export default function useAsyncData(requestKey, request) {
  const [result, setResult] = useState({
    key: "",
    data: null,
    error: "",
  });
  const isCurrent = Boolean(requestKey) && result.key === requestKey;

  useEffect(() => {
    if (!requestKey) return undefined;
    let active = true;

    request()
      .then((data) => {
        if (active) setResult({ key: requestKey, data, error: "" });
      })
      .catch((error) => {
        if (active) {
          setResult({
            key: requestKey,
            data: null,
            error: error.message || "Request failed",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [request, requestKey]);

  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : "",
    loading: Boolean(requestKey) && !isCurrent,
  };
}
