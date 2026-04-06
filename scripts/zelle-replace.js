import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join, extname, resolve } from "path"

// Try the v0 project directory
const ROOT = "/vercel/share/v0-project"
console.log("[v0] Scanning root:", ROOT)

// Files/dirs to skip
const SKIP_DIRS = ["node_modules", ".next", ".git", "scripts", "user_read_only_context"]
const SKIP_FILES = [
  "zelle-replace.js",
  // Already-converted zelle files that should keep zelle naming
  "zelle-email-layout.tsx",
  "zelle-header.tsx",
  "zelle-footer.tsx",
  "render-zelle-email.tsx",
  "mockZelleService.ts",
  "zelle.ts",
  "state.ts",
]

// Ordered replacement pairs: [find, replace]
// Order matters — more specific strings first
const REPLACEMENTS = [
  // Color: yellow → purple (all variants)
  ["#FDB913/8",        "#6D1ED4/8"],
  ["#FDB913/5",        "#6D1ED4/5"],
  ["#FDB913/4",        "#6D1ED4/4"],
  ["#FDB913/3",        "#6D1ED4/3"],
  ["#FDB913/2",        "#6D1ED4/2"],
  ["#FDB913/15",       "#6D1ED4/15"],
  ["#FDB913/10",       "#6D1ED4/10"],
  ["#FDB913/20",       "#6D1ED4/20"],
  ["#FDB913/25",       "#6D1ED4/25"],
  ["#FDB913/30",       "#6D1ED4/30"],
  ["#FDB913/40",       "#6D1ED4/40"],
  ["#FDB913/50",       "#6D1ED4/50"],
  ["#FDB913/60",       "#6D1ED4/60"],
  ["#FDB913/70",       "#6D1ED4/70"],
  ["#FDB913",          "#6D1ED4"],
  ["#e5a811",          "#5A18B0"],
  ["#fdb913",          "#6D1ED4"],
  // Interac → Zelle brand text
  ["Interac e&#8209;Transfer",  "Zelle"],
  ["Interac e-Transfer",        "Zelle Payment"],
  ["e&#8209;Transfer",          "Zelle payment"],
  ["e-Transfer",                "Zelle payment"],
  ["Interac Partner Network",   "Zelle Disbursement Portal"],
  ["Partner Network",           "Zelle Portal"],
  ["Interac Fee: Free",         "Zelle Fee: Free"],
  ["No Interac fee",            "No Zelle fee"],
  ["Interac&apos;s",            "Zelle&apos;s"],
  ["Interac's",                 "Zelle's"],
  ["Interac to debit",          "Zelle to debit"],
  ["Interac",                   "Zelle"],
  // CAD → USD currency
  ["currency: \"CAD\"",         "currency: \"USD\""],
  ["currency: 'CAD'",           "currency: 'USD'"],
  ["en-CA",                     "en-US"],
  ["Amount (CAD)",              "Amount (USD)"],
  ["CAD &middot;",              "USD &middot;"],
  [" CAD ",                     " USD "],
  ["\"CAD\"",                   "\"USD\""],
  ["'CAD'",                     "'USD'"],
  ["CA$",                       "$"],
  // Chequing → Checking
  ["Chequing ••••4521",         "Checking ••••4521"],
  ["Chequing",                  "Checking"],
  ["chequing",                  "checking"],
  ["CHEQUING_CAD",              "CHECKING_USD"],
  ["CHEQUING_USD",              "CHECKING_USD"],
  // Ledger labels
  ["SAVINGS_CAD",               "SAVINGS_USD"],
  ["THRESHOLD_CAD",             "THRESHOLD_USD"],
  // logo image references
  ["https://etransfer-notification.interac.ca/images/new/interac_logo.png", ""],
  ["alt=\"Interac Logo\"",      "alt=\"Zelle Logo\""],
  ["alt=\"Interac\"",           "alt=\"Zelle\""],
  // INTC reference prefix
  ["INTC-",                     "ZELLE-"],
  // API routes
  ["/api/send-interac",         "/api/send-zelle"],
  ["/api/interac",              "/api/zelle"],
  // text labels
  ["Send e-Transfer",           "Send Payment"],
  ["Send Interac",              "Send Zelle"],
  ["Interac logo",              "Zelle logo"],
  ["JP Morgan FX",              "Zelle Network"],
  ["JP Morgan Payments Portal", "Zelle Payments Portal"],
  ["JP Morgan",                 "Zelle Network"],
  ["JPM_EXCHANGE_RATE",         "1"],
  ["JPM_IMPORT_DATE",           "\"\""],
  // Button text: black text on purple bg (was on yellow)
  ["text-[#1a1a1a]",            "text-white"],
  ["text-black font-bold",      "text-white font-bold"],
  ["text-black font-semibold",  "text-white font-semibold"],
  ["text-black hover:",         "text-white hover:"],
  // Canada → US
  ["Canada",                    "the United States"],
  ["anyone in Canada",          "anyone in the U.S."],
  ["CDIC",                      "FDIC"],
  // formatCAD → formatUSD
  ["formatCAD(",                "formatUSD("],
  // noreply email
  ["noreply@interac.ca",        "noreply@zellepay.com"],
  // send-interac API import
  ["send-interac",              "send-zelle"],
  // interac import paths that haven't been renamed yet
  ["interac-email-layout",      "zelle-email-layout"],
  ["InteracEmailLayout",        "ZelleEmailLayout"],
  ["interac-header",            "zelle-header"],
  ["interac-footer",            "zelle-footer"],
  ["render-interac-email",      "render-zelle-email"],
]

function getAllFiles(dir) {
  const results = []
  let entries
  try { entries = readdirSync(dir) } catch { return results }
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry)) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      results.push(...getAllFiles(full))
    } else {
      const ext = extname(entry)
      if ([".ts", ".tsx", ".css", ".json"].includes(ext) && !SKIP_FILES.includes(entry)) {
        results.push(full)
      }
    }
  }
  return results
}

let totalFiles = 0
let totalChanges = 0

const allFiles = getAllFiles(ROOT)
console.log("[v0] Total files found:", allFiles.length)
if (allFiles.length > 0) console.log("[v0] First 5:", allFiles.slice(0, 5))

for (const file of allFiles) {
  let content = readFileSync(file, "utf8")
  let changed = false

  for (const [find, replace] of REPLACEMENTS) {
    if (content.includes(find)) {
      // Replace ALL occurrences
      content = content.split(find).join(replace)
      changed = true
    }
  }

  if (changed) {
    writeFileSync(file, content, "utf8")
    totalFiles++
    console.log(`[v0] Updated: ${file.replace(ROOT, "")}`)
  }
}

console.log(`[v0] Done — updated ${totalFiles} files with ${REPLACEMENTS.length} replacement rules`)
