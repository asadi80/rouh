// src/contexts/ClinicDataContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ClinicDataContext = createContext(null);

const API_URL = (
  import.meta.env.VITE_API_URL || "https://api.rouh.ly"
).replace(/\/$/, "");

const EMPTY_CLINIC_INFO = {
  name: "عيادة روحي",
  shortName: "روحي",
  tagline: "",
  description: "",
  phone: "",
  phoneDisplay: "",
  whatsapp: "",
  email: "",
  address: "",
  googleMapsUrl: "",
  googleMapsEmbedUrl: "",
};

const EMPTY_DATA = {
  clinicInfo: EMPTY_CLINIC_INFO,
  socialLinks: [],
  workingHours: [],
  doctors: [],
  services: [],
  whyUs: [],
  stats: [],
};

const INITIAL_LOADING = {
  clinicInfo: true,
  socialLinks: true,
  workingHours: true,
  doctors: true,
  services: true,
  whyUs: true,
};

// Shared cache and requests
let cachedClinicData = null;
let clinicDataStarted = false;
const completedSections = new Set();
const listeners = new Set();

function publishData(patch) {
  cachedClinicData = {
    ...(cachedClinicData || EMPTY_DATA),
    ...patch,
  };

  listeners.forEach((listener) => listener(patch));
}

function publishStatus(key, error = null) {
  completedSections.add(key);

  listeners.forEach((listener) =>
    listener({
      __status: { key, error },
    })
  );
}

async function fetchJson(path) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `فشل تحميل ${path} (${response.status})`
    );
  }

  if (!text.trim()) {
    throw new Error(`استجابة فارغة من ${path}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`استجابة غير صالحة من ${path}`);
  }
}

function normalizeArray(result, key) {
  if (Array.isArray(result)) return result;
  if (key && Array.isArray(result?.[key])) return result[key];
  if (Array.isArray(result?.data)) return result.data;

  return [];
}

function mapSettings(row) {
  if (!row || typeof row !== "object") {
    return {
      clinicInfo: EMPTY_CLINIC_INFO,
      socialLinks: [],
    };
  }

  const waMatch = row.whatsapp_url?.match(/wa\.me\/(\d+)/);

  const clinicInfo = {
    name: row.name || EMPTY_CLINIC_INFO.name,
    shortName: row.short_name || EMPTY_CLINIC_INFO.shortName,
    tagline: row.tagline || "",
    description: row.description || "",
    phone: row.phone || "",
    phoneDisplay: row.phone || "",
    whatsapp: waMatch
      ? waMatch[1]
      : row.phone?.replace(/\D/g, "") || "",
    email: row.email || "",
    address: row.address || "",
    googleMapsUrl: row.google_maps_url || "",
    googleMapsEmbedUrl: row.google_maps_embed_url || "",
  };

  const candidates = [
    { id: "instagram", label: "انستغرام", url: row.instagram_url },
    { id: "whatsapp", label: "واتساب", url: row.whatsapp_url },
    { id: "twitter", label: "X (تويتر)", url: row.twitter_url },
    { id: "facebook", label: "فيسبوك", url: row.facebook_url },
    { id: "tiktok", label: "تيك توك", url: row.tiktok_url },
    { id: "snapchat", label: "سناب شات", url: row.snapchat_url },
  ];

  return {
    clinicInfo,
    socialLinks: candidates.filter(
      (item) => typeof item.url === "string" && item.url.trim()
    ),
  };
}

function startClinicDataFetch() {
  if (clinicDataStarted) return;

  clinicDataStarted = true;

  const endpoints = [
    {
      path: "/api/settings",
      keys: ["clinicInfo", "socialLinks"],
      process: (result) => mapSettings(result),
    },
    {
      path: "/api/working-hours",
      keys: ["workingHours"],
      process: (result) => ({
        workingHours: normalizeArray(result, "workingHours").map(
          (item) => ({
            day: item.day_of_week || item.day || "",
            hours: item.hours_text || item.hours || "",
            isOpen:
              item.is_open !== undefined ? item.is_open : true,
          })
        ),
      }),
    },
    {
      path: "/api/doctors",
      keys: ["doctors"],
      process: (result) => ({
        doctors: normalizeArray(result, "doctors"),
      }),
    },
    {
      path: "/api/services",
      keys: ["services"],
      process: (result) => ({
        services: normalizeArray(result, "services").map((item) => ({
          icon: item.icon || "🏥",
          title: item.title || "Service",
          desc: item.description || item.desc || "",
        })),
      }),
    },
    {
      path: "/api/why-us",
      keys: ["whyUs"],
      process: (result) => ({
        whyUs: normalizeArray(result, "whyUs").map((item) => ({
          icon: item.icon || "⭐",
          title: item.title || "Why Us",
          desc: item.description || item.desc || "",
        })),
      }),
    },
  ];

  endpoints.forEach(async (endpoint) => {
    try {
      const result = await fetchJson(endpoint.path);
      const processed = endpoint.process(result);

      publishData(processed);

      endpoint.keys.forEach((key) => publishStatus(key));
    } catch (error) {
      console.error(`Failed to load ${endpoint.path}:`, error);

      endpoint.keys.forEach((key) =>
        publishStatus(key, error.message)
      );
    }
  });
}

export function ClinicDataProvider({ children }) {
  const [data, setData] = useState(
    cachedClinicData || EMPTY_DATA
  );

 const [loadingBySection, setLoadingBySection] = useState(
  Object.fromEntries(
    Object.keys(INITIAL_LOADING).map((key) => [
      key,
      !completedSections.has(key),
    ])
  )
);

  const [errorBySection, setErrorBySection] = useState({});

  useEffect(() => {
    let mounted = true;

    const listener = (update) => {
      if (!mounted) return;

      if (update.__status) {
        const { key, error } = update.__status;

        setLoadingBySection((previous) => ({
          ...previous,
          [key]: false,
        }));

        setErrorBySection((previous) => ({
          ...previous,
          [key]: error,
        }));

        return;
      }

      setData((previous) => ({
        ...previous,
        ...update,
      }));
    };

    listeners.add(listener);

    // Get data already loaded by another provider.
    if (cachedClinicData) {
      setData(cachedClinicData);
    }

    startClinicDataFetch();

    return () => {
      mounted = false;
      listeners.delete(listener);
    };
  }, []);

  const loading = Object.values(loadingBySection).some(Boolean);

  const contextValue = {
    ...EMPTY_DATA,
    ...data,

    clinicInfo: data?.clinicInfo || EMPTY_CLINIC_INFO,
    socialLinks: data?.socialLinks || [],
    workingHours: data?.workingHours || [],
    doctors: data?.doctors || [],
    services: data?.services || [],
    whyUs: data?.whyUs || [],
    stats: data?.stats || [],

    loading,
    loadingBySection,
    errorBySection,

    error: Object.values(errorBySection).filter(Boolean).join("; ") || null,

    debug: () => ({
      loading,
      loadingBySection,
      errorBySection,
      cached: Boolean(cachedClinicData),
      data,
    }),
  };

  return (
    <ClinicDataContext.Provider value={contextValue}>
      {children}
    </ClinicDataContext.Provider>
  );
}

export function useClinicData() {
  const context = useContext(ClinicDataContext);

  if (!context) {
    throw new Error(
      "useClinicData must be used within ClinicDataProvider"
    );
  }

  return context;
}