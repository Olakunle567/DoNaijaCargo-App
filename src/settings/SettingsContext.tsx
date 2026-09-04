import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CURRENCIES, type CurrencyCode } from "../lib/currency";
import { translate, type LanguageCode, type TranslationKey } from "../lib/i18n";

const CURRENCY_KEY = "settings:currency";
const LANGUAGE_KEY = "settings:language";

type SettingsContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function isCurrencyCode(v: string): v is CurrencyCode {
  return v in CURRENCIES;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("NGN");
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    (async () => {
      const [storedCurrency, storedLanguage] = await Promise.all([
        AsyncStorage.getItem(CURRENCY_KEY),
        AsyncStorage.getItem(LANGUAGE_KEY),
      ]);
      if (storedCurrency && isCurrencyCode(storedCurrency)) setCurrencyState(storedCurrency);
      if (storedLanguage) setLanguageState(storedLanguage as LanguageCode);
    })();
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    AsyncStorage.setItem(CURRENCY_KEY, code).catch(() => {});
  };

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    AsyncStorage.setItem(LANGUAGE_KEY, code).catch(() => {});
  };

  const value = useMemo<SettingsContextValue>(
    () => ({
      currency,
      setCurrency,
      language,
      setLanguage,
      t: (key: TranslationKey) => translate(language, key),
    }),
    [currency, language]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
