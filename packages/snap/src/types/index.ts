export enum ButtonEvents {
  ChooseAddress = 'choose-address',
  OpenSettings = 'open-settings',
  OpenHowto = 'open-howto',
}
export enum FormEvents {
  AccountSelected = 'account-selected',
  AddressSelected = 'address-selected',
  SettingsUpdated = 'settings-updated',
}

export type Platform = {
  name: string;
  url: string;
};

export type StrategyAction = {
  description: string;
  tokens: string;
  platforms: Platform[];
  networks: string[];
  operations: string[];
  apy: string;
  flags: string[];
};

export type StrategiesResponse = {
  actions: StrategyAction[];
  name: string;
  risk: string;
};

export type PortfolioStrategiesResponse = {
  hash: string;
  llm: {
    provider: string;
    model: string;
  };
  responseTime: number;
  error: string | null;
  response: StrategiesResponse[];
};

export type PortfolioResponse = {
  address: `0x${string}`;
  portfolio: any;
  strategies: PortfolioStrategiesResponse[];
  message?: string; // on error
};

export type AccountSelectorEventValue = {
  addresses: `${string}:${string}:${string}`[];
  accountId: string;
};
