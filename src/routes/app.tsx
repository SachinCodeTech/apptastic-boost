import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Generate your Magic Square — Ramanujan Square" },
      { name: "description", content: "Enter your name and birthday to generate a personal Ramanujan 4×4 magic square. Cycle through 21 hidden patterns and share as PDF." },
      { property: "og:title", content: "Generate your Magic Square" },
      { property: "og:description", content: "Personal Ramanujan magic square from your birthday." },
      { property: "og:url", content: "/app" },
    ],
    links: [{ rel: "canonical", href: "/app" }],
  }),
  component: AppPage,
});

function base64ToBlob(dataUrl: string) {
  const [meta, b64] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(meta)?.[1] || "application/octet-stream";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

// html2canvas cannot parse modern color functions (oklch/lab/color-mix) that
// browsers return from getComputedStyle. Build a standalone offscreen card
// using plain hex colors and inline styles so capture always works.
function buildExportNode(opts: {
  name: string;
  birthday: string;
  square: number[][];
  total: number;
}): HTMLDivElement {
  const { name, birthday, square, total } = opts;
  const wrap = document.createElement("div");
  wrap.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    "width:520px",
    "padding:32px",
    "background:#ffffff",
    "color:#0f172a",
    "font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    "border-radius:16px",
    "box-sizing:border-box",
  ].join(";");

  const title = document.createElement("div");
  title.style.cssText = "text-align:center;font-size:24px;font-weight:600;color:#0f172a";
  title.textContent = `${name || "Your"} Magic Square`;
  wrap.appendChild(title);

  const sub = document.createElement("div");
  sub.style.cssText = "text-align:center;font-size:13px;color:#64748b;margin-top:4px";
  sub.textContent = birthday || "dd-mm-yyyy";
  wrap.appendChild(sub);

  const grid = document.createElement("div");
  grid.style.cssText =
    "display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:24px auto 0;max-width:400px";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = document.createElement("div");
      const isTop = i === 0;
      cell.style.cssText = [
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "aspect-ratio:1/1",
        "border-radius:10px",
        "font-size:22px",
        "font-weight:600",
        isTop ? "background:#fde68a" : "background:#f1f5f9",
        isTop ? "border:1px solid #f59e0b" : "border:1px solid #e2e8f0",
        "color:#0f172a",
      ].join(";");
      cell.textContent = String(square[i][j]);
      grid.appendChild(cell);
    }
  }
  wrap.appendChild(grid);

  const totalLabel = document.createElement("div");
  totalLabel.style.cssText =
    "text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#64748b;margin-top:20px";
  totalLabel.textContent = "Birthday Total";
  wrap.appendChild(totalLabel);

  const totalVal = document.createElement("div");
  totalVal.style.cssText =
    "text-align:center;font-size:36px;font-weight:700;color:#1f3a8a;margin-top:4px";
  totalVal.textContent = String(total);
  wrap.appendChild(totalVal);

  const footer = document.createElement("div");
  footer.style.cssText =
    "text-align:center;margin-top:20px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#94a3b8";
  footer.textContent = "Ramanujan Magic Square · CodeTech";
  wrap.appendChild(footer);

  document.body.appendChild(wrap);
  return wrap;
}

type Pattern = { type: string; cells: Array<[number, number]> };

const validPatterns: Pattern[] = [
  { type: "Sub-Square", cells: [[0,0],[0,1],[1,0],[1,1]] },
  { type: "Sub-Square", cells: [[0,2],[0,3],[1,2],[1,3]] },
  { type: "Sub-Square", cells: [[1,0],[1,1],[2,0],[2,1]] },
  { type: "Sub-Square", cells: [[1,1],[1,2],[2,1],[2,2]] },
  { type: "Sub-Square", cells: [[1,2],[1,3],[2,2],[2,3]] },
  { type: "Sub-Square", cells: [[2,0],[2,1],[3,0],[3,1]] },
  { type: "Sub-Square", cells: [[2,2],[2,3],[3,2],[3,3]] },
  { type: "Diagonal", cells: [[0,0],[1,1],[2,2],[3,3]] },
  { type: "Diagonal", cells: [[0,3],[1,2],[2,1],[3,0]] },
  { type: "Row", cells: [[0,0],[0,1],[0,2],[0,3]] },
  { type: "Row", cells: [[1,0],[1,1],[1,2],[1,3]] },
  { type: "Row", cells: [[2,0],[2,1],[2,2],[2,3]] },
  { type: "Row", cells: [[3,0],[3,1],[3,2],[3,3]] },
  { type: "Column", cells: [[0,0],[1,0],[2,0],[3,0]] },
  { type: "Column", cells: [[0,1],[1,1],[2,1],[3,1]] },
  { type: "Column", cells: [[0,2],[1,2],[2,2],[3,2]] },
  { type: "Column", cells: [[0,3],[1,3],[2,3],[3,3]] },
  { type: "Corner", cells: [[0,0],[0,3],[3,0],[3,3]] },
  { type: "Four-Square", cells: [[0,1],[0,2],[3,1],[3,2]] },
  { type: "Four-Square", cells: [[0,1],[1,0],[2,3],[3,2]] },
  { type: "Four-Square", cells: [[0,2],[1,3],[2,0],[3,1]] },
];

function AppPage() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const [square, setSquare] = useState<number[][] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [verified, setVerified] = useState<Pattern[]>([]);
  const [highlight, setHighlight] = useState<Set<string>>(new Set());
  const [patternLabel, setPatternLabel] = useState("");
  const [isCycling, setIsCycling] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cycleIdx = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Birthday input formatting
  function onBirthdayChange(v: string) {
    let value = v.replace(/[^0-9]/g, "");
    if (value.length >= 3) value = `${value.slice(0, 2)}-${value.slice(2)}`;
    if (value.length >= 6) value = `${value.slice(0, 5)}-${value.slice(5)}`;
    setBirthday(value.slice(0, 10));
  }

  function validateDate(dd: number, mm: number, yyyy: number) {
    if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) return false;
    if (dd < 1 || dd > 31) return false;
    if (mm < 1 || mm > 12) return false;
    if (yyyy < 1000 || yyyy > 9999) return false;
    return true;
  }

  function generate() {
    stopCycling();
    const parts = birthday.split("-");
    if (parts.length !== 3) { setError("Use format: dd-mm-yyyy"); return; }
    const DD = parseInt(parts[0]), MM = parseInt(parts[1]), YYYY = parseInt(parts[2]);
    if (!validateDate(DD, MM, YYYY)) { setError("Invalid date. Check day (1-31), month (1-12), year (1000-9999)."); return; }
    setError("");
    const CC = Math.floor(YYYY / 100);
    const YY = YYYY % 100;
    const ms = [
      [DD, MM, CC, YY],
      [YY + 1, CC - 1, MM - 3, DD + 3],
      [MM - 2, DD + 2, YY + 2, CC - 2],
      [CC + 1, YY - 1, DD + 1, MM - 1],
    ];
    const t = DD + MM + CC + YY;
    setSquare(ms);
    setTotal(t);
    setPatternLabel("");
    setHighlight(new Set());
    cycleIdx.current = 0;
    const v = validPatterns.filter(p => p.cells.reduce((a, [x, y]) => a + (ms[x][y] || 0), 0) === t);
    setVerified(v);
    if (v.length === 0) setError("No valid patterns found.");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }

  function step() {
    if (verified.length === 0) return;
    const p = verified[cycleIdx.current];
    setHighlight(new Set(p.cells.map(([x, y]) => `${x}-${y}`)));
    setPatternLabel(`Pattern ${cycleIdx.current + 1} of ${verified.length} (${p.type})`);
    cycleIdx.current = (cycleIdx.current + 1) % verified.length;
  }

  function startCycling() {
    if (verified.length === 0) return;
    setIsCycling(true);
    step();
    intervalRef.current = setInterval(step, 750);
  }
  function stopCycling() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsCycling(false);
    setHighlight(new Set());
    setPatternLabel("");
  }
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  function clearAll() {
    stopCycling();
    setName(""); setBirthday(""); setSquare(null); setTotal(null);
    setVerified([]); setError(""); setPatternLabel("");
  }

  async function shareAsPdf() {
    if (!square || total === null) return;
    const [{ default: html2canvas }, jspdfMod] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const jsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default?.jsPDF;
    const node = buildExportNode({ name, birthday, square, total });
    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff", logging: false });
    } finally {
      node.remove();
    }
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
    const fileName = `${(name || "Ramanujan").replace(/\s+/g, "_")}_MagicSquare_${birthday || "22-12-1887"}.pdf`;
    const pdfBlob: Blob = pdf.output("blob");
    const shareData: any = {
      title: `${name || "My"} Magic Square`,
      text: `My personal Ramanujan magic square — total ${total ?? ""}. Made with Ramanujan Magic Square by CodeTech.`,
    };
    const file = new File([pdfBlob], fileName, { type: "application/pdf" });
    const nav: any = typeof navigator !== "undefined" ? navigator : null;
    if (nav?.canShare && nav.canShare({ files: [file] })) {
      try {
        await nav.share({ ...shareData, files: [file] });
        return;
      } catch { /* fall through to download */ }
    }
    pdf.save(fileName);
  }

  async function shareAsImage() {
    if (!square || total === null) return;
    const { default: html2canvas } = await import("html2canvas");
    const node = buildExportNode({ name, birthday, square, total });
    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff", logging: false });
    } finally {
      node.remove();
    }
    const dataUrl = canvas.toDataURL("image/png");
    const fileName = `${(name || "Ramanujan").replace(/\s+/g, "_")}_MagicSquare.png`;
    const blob = base64ToBlob(dataUrl);
    const file = new File([blob], fileName, { type: "image/png" });
    const nav: any = typeof navigator !== "undefined" ? navigator : null;
    if (nav?.canShare && nav.canShare({ files: [file] })) {
      try {
        await nav.share({
          title: `${name || "My"} Magic Square`,
          text: `My Ramanujan magic square — total ${total ?? ""}.`,
          files: [file],
        });
        return;
      } catch { /* fall through */ }
    }
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  }

  const hasSquare = !!square;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl leading-tight sm:text-5xl">Generate your Magic Square</h1>
        <p className="mt-3 px-2 text-sm text-muted-foreground sm:text-base">Enter your details — everything runs locally in your browser.</p>
      </div>

      <div className="mt-6 grid gap-5 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:mt-10 sm:gap-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Name</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
              placeholder="e.g., Ramanujan"
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Birthday (dd-mm-yyyy)</span>
            <input
              value={birthday}
              onChange={e => onBirthdayChange(e.target.value)}
              maxLength={10}
              placeholder="22-12-1887"
              inputMode="numeric"
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 font-mono text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {showSuccess && <p className="text-sm font-medium" style={{ color: "oklch(0.55 0.18 150)" }}>Magic Square Generated!</p>}

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button onClick={generate}
            className="col-span-2 inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:col-span-1"
            style={{ background: "var(--gradient-hero)" }}>
            Generate
          </button>
          <button onClick={() => isCycling ? stopCycling() : startCycling()} disabled={!hasSquare}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-secondary disabled:opacity-40">
            {isCycling ? "Stop Cycling" : "Cycle Patterns"}
          </button>
          <button onClick={shareAsPdf} disabled={!hasSquare}
            className="inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            style={{ background: "var(--gradient-accent)" }}>
            Share PDF
          </button>
          <button onClick={shareAsImage} disabled={!hasSquare}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-secondary disabled:opacity-40">
            Share Image
          </button>
          <button onClick={clearAll}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-secondary">
            Clear
          </button>
          <button onClick={() => setShowInfo(true)}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-secondary">
            Info
          </button>
        </div>
      </div>

      {/* The square (exportable region) */}
      <div ref={exportRef} className="mt-6 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:mt-8 sm:p-8">
        <div className="text-center">
          <p className="font-display text-xl sm:text-2xl">{name || "Your"} Magic Square</p>
          <p className="text-xs text-muted-foreground sm:text-sm">{birthday || "dd-mm-yyyy"}</p>
        </div>
        <div className="mx-auto mt-5 grid aspect-square w-full max-w-[22rem] grid-cols-4 gap-1.5 sm:mt-6 sm:max-w-sm">
          {Array.from({ length: 4 }).flatMap((_, i) =>
            Array.from({ length: 4 }).map((_, j) => {
              const key = `${i}-${j}`;
              const value = square ? square[i][j] : null;
              const isFirstRow = i === 0 && hasSquare;
              const isHi = highlight.has(key);
              return (
                <div
                  key={key}
                  className={
                    "flex items-center justify-center rounded-lg font-display text-lg transition-all duration-300 sm:text-2xl " +
                    (isHi
                      ? "scale-105 text-foreground shadow-md"
                      : isFirstRow
                      ? "text-foreground"
                      : "bg-secondary text-foreground")
                  }
                  style={
                    isHi
                      ? { background: "var(--gradient-accent)" }
                      : isFirstRow
                      ? { background: "oklch(0.92 0.06 80)", border: "1px solid oklch(0.78 0.14 70)" }
                      : undefined
                  }
                >
                  {value ?? "–"}
                </div>
              );
            })
          )}
        </div>
        {total !== null && (
          <div className="mt-5 flex flex-col items-center gap-1 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">Birthday Total</p>
            <p className="font-display text-3xl sm:text-4xl">{total}</p>
            {patternLabel && <p className="mt-1 text-xs font-medium text-accent-foreground">{patternLabel}</p>}
            <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground/70">Ramanujan Magic Square · CodeTech</p>
          </div>
        )}
      </div>

      {/* Info modal */}
      {showInfo && (
        <div onClick={() => setShowInfo(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
          <div onClick={e => e.stopPropagation()}
            className="relative max-w-md rounded-2xl bg-card p-6 shadow-2xl">
            <button onClick={() => setShowInfo(false)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">✕</button>
            <h2 className="font-display text-2xl">Ramanujan's Magic Square</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Srinivasa Ramanujan's 4×4 magic square, based on his birth date (22-12-1887),
              is a remarkable construct where rows, columns, diagonals, sub-squares, corners,
              and many other four-cell patterns all sum to 139 — a small monument to his
              genius in number theory.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}