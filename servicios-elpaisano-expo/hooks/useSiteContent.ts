import { useMemo } from "react";
import { getSiteContent } from "../services/content";

export function useSiteContent() {
  return useMemo(() => getSiteContent(), []);
}