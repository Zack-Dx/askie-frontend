import { CONFIG } from "@/constants";
import axios from "axios";

export const getIpMetadata = async () => {
  try {
    const response = await axios.get(CONFIG.USER_METADATA_URL);
    const data = response.data;

    return {
      ip: data.ip || "Unknown",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      region_code: data.region_code || "Unknown",
      country_code: data.country_code || "Unknown",
      country_code_iso3: data.country_code_iso3 || "Unknown",
      country_name: data.country_name || "Unknown",
      country_capital: data.country_capital || "Unknown",
      country_tld: data.country_tld || "Unknown",
      continent_code: data.continent_code || "Unknown",
      in_eu: data.in_eu || false,
      postal: data.postal || "Unknown",
      latitude: data.latitude || "Unknown",
      longitude: data.longitude || "Unknown",
      timezone: data.timezone || "Unknown",
      utc_offset: data.utc_offset || "Unknown",
      country_calling_code: data.country_calling_code || "Unknown",
      currency: data.currency || "Unknown",
      currency_name: data.currency_name || "Unknown",
      languages: data.languages || "Unknown",
      asn: data.asn || "Unknown",
      org: data.org || "Unknown",
      userAgent: navigator.userAgent || "Unknown",
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return { error: "Failed to fetch metadata" };
  }
};

export const daysRemainingCalculator = (endDate) => {
  const premiumEndDate = new Date(endDate);
  const currentDate = new Date();
  const diffInMs = premiumEndDate.getTime() - currentDate.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};
