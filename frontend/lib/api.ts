/**
 * DriftLens Control Center - API Client
 *
 * Automatically detects backend URL at RUNTIME in the browser.
 * Works on any machine without configuration:
 * - localhost → http://localhost:8000
 * - 192.168.x.x → http://192.168.x.x:8000
 * - any-domain.com → http://any-domain.com:8000
 */

function getApiBase(): string {
  // Server-side rendering fallback
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }
  // Runtime: use same hostname as browser, port 8000
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:8000`;
}

const API_BASE = getApiBase();

export interface DriftMetrics {
  similarity_score: number;
  similarity_percentage: number;
  drift_percentage: number;
  intersection_size: number;
  union_size: number;
  only_in_a: string[];
  only_in_b: string[];
  common: string[];
  drift_detected: boolean;
}

export interface DriftComparison {
  environment_a: string;
  environment_b: string;
  mode: string;
  overall: DriftMetrics;
  files_compared: string[];
  files_only_in_a: string[];
  files_only_in_b: string[];
  per_file_reports: Record<string, DriftMetrics>;
}

export async function fetchEnvironments(): Promise<{
  environments: string[];
  count: number;
}> {
  const res = await fetch(`${API_BASE}/api/environments`);
  if (!res.ok) throw new Error("Failed to fetch environments");
  return res.json();
}

export async function compareEnvironments(
  envA: string,
  envB: string,
  mode = "full"
): Promise<DriftComparison> {
  const res = await fetch(
    `${API_BASE}/api/kubernetes/compare?env_a=${envA}&env_b=${envB}&mode=${mode}`
  );
  if (!res.ok) throw new Error("Failed to compare environments");
  return res.json();
}

export async function fetchMatrix(): Promise<{
  environments: string[];
  matrix: Record<string, Record<string, number>>;
}> {
  const res = await fetch(`${API_BASE}/api/kubernetes/matrix`);
  if (!res.ok) throw new Error("Failed to fetch matrix");
  return res.json();
}
