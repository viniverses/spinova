import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type HelpContextType = {
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  openHelp: () => void;
  closeHelp: () => void;
};

const HelpContext = createContext<HelpContextType | null>(null);

export const HelpProvider = ({ children }: PropsWithChildren) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const openHelp = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  return (
    <HelpContext.Provider
      value={{
        isHelpOpen,
        setIsHelpOpen,
        openHelp,
        closeHelp,
      }}
    >
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error("useHelp must be used within a HelpProvider");
  }
  return context;
};
