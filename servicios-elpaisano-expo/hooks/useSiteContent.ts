import { useCallback, useEffect, useState } from "react";
import {
  fetchRemoteSiteContent,
  getCachedSiteContent,
  getBundledSiteContent,
  SiteContent,
  SiteContentSource,
} from "../services/content";

export type SiteContentState = {
  content: SiteContent;
  source: SiteContentSource;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useSiteContent(): SiteContentState {
  const bundled = getBundledSiteContent();
  const [content, setContent] = useState(bundled.content);
  const [source, setSource] = useState<SiteContentSource>(bundled.source);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const remote = await fetchRemoteSiteContent();
    setContent(remote.content);
    setSource(remote.source);
    setError(null);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function load() {
      try {
        const cached = await getCachedSiteContent();
        if (isMounted) {
          setContent(cached.content);
          setSource(cached.source);
          setLoading(false);
        }

        const remote = await fetchRemoteSiteContent(controller.signal);
        if (isMounted) {
          setContent(remote.content);
          setSource(remote.source);
          setError(null);
        }
      } catch (err) {
        if (!isMounted || controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unable to refresh content.");
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { content, source, loading, error, refresh };
}
