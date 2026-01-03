import type { Bank, DepositInfo } from "@/types/bank"

export const mockBanks: Bank[] = [
  {
    id: "atb",
    name: "ATB Financial",
    logo: "/atb-financial-logo.jpg",
    loginUrl: "https://www.atb.com/personal/online-banking/",
  },
  {
    id: "bmo",
    name: "BMO",
    logo: "/bmo-bank-of-montreal-logo.jpg",
    loginUrl: "https://www.bmo.com/main/personal/online-banking",
  },
  {
    id: "cibc",
    name: "CIBC",
    logo: "/cibc-bank-logo.jpg",
    loginUrl: "https://www.cibc.com/en/personal-banking/ways-to-bank/cibc-online-banking.html",
  },
  {
    id: "desjardins",
    name: "Desjardins",
    logo: "/desjardins-bank-logo.jpg",
    loginUrl: "https://accweb.mouv.desjardins.com/identifiantunique/securite-garantie/authentification/auth/manuel",
  },
  {
    id: "hsbc",
    name: "HSBC",
    logo: "/hsbc-bank-logo.jpg",
    loginUrl: "https://www.hsbc.ca",
  },
  {
    id: "laurentian",
    name: "Laurentian Bank",
    logo: "/laurentian-bank-logo.png",
    loginUrl: "https://www.laurentianbank.ca/en/personal.html",
  },
  {
    id: "manulife",
    name: "Manulife Bank",
    logo: "/manulife-bank-logo.jpg",
    loginUrl: "https://www.manulifebank.ca/personal-banking.html",
  },
  {
    id: "meridian",
    name: "Meridian",
    logo: "/meridian-credit-union-logo.jpg",
    loginUrl: "https://www.meridiancu.ca",
  },
  {
    id: "motus",
    name: "Motusbank",
    logo: "/motusbank-logo.jpg",
    loginUrl: "https://www.motusbank.ca",
  },
  {
    id: "national",
    name: "National Bank",
    logo: "/national-bank-of-canada-logo.jpg",
    loginUrl: "https://app.bnc.ca/signIn",
  },
  {
    id: "pcfinancial",
    name: "PC Financial",
    logo: "/pc-financial-logo.jpg",
    loginUrl: "https://www.pcfinancial.ca",
  },
  {
    id: "rbc",
    name: "RBC",
    logo: "/rbc-royal-bank-logo.jpg",
    loginUrl: "https://secure.royalbank.com/statics/login-service-ui/index#/full/signin?",
  },
  {
    id: "scotiabank",
    name: "Scotiabank",
    logo: "/scotiabank-logo.jpg",
    loginUrl: "https://www.scotiabank.com/ca/en/personal/sign-in.html",
  },
  {
    id: "simplii",
    name: "Simplii Financial",
    logo: "/simplii-financial-logo.jpg",
    loginUrl: "https://online.simplii.com/ebm-resources/public/simplii/online-banking/client/index.html#/auth/signon",
  },
  {
    id: "tangerine",
    name: "Tangerine",
    logo: "/tangerine-bank-logo.jpg",
    loginUrl: "https://www.tangerine.ca/en",
  },
  {
    id: "td",
    name: "TD",
    logo: "/td-canada-trust-logo.jpg",
    loginUrl: "https://easyweb.td.com",
  },
]

export const mockDeposit: DepositInfo = {
  amount: "25,000.00",
  currency: "CAD",
  sender: "INTERAC Partner Network | QuantumYield Holdings",
  expiryDate: "December 29th, 2025",
  notice: "The deposit will appear on your next statement.",
}
