/**
 * SettingsForm with API Integration
 * Fields: siteTitle, siteDesc, brand, policy, logoUrl, heroImage, footerImage
 */
import React, { useEffect, useState, useMemo } from "react";
import { useAdminApi } from "../contexts/AdminApiContext.jsx";
import { useSiteSettings } from "../../contexts/SiteSettingsContext.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import Toast from "./Toast.jsx";
import { t } from "../../i18n";

const DEFAULT_HERO =
  "https://store.longphuong.vn/wp-content/uploads/2025/05/am-thuc-han-quoc-1.webp";
const DEFAULT_FOOTER =
  "https://bazantravel.com/cdn/medias/uploads/52/52717-com-tron-han-quoc-700x419.jpg";

const defaultValues = {
  siteTitle: "Nghệ Thuật Ẩm Thực Trong Tầm Tay Bạn",
  siteDesc:
    "Nền tảng chia sẻ và sáng tạo công thức ẩm thực Việt Nam, kết nối cộng đồng yêu bếp.",
  brand: "CulinaryHub",
  policy:
    "Chào mừng bạn đến với nền tảng chia sẻ công thức. Vui lòng tôn trọng cộng đồng và chia sẻ nội dung chất lượng.",
  logoUrl: "",
  heroImage: DEFAULT_HERO,
  footerImage: DEFAULT_FOOTER,
};

export default function SettingsForm() {
  const adminApi = useAdminApi();
  const { refresh: refreshSiteSettings } = useSiteSettings();
  const [values, setValues] = useState(defaultValues);
  const [originalValues, setOriginalValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(originalValues),
    [values, originalValues],
  );

  const openToast = (msg, type = "success") =>
    setToast({ open: true, msg, type });

  const closeToast = () =>
    setToast((t) => ({
      ...t,
      open: false,
    }));

  const mapBackendErrors = (details = []) => {
    const fieldErrors = {};
    details.forEach((d) => {
      let key = d?.path;
      if (Array.isArray(key)) key = key[key.length - 1];
      if (typeof key !== "string") return;
      fieldErrors[key] =
        d?.message || t("common.invalidField", "Giá trị không hợp lệ");
    });
    return fieldErrors;
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setErrors({});

      const result = await adminApi.safeApiCall(() => adminApi.getSettings(), {
        defaultErrorMessage: "Không thể tải cài đặt",
      });

      if (!mounted) return;

      if (result.success) {
        const settingsData = result.data?.data || result.data || {};
        const loadedValues = { ...defaultValues, ...settingsData };
        delete loadedValues.featuredVideo;
        setValues(loadedValues);
        setOriginalValues(loadedValues);
      } else {
        openToast(result.error?.message || "Không thể tải cài đặt", "error");
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [adminApi]);

  const update = (field, val) => {
    setValues((v) => ({ ...v, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrors({});

    const payload = { ...values };
    delete payload.featuredVideo;
    delete payload.id;
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    const result = await adminApi.safeApiCall(
      () => adminApi.updateSettings(payload),
      { defaultErrorMessage: "Không thể lưu cài đặt" },
    );

    if (result.success) {
      const updatedSettings = result.data?.data || result.data || values;
      const next = { ...defaultValues, ...updatedSettings };
      delete next.featuredVideo;
      setValues(next);
      setOriginalValues(next);
      await refreshSiteSettings();
      openToast(t("settings.saved", "Đã lưu cài đặt"), "success");
    } else {
      if (result.error?.details) {
        const details = result.error.details;
        if (Array.isArray(details)) {
          setErrors(mapBackendErrors(details));
        } else if (typeof details === "object") {
          setErrors(details);
        }
      }
      openToast(result.error?.message || "Không thể lưu cài đặt", "error");
    }

    setSaving(false);
  };

  const resetDefaults = async () => {
    if (saving) return;

    setSaving(true);
    setErrors({});

    const result = await adminApi.safeApiCall(
      () => adminApi.updateSettings(defaultValues),
      { defaultErrorMessage: "Không thể reset cài đặt" },
    );

    if (result.success) {
      const resetSettings = result.data?.data || result.data || defaultValues;
      const next = { ...defaultValues, ...resetSettings };
      delete next.featuredVideo;
      setValues(next);
      setOriginalValues(next);
      setConfirmReset(false);
      await refreshSiteSettings();
      openToast(
        t("settings.resetToDefaults", "Đã reset về mặc định"),
        "success",
      );
    } else {
      openToast(result.error?.message || "Không thể reset cài đặt", "error");
    }

    setSaving(false);
  };

  const inputClass = (field) =>
    `w-full rounded-xl border border-brand-solid/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-ring ${
      errors[field] ? "border-red-500" : ""
    }`;

  return (
    <div className="space-y-8">
      {loading && (
        <div className="py-8 text-center">
          <div className="text-sm text-brand-solid">
            {t("common.loading", "Đang tải...")}
          </div>
        </div>
      )}

      {!loading && (
        <form onSubmit={save} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-solid/70">
                  {t("settings.siteTitle", "Tiêu đề website")}
                </label>
                <input
                  type="text"
                  value={values.siteTitle}
                  onChange={(e) => update("siteTitle", e.target.value)}
                  className={inputClass("siteTitle")}
                  disabled={saving}
                />
                {errors.siteTitle && (
                  <p className="mt-1 text-xs text-red-600">{errors.siteTitle}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-solid/70">
                  {t("settings.brand", "Thương hiệu")}
                </label>
                <input
                  type="text"
                  value={values.brand}
                  onChange={(e) => update("brand", e.target.value)}
                  className={inputClass("brand")}
                  disabled={saving}
                />
                {errors.brand && (
                  <p className="mt-1 text-xs text-red-600">{errors.brand}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-solid/70">
                  Logo (URL ảnh)
                </label>
                <input
                  type="url"
                  value={values.logoUrl}
                  onChange={(e) => update("logoUrl", e.target.value)}
                  className={inputClass("logoUrl")}
                  placeholder="https://example.com/logo.png"
                  disabled={saving}
                />
                {errors.logoUrl && (
                  <p className="mt-1 text-xs text-red-600">{errors.logoUrl}</p>
                )}
                <p className="mt-1 text-[11px] text-stone-500">
                  Ảnh logo header/footer. Để trống dùng icon mặc định.
                </p>
                {values.logoUrl ? (
                  <img
                    src={values.logoUrl}
                    alt="Logo preview"
                    className="mt-2 h-12 w-12 rounded-full object-cover ring-1 ring-black/10"
                  />
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-solid/70">
                  {t("settings.siteDesc", "Mô tả website")}
                </label>
                <textarea
                  value={values.siteDesc}
                  onChange={(e) => update("siteDesc", e.target.value)}
                  className={`min-h-[100px] resize-y ${inputClass("siteDesc")}`}
                  disabled={saving}
                />
                {errors.siteDesc && (
                  <p className="mt-1 text-xs text-red-600">{errors.siteDesc}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-solid/70">
                  Ảnh banner trang chủ (URL)
                </label>
                <input
                  type="url"
                  value={values.heroImage}
                  onChange={(e) => update("heroImage", e.target.value)}
                  className={inputClass("heroImage")}
                  placeholder="https://example.com/banner.jpg"
                  disabled={saving}
                />
                {errors.heroImage && (
                  <p className="mt-1 text-xs text-red-600">{errors.heroImage}</p>
                )}
                {values.heroImage ? (
                  <img
                    src={values.heroImage}
                    alt="Banner preview"
                    className="mt-2 h-24 w-full rounded-xl object-cover ring-1 ring-black/10"
                  />
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-solid/70">
                  Ảnh gần footer (URL)
                </label>
                <input
                  type="url"
                  value={values.footerImage}
                  onChange={(e) => update("footerImage", e.target.value)}
                  className={inputClass("footerImage")}
                  placeholder="https://example.com/footer-banner.jpg"
                  disabled={saving}
                />
                {errors.footerImage && (
                  <p className="mt-1 text-xs text-red-600">{errors.footerImage}</p>
                )}
                <p className="mt-1 text-[11px] text-stone-500">
                  Ảnh khối CTA phía cuối trang chủ, gần footer.
                </p>
                {values.footerImage ? (
                  <img
                    src={values.footerImage}
                    alt="Footer image preview"
                    className="mt-2 h-24 w-full rounded-xl object-cover ring-1 ring-black/10"
                  />
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-solid/70">
                  {t("settings.policy", "Chính sách")}
                </label>
                <textarea
                  value={values.policy}
                  onChange={(e) => update("policy", e.target.value)}
                  className={`min-h-[100px] resize-y ${inputClass("policy")}`}
                  disabled={saving}
                />
                {errors.policy && (
                  <p className="mt-1 text-xs text-red-600">{errors.policy}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!isDirty || saving}
              className="rounded-xl bg-gradient-to-br from-brand-from via-brand-solid to-brand-to px-4 py-2 text-xs font-semibold text-white shadow-brand disabled:opacity-40"
            >
              {saving
                ? t("common.saving", "Đang lưu...")
                : t("common.save", "Lưu cài đặt")}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              disabled={saving}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-40"
            >
              {t("settings.resetToDefaults", "Reset về mặc định")}
            </button>
          </div>

          <ConfirmModal
            open={confirmReset}
            title={t("settings.reset.title", "Reset cài đặt")}
            message={t(
              "settings.reset.message",
              "Reset tất cả cài đặt về mặc định?",
            )}
            confirmLabel={t("settings.reset.confirm", "Reset")}
            onConfirm={resetDefaults}
            onCancel={() => setConfirmReset(false)}
          />

          <Toast
            open={toast.open}
            type={toast.type}
            message={toast.msg}
            onClose={closeToast}
          />
        </form>
      )}
    </div>
  );
}
