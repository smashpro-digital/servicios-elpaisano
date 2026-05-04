import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Language = "en" | "es";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);
const LANGUAGE_KEY = "servicios.language.v1";

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((storedLanguage) => {
        if (
          isMounted &&
          (storedLanguage === "en" || storedLanguage === "es")
        ) {
          setLanguage(storedLanguage);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const persistLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage).catch(() => {});
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: persistLanguage,
      toggleLanguage: () =>
        persistLanguage(language === "en" ? "es" : "en"),
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
