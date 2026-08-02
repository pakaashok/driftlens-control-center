import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitCompare, Loader2, TrendingUp } from "lucide-react";

interface Props {
  environments: string[];
  envA: string;
  envB: string;
  loading: boolean;
  onEnvAChange: (v: string) => void;
  onEnvBChange: (v: string) => void;
  onAnalyze: () => void;
}

export function EnvSelector({ environments, envA, envB, loading, onEnvAChange, onEnvBChange, onAnalyze }: Props) {
  return (
    <Card className="mb-8 border-slate-800 bg-slate-900/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <GitCompare className="h-5 w-5 text-cyan-400" />
          Compare Environments
        </CardTitle>
        <CardDescription className="text-slate-400">
          Select two environments to analyze drift using Jaccard similarity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-slate-300">Environment A</label>
            <Select value={envA} onValueChange={onEnvAChange}>
              <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                {environments.map((env) => (
                  <SelectItem key={env} value={env}>{env}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-shrink-0 pb-2 text-2xl text-slate-500">vs</div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-slate-300">Environment B</label>
            <Select value={envB} onValueChange={onEnvBChange}>
              <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                {environments.map((env) => (
                  <SelectItem key={env} value={env}>{env}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onAnalyze}
            disabled={loading || !envA || !envB || envA === envB}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {loading
              ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>)
              : (<><TrendingUp className="mr-2 h-4 w-4" />Analyze Drift</>)
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
