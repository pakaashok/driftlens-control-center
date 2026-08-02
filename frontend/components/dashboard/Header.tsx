import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DriftLens Control Center</h1>
              <p className="text-xs text-slate-400">Mission control for infrastructure drift</p>
            </div>
          </div>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
            v0.1.0
          </Badge>
        </div>
      </div>
    </header>
  );
}
