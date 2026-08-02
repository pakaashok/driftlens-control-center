"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { EnvSelector } from "@/components/dashboard/EnvSelector";
import { KPICards } from "@/components/dashboard/KPICards";
import { TokenPanel } from "@/components/dashboard/TokenPanel";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { compareEnvironments, fetchEnvironments, type DriftComparison } from "@/lib/api";

export default function Dashboard() {
  const [environments, setEnvironments] = useState<string[]>([]);
  const [envA, setEnvA] = useState("");
  const [envB, setEnvB] = useState("");
  const [comparison, setComparison] = useState<DriftComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnvironments()
      .then((data) => {
        setEnvironments(data.environments);
        if (data.environments.length >= 2) {
          setEnvA(data.environments[0]);
          setEnvB(data.environments[data.environments.length - 1]);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleAnalyze = async () => {
    if (!envA || !envB) return;
    setLoading(true);
    setError(null);
    try {
      const result = await compareEnvironments(envA, envB, "full");
      setComparison(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </div>
        )}
        <EnvSelector
          environments={environments}
          envA={envA}
          envB={envB}
          loading={loading}
          onEnvAChange={setEnvA}
          onEnvBChange={setEnvB}
          onAnalyze={handleAnalyze}
        />
        {comparison && (
          <>
            <KPICards overall={comparison.overall} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TokenPanel
                title={`Only in ${comparison.environment_a}`}
                description={`Tokens present only in ${comparison.environment_a}`}
                tokens={comparison.overall.only_in_a}
                dotColor="bg-red-500"
                badgeColor="border-red-500/50 text-red-400"
                tokenColor="text-red-300"
                borderColor="border-red-500/20"
                bgColor="bg-red-500/5"
              />
              <TokenPanel
                title={`Only in ${comparison.environment_b}`}
                description={`Tokens present only in ${comparison.environment_b}`}
                tokens={comparison.overall.only_in_b}
                dotColor="bg-green-500"
                badgeColor="border-green-500/50 text-green-400"
                tokenColor="text-green-300"
                borderColor="border-green-500/20"
                bgColor="bg-green-500/5"
              />
            </div>
            <div className="mt-6">
              <TokenPanel
                title="Common Tokens"
                description="Tokens shared between both environments"
                tokens={comparison.overall.common}
                dotColor="bg-cyan-500"
                badgeColor="border-cyan-500/50 text-cyan-400"
                tokenColor="text-cyan-300"
                borderColor="border-cyan-500/20"
                bgColor="bg-cyan-500/5"
              />
            </div>
          </>
        )}
        {!comparison && !loading && <EmptyState />}
      </main>
      <footer className="border-t border-slate-800 bg-slate-900/50 py-4 mt-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500">
          Powered by Jaccard Similarity | Built with FastAPI + Next.js
        </div>
      </footer>
    </div>
  );
}
