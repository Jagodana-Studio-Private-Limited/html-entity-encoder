"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

// Named HTML entities map (the most common ones)
const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
  " ": "&nbsp;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "¢": "&cent;",
  "§": "&sect;",
  "¶": "&para;",
  "•": "&bull;",
  "…": "&hellip;",
  "–": "&ndash;",
  "—": "&mdash;",
  "«": "&laquo;",
  "»": "&raquo;",
  "‹": "&lsaquo;",
  "›": "&rsaquo;",
  "\u2018": "&lsquo;",
  "\u2019": "&rsquo;",
  "\u201C": "&ldquo;",
  "\u201D": "&rdquo;",
  "¿": "&iquest;",
  "¡": "&iexcl;",
  "°": "&deg;",
  "±": "&plusmn;",
  "×": "&times;",
  "÷": "&divide;",
  "½": "&frac12;",
  "¼": "&frac14;",
  "¾": "&frac34;",
  "²": "&sup2;",
  "³": "&sup3;",
  "¹": "&sup1;",
  "µ": "&micro;",
  "¬": "&not;",
  "∞": "&infin;",
  "≈": "&asymp;",
  "≠": "&ne;",
  "≤": "&le;",
  "≥": "&ge;",
  "∑": "&sum;",
  "∏": "&prod;",
  "√": "&radic;",
  "∂": "&part;",
  "∫": "&int;",
  "α": "&alpha;",
  "β": "&beta;",
  "γ": "&gamma;",
  "δ": "&delta;",
  "ε": "&epsilon;",
  "θ": "&theta;",
  "λ": "&lambda;",
  "μ": "&mu;",
  "π": "&pi;",
  "σ": "&sigma;",
  "τ": "&tau;",
  "φ": "&phi;",
  "ω": "&omega;",
  "Α": "&Alpha;",
  "Β": "&Beta;",
  "Γ": "&Gamma;",
  "Δ": "&Delta;",
  "Ε": "&Epsilon;",
  "Θ": "&Theta;",
  "Λ": "&Lambda;",
  "Μ": "&Mu;",
  "Π": "&Pi;",
  "Σ": "&Sigma;",
  "Τ": "&Tau;",
  "Φ": "&Phi;",
  "Ω": "&Omega;",
  "←": "&larr;",
  "→": "&rarr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "↔": "&harr;",
  "♠": "&spades;",
  "♣": "&clubs;",
  "♥": "&hearts;",
  "♦": "&diams;",
};

// Reverse map for decoding named entities
const REVERSE_NAMED_ENTITIES: Record<string, string> = Object.fromEntries(
  Object.entries(NAMED_ENTITIES).map(([char, entity]) => [entity, char])
);

type EncodeMode = "named" | "decimal" | "hex";

function encodeChar(char: string, mode: EncodeMode): string {
  const code = char.codePointAt(0)!;

  if (mode === "named") {
    // Use named entity if available, otherwise decimal
    if (NAMED_ENTITIES[char]) return NAMED_ENTITIES[char];
    if (code > 127) return `&#${code};`;
    return char;
  }
  if (mode === "decimal") {
    // Encode all characters that need escaping or are non-ASCII
    if (NAMED_ENTITIES[char] || code > 127) return `&#${code};`;
    return char;
  }
  if (mode === "hex") {
    if (NAMED_ENTITIES[char] || code > 127) return `&#x${code.toString(16).toUpperCase()};`;
    return char;
  }
  return char;
}

function encodeHtml(text: string, mode: EncodeMode): string {
  // Use Array.from to handle surrogate pairs / emoji correctly
  return Array.from(text)
    .map((char) => encodeChar(char, mode))
    .join("");
}

function decodeHtml(text: string): string {
  // Decode named entities using a textarea trick (DOM-based, fully safe, client-only)
  // We manually parse to avoid any security issues and to ensure it's truly client-side
  return text
    // Named entities: &amp; &lt; etc.
    .replace(/&([a-zA-Z]+);/g, (match, name) => {
      const entity = `&${name};`;
      return REVERSE_NAMED_ENTITIES[entity] ?? match;
    })
    // Decimal numeric entities: &#60;
    .replace(/&#(\d+);/g, (_, num) =>
      String.fromCodePoint(parseInt(num, 10))
    )
    // Hex numeric entities: &#x3C; or &#X3c;
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    );
}

function countEntities(text: string): number {
  const matches = text.match(/&[#a-zA-Z][^;]{1,20};/g);
  return matches ? matches.length : 0;
}

const EXAMPLE_INPUTS = [
  { label: "HTML markup", value: '<p class="title">Hello & "World"</p>' },
  { label: "Script tag", value: '<script>alert("XSS")</script>' },
  { label: "Math symbols", value: "a ≤ b ≥ c ≠ d ≈ e ∞" },
  { label: "Special chars", value: "© 2025 Jagodana™ — All rights reserved" },
  { label: "Currency", value: "Price: €9.99 or £8.50 or ¥1200 or ¢99" },
];

export function HtmlEntityTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeMode, setEncodeMode] = useState<EncodeMode>("named");
  const [copied, setCopied] = useState(false);

  const output =
    input.trim() === ""
      ? ""
      : mode === "encode"
      ? encodeHtml(input, encodeMode)
      : decodeHtml(input);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const handleLoadExample = useCallback((value: string) => {
    setInput(value);
    setMode("encode");
    ToolEvents.toolUsed("load-example");
  }, []);

  const charCount = Array.from(input).length;
  const entityCount =
    mode === "encode" ? countEntities(output) : countEntities(input);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Mode:</span>
          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as "encode" | "decode");
              ToolEvents.toolUsed(v);
            }}
          >
            <TabsList>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {mode === "encode" && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Format:</span>
            <Tabs
              value={encodeMode}
              onValueChange={(v) => setEncodeMode(v as EncodeMode)}
            >
              <TabsList>
                <TabsTrigger value="named">Named</TabsTrigger>
                <TabsTrigger value="decimal">Decimal</TabsTrigger>
                <TabsTrigger value="hex">Hex</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {/* Format info badges */}
      {mode === "encode" && (
        <motion.div
          key={encodeMode}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {encodeMode === "named" && (
            <>
              <Badge variant="outline" className="font-mono text-xs">
                &lt; → &amp;lt;
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                &amp; → &amp;amp;
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                © → &amp;copy;
              </Badge>
            </>
          )}
          {encodeMode === "decimal" && (
            <>
              <Badge variant="outline" className="font-mono text-xs">
                &lt; → &amp;#60;
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                &amp; → &amp;#38;
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                © → &amp;#169;
              </Badge>
            </>
          )}
          {encodeMode === "hex" && (
            <>
              <Badge variant="outline" className="font-mono text-xs">
                &lt; → &amp;#x3C;
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                &amp; → &amp;#x26;
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                © → &amp;#xA9;
              </Badge>
            </>
          )}
        </motion.div>
      )}

      {/* Main Editor Area */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {mode === "encode" ? "Plain Text / HTML" : "Encoded HTML"}
            </label>
            {input && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? 'Paste text or HTML here, e.g. <p class="hi">Hello & "World"</p>'
                : "Paste encoded HTML here, e.g. &lt;p&gt;Hello &amp; World&lt;/p&gt;"
            }
            className="w-full h-52 rounded-xl border border-border bg-background px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/50 transition-shadow"
            spellCheck={false}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{charCount} characters</span>
            {mode === "decode" && entityCount > 0 && (
              <span>{entityCount} entities found</span>
            )}
          </div>
        </div>

        {/* Arrow (desktop) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-brand" />
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {mode === "encode" ? "Encoded Output" : "Decoded Text"}
            </label>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              disabled={!output}
              className="h-7 px-3 gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-52 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground resize-none focus:outline-none cursor-default select-all"
              spellCheck={false}
            />
            {!output && input && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm text-muted-foreground">Processing...</span>
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Array.from(output).length} characters</span>
            {mode === "encode" && entityCount > 0 && (
              <span>{entityCount} entities encoded</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Examples */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_INPUTS.map((example) => (
            <button
              key={example.label}
              onClick={() => handleLoadExample(example.value)}
              className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:bg-muted hover:border-brand/30 transition-all"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entity Reference Table */}
      <div className="rounded-2xl border border-border/50 bg-muted/20 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Common HTML Entities Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                  Character
                </th>
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                  Named
                </th>
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                  Decimal
                </th>
                <th className="text-left py-2 font-medium text-muted-foreground">
                  Hex
                </th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                { char: "<", code: 60 },
                { char: ">", code: 62 },
                { char: "&", code: 38 },
                { char: '"', code: 34 },
                { char: "'", code: 39 },
                { char: "©", code: 169 },
                { char: "®", code: 174 },
                { char: "™", code: 8482 },
                { char: "€", code: 8364 },
                { char: "£", code: 163 },
                { char: "—", code: 8212 },
                { char: "…", code: 8230 },
              ].map(({ char, code }) => (
                <tr
                  key={char}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-1.5 pr-4 text-foreground font-bold text-base leading-none">
                    {char}
                  </td>
                  <td className="py-1.5 pr-4 text-brand">
                    {NAMED_ENTITIES[char] ?? "—"}
                  </td>
                  <td className="py-1.5 pr-4 text-muted-foreground">
                    &amp;#{code};
                  </td>
                  <td className="py-1.5 text-muted-foreground">
                    &amp;#x{code.toString(16).toUpperCase()};
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
