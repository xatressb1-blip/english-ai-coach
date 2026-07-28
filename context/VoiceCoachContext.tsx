"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

interface VoiceCoachContextType {
  message: string;
  visible: boolean;

  showMessage: (message: string) => void;
  hideMessage: () => void;
}

const VoiceCoachContext =
  createContext<VoiceCoachContextType | null>(null);

export function VoiceCoachProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  function showMessage(text: string) {
    setMessage(text);
    setVisible(true);
  }

  function hideMessage() {
    setVisible(false);
  }

  const value = useMemo(
    () => ({
      message,
      visible,
      showMessage,
      hideMessage,
    }),
    [message, visible]
  );

  return (
    <VoiceCoachContext.Provider value={value}>
      {children}
    </VoiceCoachContext.Provider>
  );
}

export function useVoiceCoach() {
  const context = useContext(VoiceCoachContext);

  if (!context) {
    throw new Error(
      "useVoiceCoach must be used inside VoiceCoachProvider"
    );
  }

  return context;
}