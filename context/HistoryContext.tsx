"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  InterviewHistory,
} from "@/components/history/HistoryTypes";

import {
  getHistories,
  addHistory as addHistoryService,
  deleteHistory as deleteHistoryService,
  clearHistories as clearHistoriesService,
} from "@/services/historyService";

interface HistoryContextType {
  histories: InterviewHistory[];

  addHistory: (
    history: InterviewHistory
  ) => void;

  deleteHistory: (
    id: string
  ) => void;

  clearHistories: () => void;

  reloadHistories: () => void;
}

const HistoryContext =
  createContext<HistoryContextType | undefined>(
    undefined
  );

interface Props {
  children: ReactNode;
}

export function HistoryProvider({
  children,
}: Props) {

  const [histories, setHistories] =
    useState<InterviewHistory[]>([]);

  const reloadHistories = () => {

    setHistories(
      getHistories()
    );

  };

  useEffect(() => {

    reloadHistories();

  }, []);

  const addHistory = (
    history: InterviewHistory
  ) => {

    addHistoryService(history);

    reloadHistories();

  };

  const deleteHistory = (
    id: string
  ) => {

    deleteHistoryService(id);

    reloadHistories();

  };

  const clearHistories = () => {

    clearHistoriesService();

    reloadHistories();

  };

  return (

    <HistoryContext.Provider
      value={{
        histories,
        addHistory,
        deleteHistory,
        clearHistories,
        reloadHistories,
      }}
    >

      {children}

    </HistoryContext.Provider>

  );

}

export function useHistoryContext() {

  const context =
    useContext(HistoryContext);

  if (!context) {

    throw new Error(
      "useHistoryContext must be used inside HistoryProvider."
    );

  }

  return context;

}