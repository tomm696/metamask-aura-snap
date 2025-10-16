
export enum ButtonEvents {
  ChooseAddress = "choose-address"
}
export enum FormEvents {
  AccountSelected = "account-selected",
  AddressSelected = "address-selected"
}

export type StrategyAction = {
  description: string,
  tokens: string
}

export type StrategiesResponse = {
  actions: StrategyAction[],
  name: string,
  risk: string
}

export type PortfolioStrategiesResponse = {
  hash: string,
  llm: {
    provider: string,
    model: string
  },
  responseTime: Number,
  error: string | null,
  response: StrategiesResponse[]
}

export type PortfolioResponse = {
  address: `0x${string}`,
  portfolio: any,
  strategies: PortfolioStrategiesResponse[],
  message?: string // on error
}

export type AccountSelectorEventValue = {
  addresses: `${string}:${string}:${string}`[]
  accountId: string
}