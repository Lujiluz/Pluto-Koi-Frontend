"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getGeneralRules, getActiveEvent } from "@/services/generalService";
import { GeneralRules, ActiveEvent } from "@/lib/types";

interface UseGeneralDataReturn {
  // General Rules
  generalRules: GeneralRules | null;
  isLoadingRules: boolean;
  rulesError: string | null;

  // Active Event
  activeEvent: ActiveEvent | null;
  isLoadingEvent: boolean;
  eventError: string | null;

  // Actions
  refetchRules: () => Promise<void>;
  refetchEvent: () => Promise<void>;
  refetchAll: () => Promise<void>;
}

export function useGeneralData(): UseGeneralDataReturn {
  const { isAuthenticated } = useAuth();

  // General Rules state
  const [generalRules, setGeneralRules] = useState<GeneralRules | null>(null);
  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [rulesError, setRulesError] = useState<string | null>(null);

  // Active Event state
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);

  // Fetch general rules
  const fetchGeneralRules = async () => {
    if (!isAuthenticated) {
      setGeneralRules(null);
      return;
    }

    try {
      setIsLoadingRules(true);
      setRulesError(null);

      const response = await getGeneralRules();

      if (response.status === "success" && response.data) {
        setGeneralRules(response.data);
      } else {
        setGeneralRules(null);
        setRulesError("Failed to fetch general rules");
      }
    } catch (err: any) {
      console.error("Error fetching general rules:", err);
      setRulesError(err.message || "Failed to fetch general rules");
      setGeneralRules(null);
    } finally {
      setIsLoadingRules(false);
    }
  };

  // Fetch active event
  const fetchActiveEvent = async () => {
    try {
      setIsLoadingEvent(true);
      setEventError(null);

      const response = await getActiveEvent();

      if (response.status === "success") {
        // response.data can be null if no active event
        setActiveEvent(response.data);
      } else {
        setActiveEvent(null);
        setEventError("Failed to fetch active event");
      }
    } catch (err: any) {
      console.error("Error fetching active event:", err);
      setEventError(err.message || "Failed to fetch active event");
      setActiveEvent(null);
    } finally {
      setIsLoadingEvent(false);
    }
  };

  // Refetch functions
  const refetchRules = async () => {
    await fetchGeneralRules();
  };

  const refetchEvent = async () => {
    await fetchActiveEvent();
  };

  const refetchAll = async () => {
    await Promise.all([fetchGeneralRules(), fetchActiveEvent()]);
  };

  // Effect to fetch data when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchGeneralRules();
    } else {
      setGeneralRules(null);
      setRulesError(null);
    }
  }, [isAuthenticated]);

  // Effect to fetch active event (always fetch, no auth required)
  useEffect(() => {
    fetchActiveEvent();
  }, []);

  return {
    // General Rules
    generalRules,
    isLoadingRules,
    rulesError,

    // Active Event
    activeEvent,
    isLoadingEvent,
    eventError,

    // Actions
    refetchRules,
    refetchEvent,
    refetchAll,
  };
}
