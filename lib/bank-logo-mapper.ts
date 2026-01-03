/**
 * Maps financial institution IDs to their logo file paths
 * Returns the logo path if available, or null for fallback
 */
export function getBankLogoPath(institutionId: string): string | null {
  // Map of institution IDs to their logo file paths in /public
  const logoMap: Record<string, string> = {
    // Big 6 Banks
    rbc: "/rbc-royal-bank-logo.jpg",
    td: "/td-canada-trust-logo.jpg",
    scotiabank: "/scotiabank-logo.jpg",
    bmo: "/bmo-bank-of-montreal-logo.jpg",
    cibc: "/cibc-bank-logo.jpg",
    national: "/national-bank-of-canada-logo.jpg",

    // Online-Only Banks
    tangerine: "/tangerine-bank-logo.jpg",
    simplii: "/simplii-financial-logo.jpg",
    // eq-bank, motive, wealthsimple-cash, koho, mogo, neo - no logos yet

    // Schedule I & II Banks
    atb: "/atb-financial-logo.jpg",
    laurentian: "/laurentian-bank-logo.png",
    hsbc: "/hsbc-bank-logo.jpg",
    manulife: "/manulife-bank-logo.jpg",
    "pc-financial": "/pc-financial-logo.jpg",
    // cwb, firstontario, bridgewater, concentra, icici, habib, citibank, peoples-trust - no logos yet

    // Credit Unions
    desjardins: "/desjardins-bank-logo.jpg",
    meridian: "/meridian-credit-union-logo.jpg",
    // coast-capital, vancity, alterna, duca, servus, affinity, first-west, steinbach, libro, conexus, prospera, uni, blueshore, kawartha, innovation, kindred, interior - no logos yet

    // Digital & Hybrid Banks
    motusbank: "/motusbank-logo.jpg",
    // wealthone, oaken, alterna-bank, achieva, outlook, implicity, hubert, maxa - no logos yet
  }

  return logoMap[institutionId] || null
}
