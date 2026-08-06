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

  drawRoundRect(ctx, 70, 70, 940, 1260, 42);
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

  const gridX = 190;
  const gridY = 386;
  const gridSize = 700;
  const gap = 16;
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
      drawCenteredText(ctx, String(square[i][j]), x + cell / 2, y + cell / 2, "600 54px Georgia, serif", "#0f172a");
    }
  }

  drawCenteredText(ctx, "BIRTHDAY TOTAL", 540, 1122, "700 23px Arial, sans-serif", "#64748b");
  drawCenteredText(ctx, String(total), 540, 1184, "700 68px Georgia, serif", "#1f3a8a");
  drawCenteredText(ctx, "RAMANUJAN MAGIC SQUARE · CODETECH", 540, 1252, "700 19px Arial, sans-serif", "#94a3b8");
  drawCenteredText(ctx, "Lead Developer: Sachin Sheth", 540, 1284, "500 17px Arial, sans-serif", "#64748b");

  return canvas;
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not create image file."));
      }, "image/png");
      return;
    }

    try {
      const binary = atob(canvas.toDataURL("image/png").split(",")[1] || "");
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      resolve(new Blob([bytes], { type: "image/png" }));
    } catch {
      reject(new Error("Could not create image file."));
    }
  });
}

function makeShareFile(parts: BlobPart[], fileName: string, type: string) {
  if (typeof File === "function") {
    return new File(parts, fileName, { type, lastModified: Date.now() });
  }

  return Object.assign(new Blob(parts, { type }), {
    name: fileName,
    lastModified: Date.now(),
  }) as File;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return "downloaded" as const;
}

function isEmbeddedWindow() {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function openOrDownloadBlob(blob: Blob, fileName: string) {
  const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // iOS ignores `download` for many Blob URLs. The Lovable preview is also an
  // iframe, where browsers block Web Share. Opening the generated card keeps a
  // dependable one-tap path to the browser's Share/Save controls in both cases.
  if (isAppleMobile || isEmbeddedWindow()) {
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (opened) {
      window.setTimeout(() => URL.revokeObjectURL(url), 5 * 60_000);
      return "opened" as const;
    }
    URL.revokeObjectURL(url);
  }

  downloadBlob(blob, fileName);
  return "downloaded" as const;
}

function getShareNavigator() {
  return typeof navigator !== "undefined" ? (navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  }) : null;
}

function canNativeShareFile(file: File) {
  const nav = getShareNavigator();
  if (!nav?.share) return false;
  if (typeof window !== "undefined" && window.isSecureContext === false) return false;
  if (isEmbeddedWindow()) return false;
  // Safari versions that implement file sharing do not all implement
  // navigator.canShare. In that case, navigator.share is the capability check.
  if (typeof nav.canShare !== "function") return true;

  try {
    return nav.canShare({ files: [file] });
  } catch {
    return false;
  }
}

function shareOrDownload(
  file: File,
  shareData: { title: string; text: string },
  callbacks: { onShared: () => void; onCancelled: () => void; onDownloaded: () => void; onOpened: () => void },
  nativeFallback?: { file: File; onShared: () => void },
) {
  const nav = getShareNavigator();
  if (!nav?.share || isEmbeddedWindow()) {
    const result = openOrDownloadBlob(file, file.name);
    if (result === "opened") callbacks.onOpened();
    else callbacks.onDownloaded();
    return;
  }

  const nativeFile = canNativeShareFile(file)
    ? file
    : nativeFallback && canNativeShareFile(nativeFallback.file)
      ? nativeFallback.file
      : null;

  if (!nativeFile) {
    const result = openOrDownloadBlob(file, file.name);
    if (result === "opened") callbacks.onOpened();
    else callbacks.onDownloaded();
    return;
  }

  // This call intentionally happens synchronously in the click event. Awaiting
  // any file-generation promise first loses transient activation in Safari.
  try {
    const shareResult = nav.share({ ...shareData, files: [nativeFile] });
    void shareResult.then(
      nativeFile === file ? callbacks.onShared : nativeFallback?.onShared ?? callbacks.onShared,
    ).catch((err: unknown) => {
      const errorName = err instanceof DOMException ? err.name : (err as { name?: string })?.name;
      if (errorName === "AbortError") {
        callbacks.onCancelled();
        return;
      }
      const result = openOrDownloadBlob(file, file.name);
      if (result === "opened") callbacks.onOpened();
      else callbacks.onDownloaded();
    });
  } catch {
    const result = openOrDownloadBlob(file, file.name);
    if (result === "opened") callbacks.onOpened();
    else callbacks.onDownloaded();
  }
}

type PreparedShareFiles = {
  image: File;
  pdf: File;
};

async function createShareFiles(opts: {
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
  const image = makeShareFile([imageBlob], `${safeFileName(opts.name)}_MagicSquare.png`, "image/png");

  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
  const pdfBlob: Blob = pdf.output("blob");
  const pdfFile = makeShareFile([pdfBlob], `${safeFileName(opts.name)}_MagicSquare_${opts.birthday || "card"}.pdf`, "application/pdf");

  return { image, pdf: pdfFile };
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
  const [exportingKind, setExportingKind] = useState<"pdf" | "image" | null>(null);
  const [shareFilesReady, setShareFilesReady] = useState(false);
  const cycleIdx = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const preparedFilesRef = useRef<PreparedShareFiles | null>(null);

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

  useEffect(() => {
    if (!square || total === null) {
      preparedFilesRef.current = null;
      setShareFilesReady(false);
      return;
    }

    let active = true;
    preparedFilesRef.current = null;
    setShareFilesReady(false);
    void createShareFiles({ name, birthday, square, total }).then((files) => {
      if (!active) return;
      preparedFilesRef.current = files;
      setShareFilesReady(true);
    }).catch(() => {
      if (!active) return;
      preparedFilesRef.current = null;
      setShareFilesReady(false);
      setExportMessage("Could not prepare share cards. Please generate again.");
    });
    return () => { active = false; };
  }, [name, birthday, square, total]);

  function clearAll() {
    stopCycling();
    setName(""); setBirthday(""); setSquare(null); setTotal(null);
    setVerified([]); setError(""); setPatternLabel(""); setExportMessage("");
    setExportingKind(null);
    setShareFilesReady(false);
  }

  function finishExport(message: string) {
    setExportMessage(message);
    setIsExporting(false);
    setExportingKind(null);
  }

  function shareAsPdf() {
    if (!square || total === null || !preparedFilesRef.current) return;
    const { pdf: file, image } = preparedFilesRef.current;
    const willSharePdf = canNativeShareFile(file);
    const willShareImage = !willSharePdf && canNativeShareFile(image);
    setIsExporting(true);
    setExportingKind("pdf");
    setExportMessage(
      willSharePdf
        ? "Opening PDF share sheet…"
        : willShareImage
          ? "PDF sharing is unavailable here. Opening the image share sheet instead…"
          : "Saving PDF card…",
    );
    shareOrDownload(file, {
      title: `${name || "My"} Magic Square`,
      text: `My personal Ramanujan magic square — total ${total}. Made with Ramanujan Magic Square by CodeTech.`,
    }, {
      onShared: () => finishExport("PDF shared successfully."),
      onCancelled: () => finishExport("PDF share cancelled."),
      onDownloaded: () => finishExport("PDF saved. Open it from downloads to share."),
      onOpened: () => finishExport("PDF card opened. Use the browser Share button to send it."),
    }, {
      file: image,
      onShared: () => finishExport("PDF sharing is unavailable in this browser, so the image card was shared instead."),
    });
  }

  function shareAsImage() {
    if (!square || total === null || !preparedFilesRef.current) return;
    const file = preparedFilesRef.current.image;
    setIsExporting(true);
    setExportingKind("image");
    setExportMessage(canNativeShareFile(file) ? "Opening image share sheet…" : "Saving image card…");
    shareOrDownload(file, {
      title: `${name || "My"} Magic Square`,
      text: `My Ramanujan magic square — total ${total}.`,
    }, {
      onShared: () => finishExport("Image shared successfully."),
      onCancelled: () => finishExport("Image share cancelled."),
      onDownloaded: () => finishExport("Image saved. Open it from downloads to share."),
      onOpened: () => finishExport("Image card opened. Use the browser Share button to send or save it."),
    });
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
          <button onClick={shareAsPdf} disabled={!hasSquare || isExporting || !shareFilesReady}
            className="inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            style={{ background: "var(--gradient-accent)" }}>
            {exportingKind === "pdf" ? "Preparing..." : "Share PDF"}
          </button>
          <button onClick={shareAsImage} disabled={!hasSquare || isExporting || !shareFilesReady}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-secondary disabled:opacity-40">
            {exportingKind === "image" ? "Preparing..." : "Share Image"}
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