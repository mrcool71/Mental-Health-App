import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as {
  dataConnectApiBaseUrl?: string;
};

export const DATA_CONNECT_API_BASE_URL =
  extra.dataConnectApiBaseUrl ?? "http://10.0.2.2:8080";
