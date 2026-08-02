import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  title: string;
  description: string;
  tokens: string[];
  dotColor: string;
  badgeColor: string;
  tokenColor: string;
  borderColor: string;
  bgColor: string;
}

export function TokenPanel({ title, description, tokens, dotColor, badgeColor, tokenColor, borderColor, bgColor }: Props) {
  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className={`h-2 w-2 rounded-full ${dotColor}`} />
          {title}
          <Badge variant="outline" className={`ml-auto ${badgeColor}`}>
            {tokens.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-72 overflow-y-auto space-y-2">
          {tokens.length === 0
            ? (<p className="text-sm text-slate-500 italic">No unique tokens</p>)
            : tokens.map((token, idx) => (
                <div key={idx} className={`rounded-md border ${borderColor} ${bgColor} px-3 py-2 font-mono text-xs ${tokenColor}`}>
                  {token}
                </div>
              ))
          }
        </div>
      </CardContent>
    </Card>
  );
}
