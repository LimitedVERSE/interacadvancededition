export type Language = "en" | "fr"

export interface Translations {
  // Header
  header: {
    contactUs: string
    about: string
    helpLabel: string
  }

  // Main Page
  mainPage: {
    selectInstitutionTitle: string
    selectInstitutionLabel: string
    multiSelectTitle: string
    multiSelectDescription: string
    manualSelectionTitle: string
    selectInstitutionDropdown: string
    selectInstitutionHelp: string
    selectProvinceLabel: string
    selectProvinceDropdown: string
    selectProvinceHelp: string
    orSeparator: string
    alternativeMethodLabel: string
    searchPlaceholder: string
    searchLabel: string
    accountTypeLabel: string
    accountTypeDropdown: string
    accountTypeHelp: string
    branchNumberLabel: string
    branchNumberPlaceholder: string
    branchNumberHelp: string
    connectButton: string
    formValidationError: string
    chequing: string
    savings: string
    investment: string
    creditCard: string
    connectionMethodTitle: string
    connectionMethodDescription: string
    gridMethod: string
    gridMethodDescription: string
    multiSelectMethod: string
    multiSelectMethodDescription: string
    manualMethod: string
    manualMethodDescription: string
  }

  // Institution Multi-Select
  institutionSelect: {
    title: string
    searchPlaceholder: string
    searchLabel: string
    selectInstruction: string
    selectionsCount: (count: number, categoryCount: number) => string
    continue: string
    clearAll: string
    selectOne: string
    selected: string
    yourSelected: string
    connected: string
    removeLabel: (name: string, category: string) => string
    back: string
    allConnected: string
    connectToBank: string
    successTitle: string
    successMessage: string
    secureConnection: string
    secureNotice: string
    whatHappensNext: string
    step1: string
    step2: string
    step3: string
    connectNow: string
    skip: string
    establishing: string
    pleaseWait: string
    redirecting: string
    openingBank: string
    continueNow: string
  }

  // US States
  states: {
    AL: string; AK: string; AZ: string; AR: string; CA: string; CO: string
    CT: string; DE: string; FL: string; GA: string; HI: string; ID: string
    IL: string; IN: string; IA: string; KS: string; KY: string; LA: string
    ME: string; MD: string; MA: string; MI: string; MN: string; MS: string
    MO: string; MT: string; NE: string; NV: string; NH: string; NJ: string
    NM: string; NY: string; NC: string; ND: string; OH: string; OK: string
    OR: string; PA: string; RI: string; SC: string; SD: string; TN: string
    TX: string; UT: string; VT: string; VA: string; WA: string; WV: string
    WI: string; WY: string; DC: string
  }

  // Institution Categories
  categories: {
    "major-national": string
    "online-only": string
    "regional": string
    "credit-unions": string
    "digital-hybrid": string
  }

  // Remittance Filter Panel
  remittanceFilter: {
    title: string
    subtitle: string
    reset: string
    matchingClasses: string
    selectFilters: string

    // Filter sections
    scope: {
      title: string
      description: string
      domestic: string
      domesticDesc: string
      international: string
      internationalDesc: string
    }

    entityType: {
      title: string
      description: string
      personal: string
      commercial: string
      government: string
      institutional: string
    }

    speed: {
      title: string
      description: string
      instant: string
      instantDesc: string
      sameDay: string
      sameDayDesc: string
      batch: string
      batchDesc: string
      deferred: string
      deferredDesc: string
    }

    method: {
      title: string
      description: string
      wire: string
      achEft: string
      cardRail: string
      mobileWallet: string
      cash: string
    }

    purpose: {
      title: string
      description: string
      payroll: string
      vendor: string
      settlement: string
      escrow: string
      refund: string
    }

    direction: {
      title: string
      description: string
      inbound: string
      inboundDesc: string
      outbound: string
      outboundDesc: string
    }

    valueTier: {
      title: string
      description: string
      micro: string
      microDesc: string
      retail: string
      retailDesc: string
      highValue: string
      highValueDesc: string
    }
  }

  // Remittance Summary Chips
  remittanceSummary: {
    noSelection: string
    useFilters: string
    selectedClasses: (count: number) => string
    clearAll: string
    removeLabel: (label: string) => string
  }

  // Deposit Panel
  depositPanel: {
    title: string
    from: string
    expires: string
    timeRemaining: string
    notice: string
    noticeText: string
    loadingMessage: string
    errorMessage: string
    transactionDetails: string
    // Time formatting
    time: {
      day: string
      days: string
      hour: string
      hours: string
      minute: string
      minutes: string
      second: string
      seconds: string
      expired: string
    }
  }

  // Common
  common: {
    loading: string
    error: string
  }

  // Connect Bank page
  connectBank: {
    badge: string
    title: string
    subtitle: string
    searchPlaceholder: string
    allCategory: string
    noResultsTitle: (term: string) => string
    noResultsTip: string
    backToDashboard: string
    chooseDifferent: string
    connectTo: (name: string) => string
    connectingTitle: string
    connectingSubtitle: string
    redirectingTo: (name: string) => string
    openingIn: (seconds: number) => string
    continueNow: string
    trustSsl: string
    trustSslSub: string
    trustSecurity: string
    trustSecuritySub: string
    trustCdic: string
    trustCdicSub: string
    manualPrompt: string
    manualTitle: string
    manualInstitutionLabel: string
    manualInstitutionPlaceholder: string
    manualAccountTypeLabel: string
    manualAccountTypeDefault: string
    manualChequing: string
    manualSavings: string
    manualBusiness: string
    manualBranchLabel: string
    manualBranchPlaceholder: string
    manualSubmit: string
    manualSubmitting: string
    manualSuccess: string
    catBigSix: string
    catOnline: string
    catCreditUnions: string
    catRegional: string
  }
}
