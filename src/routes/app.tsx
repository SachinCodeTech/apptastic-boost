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

function safeFileName(value: string) {
  return (value || "Ramanujan").trim().replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "") || "Ramanujan";
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

async function buildShareCardCanvas(opts: {
  name: string;
  birthday: string;
  square: number[][];
  total: number;
}): Promise<HTMLCanvasElement> {
  if (document.fonts?.ready) await document.fonts.ready.catch(() => undefined);
  const { name, birthday, square, total } = opts;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create share card.");

  ctx.fillStyle = "#f7f5ef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawRoundRect(ctx, 70, 70, 940, 1210, 42);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#e6dfd2";
  ctx.lineWidth = 3;
  ctx.stroke();

  drawRoundRect(ctx, 112, 112, 64, 64, 16);
  ctx.fillStyle = "#0b5cab";
  ctx.fill();
  drawCenteredText(ctx, "R", 144, 144, "700 30px Georgia, serif", "#ffffff");
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "500 28px Georgia, serif";
  ctx.fillStyle = "#14213d";
  ctx.fillText("Ramanujan Magic Square", 196, 144);

  drawCenteredText(ctx, `${name || "Your"} Magic Square`, 540, 275, "500 58px Georgia, serif", "#14213d");
  drawCenteredText(ctx, birthday || "dd-mm-yyyy", 540, 334, "500 28px Arial, sans-serif", "#64748b");

  const gridX = 150;
  const gridY = 410;
  const gridSize = 780;
  const gap = 18;
  const cell = (gridSize - gap * 3) / 4;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const x = gridX + j * (cell + gap);
      const y = gridY + i * (cell + gap);
      drawRoundRect(ctx, x, y, cell, cell, 22);
      ctx.fillStyle = i === 0 ? "#fde68a" : "#f1f5f9";
      ctx.fill();
      ctx.strokeStyle = i === 0 ? "#f59e0b" : "#e2e8f0";
      ctx.lineWidth = 3;
      ctx.stroke();
      drawCenteredText(ctx, String(square[i][j]), x + cell / 2, y + cell / 2, "600 58px Georgia, serif", "#0f172a");
    }
  }

  drawCenteredText(ctx, "BIRTHDAY TOTAL", 540, 1062, "700 24px Arial, sans-serif", "#64748b");
  drawCenteredText(ctx, String(total), 540, 1130, "700 82px Georgia, serif", "#1f3a8a");
  drawCenteredText(ctx, "RAMANUJAN MAGIC SQUARE · CODETECH", 540, 1220, "700 22px Arial, sans-serif", "#94a3b8");
  drawCenteredText(ctx, "Lead Developer: Sachin Sheth", 540, 1258, "500 20px Arial, sans-serif", "#64748b");

  return canvas;
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not create image file."));
    }, "image/png");
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.target = "_blank";
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

async function shareOrDownload(file: File, shareData: { title: string; text: string }) {
  const nav = typeof navigator !== "undefined" ? (navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  }) : null;

  let isFramed = false;
  try {
    isFramed = typeof window !== "undefined" && window.self !== window.top;
  } catch {
    isFramed = true;
  }

  const canShareFiles = !!nav?.share && !isFramed && (
    typeof nav.canShare !== "function" || nav.canShare({ files: [file] })
  );

  if (canShareFiles && nav?.share) {
    try {
      await nav.share({ ...shareData, files: [file] });
      return "shared" as const;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled" as const;
    }
  }
  downloadBlob(file, file.name);
  return "downloaded" as const;
}

type PreparedShareFiles = {
  key: string;
  image: File;
  pdf: File;
};

function getShareKey(opts: { name: string; birthday: string; square: number[][]; total: number }) {
  return JSON.stringify(opts);
}

async function createShareFiles(opts: {
  key: string;
  name: string;
  birthday: string;
  square: number[][];
  total: number;
}): Promise<PreparedShareFiles> {
  const [{ jsPDF }, canvas] = await Promise.all([
    import("jspdf"),
    buildShareCardCanvas(opts),
  ]);

  const imageBlob = await canvasToPngBlob(canvas);
  const image = new File([imageBlob], `${safeFileName(opts.name)}_MagicSquare.png`, { type: "image/png" });

  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
  const pdfBlob: Blob = pdf.output("blob");
  const pdfFile = new File([pdfBlob], `${safeFileName(opts.name)}_MagicSquare_${opts.birthday || "card"}.pdf`, { type: "application/pdf" });

  return { key: opts.key, image, pdf: pdfFile };
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
  const [exportMessage, setExportMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isPreparingExport, setIsPreparingExport] = useState(false);
  const [preparedShareFiles, setPreparedShareFiles] = useState<PreparedShareFiles | null>(null);
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
    setExportMessage("");
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

  const currentShareKey = square && total !== null
    ? getShareKey({ name, birthday, square, total })
    : "";

  useEffect(() => {
    let active = true;
    if (!square || total === null || !currentShareKey) {
      setPreparedShareFiles(null);
      setIsPreparingExport(false);
      return () => { active = false; };
    }

    setPreparedShareFiles(null);
    setIsPreparingExport(true);
    createShareFiles({ key: currentShareKey, name, birthday, square, total })
      .then((files) => {
        if (active) setPreparedShareFiles(files);
      })
      .catch(() => {
        if (active) setExportMessage("Share card could not be prepared. Please regenerate and try again.");
      })
      .finally(() => {
        if (active) setIsPreparingExport(false);
      });

    return () => { active = false; };
  }, [birthday, currentShareKey, name, square, total]);

  function clearAll() {
    stopCycling();
    setName(""); setBirthday(""); setSquare(null); setTotal(null);
    setVerified([]); setError(""); setPatternLabel(""); setExportMessage("");
    setPreparedShareFiles(null); setIsPreparingExport(false);
  }

  async function getPreparedFiles() {
    if (!square || total === null || !currentShareKey) return null;
    if (preparedShareFiles?.key === currentShareKey) return preparedShareFiles;
    const files = await createShareFiles({ key: currentShareKey, name, birthday, square, total });
    setPreparedShareFiles(files);
    return files;
  }

  async function shareAsPdf() {
    if (!square || total === null) return;
    setIsExporting(true);
    setExportMessage("");
    try {
      const files = await getPreparedFiles();
      if (!files) return;
      const result = await shareOrDownload(files.pdf, {
        title: `${name || "My"} Magic Square`,
        text: `My personal Ramanujan magic square — total ${total}. Made with Ramanujan Magic Square by CodeTech.`,
      });
      setExportMessage(result === "shared" ? "PDF shared successfully." : result === "downloaded" ? "PDF saved. Open it from downloads to share." : "PDF share cancelled.");
    } catch {
      setExportMessage("PDF export failed. Please try Share Image instead.");
    } finally {
      setIsExporting(false);
    }
  }

  async function shareAsImage() {
    if (!square || total === null) return;
    setIsExporting(true);
    setExportMessage("");
    try {
      const files = await getPreparedFiles();
      if (!files) return;
      const result = await shareOrDownload(files.image, {
        title: `${name || "My"} Magic Square`,
        text: `My Ramanujan magic square — total ${total}.`,
      });
      setExportMessage(result === "shared" ? "Image shared successfully." : result === "downloaded" ? "Image saved. Open it from downloads to share." : "Image share cancelled.");
    } catch {
      setExportMessage("Image export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
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
        {exportMessage && <p className="text-sm font-medium text-muted-foreground">{exportMessage}</p>}

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
          <button onClick={shareAsPdf} disabled={!hasSquare || isExporting || isPreparingExport}
            className="inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            style={{ background: "var(--gradient-accent)" }}>
            {isExporting || isPreparingExport ? "Preparing..." : "Share PDF"}
          </button>
          <button onClick={shareAsImage} disabled={!hasSquare || isExporting || isPreparingExport}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-secondary disabled:opacity-40">
            {isPreparingExport ? "Preparing..." : "Share Image"}
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