import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Layers, ShieldAlert } from "lucide-react";
import type { DriftMetrics } from "@/lib/api";

const getScoreColor = (s: number) => {
  if (s >= 0.95) return "text-green-400";
  if (s >= 0.75) return "text-yellow-400";
  if (s >= 0.5) return "text-orange-400";
  return "text-red-400";
};

const getDriftStatus = (s: number) => {
  if (s >= 0.95) return { text: "NO DRIFT", color: "bg-green-500/20 text-green-400 border-green-500/50" };
  if (s >= 0.75) return { text: "MINOR DRIFT", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" };
  if (s >= 0.5) return { text: "MODERATE DRIFT", color: "bg-orange-500/20 text-orange-400 border-orange-500/50" };
  return { text: "CRITICAL DRIFT", color: "bg-red-500/20 text-red-400 border-red-500/50" };
};

export function KPICards({ overall }: { overall: DriftMetrics }) {
  const status = getDriftStatus(overall.similarity_score);
  const color = getScoreColor(overall.similarity_score);
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="pb-2">
          <CardDescription className="text-slate-400">Similarity</CardDescription>
          <CardTitle className={`text-3xl ${color}`}>
            {overall.similarity_percentage.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="h-3 w-3" />Jaccard score
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="pb-2">
          <CardDescription className="text-slate-400">Drift</CardDescription>
          <CardTitle className={`text-3xl ${color}`}>
            {overall.drift_percentage.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={status.color}>{status.text}</Badge>
        </CardContent>
      </Card>
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="pb-2">
          <CardDescription className="text-slate-400">Common Tokens</CardDescription>
          <CardTitle className="text-3xl text-cyan-400">
            {overall.intersection_size}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Layers className="h-3 w-3" />Shared across both
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="pb-2">
          <CardDescription className="text-slate-400">Total Tokens</CardDescription>
          <CardTitle className="text-3xl text-purple-400">
            {overall.union_size}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldAlert className="h-3 w-3" />Union of both envs
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
