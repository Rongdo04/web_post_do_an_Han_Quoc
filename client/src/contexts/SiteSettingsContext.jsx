import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import settingsAPI from "../services/settingsAPI";

const DEFAULT_HERO =
  "https://store.longphuong.vn/wp-content/uploads/2025/05/am-thuc-han-quoc-1.webp";
const DEFAULT_FOOTER =
  "https://bazantravel.com/cdn/medias/uploads/52/52717-com-tron-han-quoc-700x419.jpg";

const DEFAULT_SETTINGS = {
  brand: "CulinaryHub",
  siteTitle: "Nghệ Thuật Ẩm Thực Trong Tầm Tay Bạn",
  siteDesc:
    "Nền tảng chia sẻ và sáng tạo công thức ẩm thực Việt Nam, kết nối cộng đồng yêu bếp.",
  policy: "",
  logoUrl: "",
  heroImage: DEFAULT_HERO,
  footerImage: DEFAULT_FOOTER,
};

const SiteSettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: async () => {},
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await settingsAPI.getPublicSettings();
      if (response?.success && response.data) {
        setSettings({
          brand: response.data.brand || DEFAULT_SETTINGS.brand,
          siteTitle: response.data.siteTitle || DEFAULT_SETTINGS.siteTitle,
          siteDesc: response.data.siteDesc || DEFAULT_SETTINGS.siteDesc,
          policy: response.data.policy || DEFAULT_SETTINGS.policy,
          logoUrl: response.data.logoUrl || "",
          heroImage: response.data.heroImage || DEFAULT_SETTINGS.heroImage,
          footerImage:
            response.data.footerImage || DEFAULT_SETTINGS.footerImage,
        });
      }
    } catch (error) {
      console.error("Failed to fetch site settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ settings, loading, refresh }),
    [settings, loading, refresh],
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export default SiteSettingsContext;
