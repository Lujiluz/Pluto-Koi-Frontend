import AxiosInstance from "@/utils/axiosInstance";
import { GeneralRulesApiResponse, ActiveEventApiResponse } from "@/lib/types";

// Base general rules API endpoints
const GENERAL_RULES_ENDPOINTS = {
  GET_RULES: "/general-rules",
} as const;

// Base event API endpoints
const EVENT_ENDPOINTS = {
  GET_ACTIVE: "/event/active",
} as const;

// Get general rules (authenticated)
export const getGeneralRules = async (): Promise<GeneralRulesApiResponse> => {
  try {
    const response = await AxiosInstance.get(GENERAL_RULES_ENDPOINTS.GET_RULES);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching general rules:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch general rules");
  }
};

// Get active event
export const getActiveEvent = async (): Promise<ActiveEventApiResponse> => {
  try {
    const response = await AxiosInstance.get(EVENT_ENDPOINTS.GET_ACTIVE);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching active event:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch active event");
  }
};
