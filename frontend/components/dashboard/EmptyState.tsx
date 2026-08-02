import { Activity } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-12 text-center">
      <Activity className="mx-auto h-12 w-12 text-slate-600" />
      <h3 className="mt-4 text-lg font-semibold text-slate-300">Ready to Analyze</h3>
      <p className="mt-2 text-sm text-slate-500">
        Select two environments above and click Analyze Drift to begin
      </p>
    </div>
  );
}
