import type { Bank, DepositInfo } from "@/types/bank"

// ── Comprehensive US Bank List ────────────────────────────────────────────────
// Covers all major national, regional, online-only, credit unions, and
// community banks that participate in the Zelle network.

export const mockBanks: Bank[] = [
  // ── National "Big Banks" ──────────────────────────────────────────────────
  { id: "chase",          name: "Chase",                    logo: "/banks/chase.png",          loginUrl: "https://www.chase.com/personal/banking/online-banking" },
  { id: "bofa",           name: "Bank of America",          logo: "/banks/bofa.png",           loginUrl: "https://www.bankofamerica.com" },
  { id: "wellsfargo",     name: "Wells Fargo",              logo: "/banks/wellsfargo.png",     loginUrl: "https://connect.secure.wellsfargo.com/auth/login" },
  { id: "citi",           name: "Citibank",                 logo: "/banks/citi.png",           loginUrl: "https://online.citi.com/US/login.do" },
  { id: "usbank",         name: "U.S. Bank",                logo: "/banks/usbank.png",         loginUrl: "https://onlinebanking.usbank.com" },
  { id: "pnc",            name: "PNC Bank",                 logo: "/banks/pnc.png",            loginUrl: "https://www.pnc.com" },
  { id: "truist",         name: "Truist Bank",              logo: "/banks/truist.png",         loginUrl: "https://www.truist.com" },
  { id: "capitalone",     name: "Capital One",              logo: "/banks/capitalone.png",     loginUrl: "https://www.capitalone.com" },
  { id: "goldman",        name: "Goldman Sachs",            logo: "/banks/goldman.png",        loginUrl: "https://www.goldmansachs.com" },
  { id: "tdbank",         name: "TD Bank",                  logo: "/banks/tdbank.png",         loginUrl: "https://www.tdbank.com" },

  // ── Online-Only & Neobanks ────────────────────────────────────────────────
  { id: "ally",           name: "Ally Bank",                logo: "/banks/ally.png",           loginUrl: "https://www.ally.com" },
  { id: "discover",       name: "Discover Bank",            logo: "/banks/discover.png",       loginUrl: "https://www.discover.com/online-banking" },
  { id: "sofi",           name: "SoFi Bank",                logo: "/banks/sofi.png",           loginUrl: "https://www.sofi.com/banking" },
  { id: "chime",          name: "Chime",                    logo: "/banks/chime.png",          loginUrl: "https://app.chime.com" },
  { id: "varo",           name: "Varo Bank",                logo: "/banks/varo.png",           loginUrl: "https://www.varomoney.com" },
  { id: "current",        name: "Current",                  logo: "/banks/current.png",        loginUrl: "https://current.com" },
  { id: "aspiration",     name: "Aspiration",               logo: "/banks/aspiration.png",     loginUrl: "https://www.aspiration.com" },
  { id: "marcus",         name: "Marcus by Goldman Sachs",  logo: "/banks/marcus.png",         loginUrl: "https://www.marcus.com" },
  { id: "axos",           name: "Axos Bank",                logo: "/banks/axos.png",           loginUrl: "https://www.axosbank.com" },
  { id: "quontic",        name: "Quontic Bank",             logo: "/banks/quontic.png",        loginUrl: "https://www.quonticbank.com" },
  { id: "nbkc",           name: "nbkc bank",                logo: "/banks/nbkc.png",           loginUrl: "https://www.nbkc.com" },
  { id: "liveoak",        name: "Live Oak Bank",            logo: "/banks/liveoak.png",        loginUrl: "https://www.liveoakbank.com" },
  { id: "synchrony",      name: "Synchrony Bank",           logo: "/banks/synchrony.png",      loginUrl: "https://www.synchronybank.com" },
  { id: "breadfinancial", name: "Bread Financial",          logo: "/banks/breadfinancial.png", loginUrl: "https://www.breadfinancial.com" },

  // ── Regional Banks ────────────────────────────────────────────────────────
  { id: "regions",        name: "Regions Bank",             logo: "/banks/regions.png",        loginUrl: "https://www.regions.com" },
  { id: "fifththird",     name: "Fifth Third Bank",         logo: "/banks/fifththird.png",     loginUrl: "https://www.53.com" },
  { id: "keybank",        name: "KeyBank",                  logo: "/banks/keybank.png",        loginUrl: "https://www.key.com" },
  { id: "huntington",     name: "Huntington Bank",          logo: "/banks/huntington.png",     loginUrl: "https://www.huntington.com" },
  { id: "mtbank",         name: "M&T Bank",                 logo: "/banks/mtbank.png",         loginUrl: "https://www.mtb.com" },
  { id: "citizens",       name: "Citizens Bank",            logo: "/banks/citizens.png",       loginUrl: "https://www.citizensbank.com" },
  { id: "bmoharris",      name: "BMO Harris Bank",          logo: "/banks/bmoharris.png",      loginUrl: "https://www.bmoharris.com" },
  { id: "comerica",       name: "Comerica Bank",            logo: "/banks/comerica.png",       loginUrl: "https://www.comerica.com" },
  { id: "zions",          name: "Zions Bank",               logo: "/banks/zions.png",          loginUrl: "https://www.zionsbank.com" },
  { id: "synovus",        name: "Synovus Bank",             logo: "/banks/synovus.png",        loginUrl: "https://www.synovus.com" },
  { id: "firsthorizon",   name: "First Horizon Bank",       logo: "/banks/firsthorizon.png",   loginUrl: "https://www.firsthorizon.com" },
  { id: "westernaliance", name: "Western Alliance Bank",    logo: "/banks/westernaliance.png", loginUrl: "https://www.westernalliancebancorporation.com" },
  { id: "umpqua",         name: "Umpqua Bank",              logo: "/banks/umpqua.png",         loginUrl: "https://www.umpquabank.com" },
  { id: "firstnational",  name: "First National Bank",      logo: "/banks/firstnational.png",  loginUrl: "https://www.fnb-online.com" },
  { id: "webster",        name: "Webster Bank",             logo: "/banks/webster.png",        loginUrl: "https://www.websterbank.com" },
  { id: "eastwestbank",   name: "East West Bank",           logo: "/banks/eastwestbank.png",   loginUrl: "https://www.eastwestbank.com" },
  { id: "flagstar",       name: "Flagstar Bank",            logo: "/banks/flagstar.png",       loginUrl: "https://www.flagstar.com" },
  { id: "prosperity",     name: "Prosperity Bank",          logo: "/banks/prosperity.png",     loginUrl: "https://www.prosperitybanktx.com" },
  { id: "cullen",         name: "Cullen/Frost Bankers",     logo: "/banks/cullen.png",         loginUrl: "https://www.frostbank.com" },
  { id: "heartland",      name: "Heartland Financial",      logo: "/banks/heartland.png",      loginUrl: "https://www.htlf.com" },
  { id: "pacwest",        name: "PacWest Bancorp",          logo: "/banks/pacwest.png",        loginUrl: "https://www.pacwestbancorp.com" },
  { id: "independent",    name: "Independent Bank",         logo: "/banks/independent.png",    loginUrl: "https://www.ibtx.com" },
  { id: "glacier",        name: "Glacier Bancorp",          logo: "/banks/glacier.png",        loginUrl: "https://www.glacierbancorp.com" },
  { id: "bankunited",     name: "BankUnited",               logo: "/banks/bankunited.png",     loginUrl: "https://www.bankunited.com" },
  { id: "centerstate",    name: "CenterState Bank",         logo: "/banks/centerstate.png",    loginUrl: "https://www.centerstatebank.com" },

  // ── Credit Unions ─────────────────────────────────────────────────────────
  { id: "navyfcu",        name: "Navy Federal Credit Union",logo: "/banks/navyfcu.png",        loginUrl: "https://www.navyfederal.org" },
  { id: "penfed",         name: "PenFed Credit Union",      logo: "/banks/penfed.png",         loginUrl: "https://www.penfed.org" },
  { id: "schoolsfirst",   name: "SchoolsFirst FCU",         logo: "/banks/schoolsfirst.png",   loginUrl: "https://www.schoolsfirstfcu.org" },
  { id: "golden1",        name: "Golden 1 Credit Union",    logo: "/banks/golden1.png",        loginUrl: "https://www.golden1.com" },
  { id: "alliant",        name: "Alliant Credit Union",     logo: "/banks/alliant.png",        loginUrl: "https://www.alliantcreditunion.org" },
  { id: "starone",        name: "Star One Credit Union",    logo: "/banks/starone.png",        loginUrl: "https://www.starone.org" },
  { id: "americafirst",   name: "America First Credit Union", logo: "/banks/americafirst.png", loginUrl: "https://www.americafirst.com" },
  { id: "becu",           name: "BECU",                     logo: "/banks/becu.png",           loginUrl: "https://www.becu.org" },
  { id: "suncoast",       name: "Suncoast Credit Union",    logo: "/banks/suncoast.png",       loginUrl: "https://www.suncoastcreditunion.com" },
  { id: "digitalfcu",     name: "Digital Federal CU",       logo: "/banks/digitalfcu.png",     loginUrl: "https://www.dcu.org" },
  { id: "firsttech",      name: "First Tech Federal CU",    logo: "/banks/firsttech.png",      loginUrl: "https://www.firsttechfed.com" },
  { id: "securityservice",name: "Security Service FCU",     logo: "/banks/securityservice.png",loginUrl: "https://www.ssfcu.org" },
  { id: "connex",         name: "Connex Credit Union",      logo: "/banks/connex.png",         loginUrl: "https://www.connexcu.org" },
  { id: "achieva",        name: "Achieva Credit Union",     logo: "/banks/achieva.png",        loginUrl: "https://www.achievacu.com" },
  { id: "randolph",       name: "Randolph-Brooks FCU",      logo: "/banks/randolph.png",       loginUrl: "https://www.rbfcu.org" },
  { id: "secu",           name: "SECU Credit Union",        logo: "/banks/secu.png",           loginUrl: "https://www.secumd.org" },
  { id: "tiaa",           name: "TIAA Bank",                logo: "/banks/tiaa.png",           loginUrl: "https://www.tiaabank.com" },
  { id: "tdecu",          name: "TDECU",                    logo: "/banks/tdecu.png",          loginUrl: "https://www.tdecu.org" },

  // ── Community & Savings Banks ─────────────────────────────────────────────
  { id: "newalliance",    name: "New Alliance Bank",        logo: "/banks/newalliance.png",    loginUrl: "https://www.newalliance.com" },
  { id: "firstcitizens",  name: "First Citizens Bank",      logo: "/banks/firstcitizens.png",  loginUrl: "https://www.firstcitizens.com" },
  { id: "bannerbank",     name: "Banner Bank",              logo: "/banks/bannerbank.png",     loginUrl: "https://www.bannerbank.com" },
  { id: "southstate",     name: "South State Bank",         logo: "/banks/southstate.png",     loginUrl: "https://www.southstatebank.com" },
  { id: "renasant",       name: "Renasant Bank",            logo: "/banks/renasant.png",       loginUrl: "https://www.renasantbank.com" },
  { id: "brookline",      name: "Brookline Bank",           logo: "/banks/brookline.png",      loginUrl: "https://www.brooklinebank.com" },
  { id: "northbrook",     name: "Northbrook Bank",          logo: "/banks/northbrook.png",     loginUrl: "https://www.northbrookbank.com" },
  { id: "centralbank",    name: "Central Bank",             logo: "/banks/centralbank.png",    loginUrl: "https://www.centralbank.net" },
  { id: "crossriver",     name: "Cross River Bank",         logo: "/banks/crossriver.png",     loginUrl: "https://www.crossriverbank.com" },
  { id: "patriot",        name: "Patriot Bank",             logo: "/banks/patriot.png",        loginUrl: "https://www.bankpatriot.com" },
  { id: "webbank",        name: "WebBank",                  logo: "/banks/webbank.png",        loginUrl: "https://www.webbank.com" },
  { id: "cit",            name: "CIT Bank",                 logo: "/banks/cit.png",            loginUrl: "https://www.cit.com" },
]

// ── Mock deposit info (used by deposit-portal before Supabase lookup) ─────────
export const mockDeposit: DepositInfo = {
  recipientName: "Valued Client",
  amount:        100000,
  currency:      "USD",
  expiryDate:    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  }),
  referenceNumber: "ZELLE-PENDING",
  institutionName: "Zelle Network",
  institutionLogoUrl: "/zelle-logo.png",
  securityQuestion: "What is the name of your first pet?",
  depositInstructions: [
    "Click the secure deposit button in your email",
    "Select your US bank from the list",
    "Sign in to your bank and authorize the deposit",
    "Funds will be credited within minutes",
  ],
}
