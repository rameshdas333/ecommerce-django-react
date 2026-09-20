
import React, { useEffect, useState } from "react";
import {
  FiSettings,
  FiUser,
  FiMail,
  FiLock,
  FiImage,
  FiUpload,
  FiSave,
  FiTruck,
  FiCreditCard,
  FiBell,
  FiPackage,
  FiTag,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_DJANGO_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const Settings = () => {
  // =====================================================
  // STORE INFORMATION
  // =====================================================

  const [storeName, setStoreName] = useState("SmartBazar");
  const [storeEmail, setStoreEmail] = useState(
    "support@smartbazar.com"
  );
  const [storePhone, setStorePhone] = useState(
    "+880 1XXXXXXXXX"
  );
  const [storeAddress, setStoreAddress] = useState(
    "Dhaka, Bangladesh"
  );
  const [currency, setCurrency] = useState("BDT");

  // =====================================================
  // BRANDING
  // =====================================================

  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [adminLogo, setAdminLogo] = useState(null);
  const [adminLogoFile, setAdminLogoFile] = useState(null);

  // SIDEBAR NAVBAR LOGO
  const [sidebarLogo, setSidebarLogo] = useState(null);
  const [sidebarLogoFile, setSidebarLogoFile] = useState(null);

  // THREE WEBSITE BANNERS
  const [banner1, setBanner1] = useState(null);
  const [banner1File, setBanner1File] = useState(null);

  const [banner2, setBanner2] = useState(null);
  const [banner2File, setBanner2File] = useState(null);

  const [banner3, setBanner3] = useState(null);
  const [banner3File, setBanner3File] = useState(null);

  // =====================================================
  // ADMIN ACCOUNT
  // =====================================================

  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState(
    "admin@smartbazar.com"
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =====================================================
  // ORDER SETTINGS
  // =====================================================

  const [minimumOrder, setMinimumOrder] = useState("500");
  const [autoCancel, setAutoCancel] = useState(true);

  // =====================================================
  // SHIPPING
  // =====================================================

  const [insideDhaka, setInsideDhaka] = useState("80");
  const [outsideDhaka, setOutsideDhaka] =
    useState("120");
  const [freeShipping, setFreeShipping] =
    useState("3000");

  // =====================================================
  // PAYMENT
  // =====================================================

  const [cashOnDelivery, setCashOnDelivery] =
    useState(true);
  const [sslCommerz, setSslCommerz] = useState(true);

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [newOrderNotification, setNewOrderNotification] =
    useState(true);
  const [lowStockNotification, setLowStockNotification] =
    useState(true);
  const [newCustomerNotification, setNewCustomerNotification] =
    useState(true);
  const [reviewNotification, setReviewNotification] =
    useState(true);

  // =====================================================
  // PRODUCT SETTINGS
  // =====================================================

  const [customerReview, setCustomerReview] = useState(true);
  const [productRating, setProductRating] = useState(true);
  const [lowStockLimit, setLowStockLimit] = useState("5");

  // =====================================================
  // COUPON
  // =====================================================

  const [couponEnabled, setCouponEnabled] = useState(true);

  // =====================================================
  // LOADING STATES
  // =====================================================

  const [loadingSettings, setLoadingSettings] =
    useState(true);

  const [savingBranding, setSavingBranding] =
    useState(false);

  const [savingStore, setSavingStore] =
    useState(false);

  const [changingEmail, setChangingEmail] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [savingOtherSettings, setSavingOtherSettings] =
    useState(false);

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (value) => {
    if (!value) return null;

    const stringValue = String(value);

    if (
      stringValue.startsWith("http://") ||
      stringValue.startsWith("https://") ||
      stringValue.startsWith("blob:")
    ) {
      return stringValue;
    }

    if (stringValue.startsWith("/")) {
      return `${API_URL}${stringValue}`;
    }

    return `${API_URL}/${stringValue}`;
  };

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (!data) return fallback;

    if (typeof data === "string") {
      return data;
    }

    if (data.detail) {
      return data.detail;
    }

    if (data.message) {
      return data.message;
    }

    const firstKey = Object.keys(data)[0];

    if (firstKey && Array.isArray(data[firstKey])) {
      return data[firstKey][0];
    }

    if (
      firstKey &&
      typeof data[firstKey] === "string"
    ) {
      return data[firstKey];
    }

    return fallback;
  };

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        setLoadingSettings(true);

        const token = getToken();

        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(
          `${API_URL}/api/settings/`,
          config
        );

        if (!mounted) return;

        const data = response.data || {};

        console.log("SETTINGS API RESPONSE:", data);

        // =================================================
        // STORE
        // =================================================

        if (data.store_name !== undefined) {
          setStoreName(data.store_name);
        }

        if (data.store_email !== undefined) {
          setStoreEmail(data.store_email);
        }

        if (data.store_phone !== undefined) {
          setStorePhone(data.store_phone);
        }

        if (data.store_address !== undefined) {
          setStoreAddress(data.store_address);
        }

        if (data.currency !== undefined) {
          setCurrency(data.currency);
        }

        // =================================================
        // BRANDING
        // =================================================

        // Website Logo
        if (data.user_logo !== undefined) {
          setLogo(getImageUrl(data.user_logo));
        }

        // Admin Logo
        if (data.admin_logo !== undefined) {
          setAdminLogo(
            getImageUrl(data.admin_logo)
          );
        }

        // Sidebar Navbar Logo
        if (data.sidebar_logo !== undefined) {
          setSidebarLogo(
            getImageUrl(data.sidebar_logo)
          );
        }

        // =================================================
        // WEBSITE BANNERS
        // =================================================

        if (data.banner_1 !== undefined) {
          setBanner1(
            getImageUrl(data.banner_1)
          );
        }

        if (data.banner_2 !== undefined) {
          setBanner2(
            getImageUrl(data.banner_2)
          );
        }

        if (data.banner_3 !== undefined) {
          setBanner3(
            getImageUrl(data.banner_3)
          );
        }

        // =================================================
        // ADMIN
        // =================================================

        if (data.admin_name !== undefined) {
          setAdminName(data.admin_name);
        }

        if (data.admin_email !== undefined) {
          setAdminEmail(data.admin_email);
        }

        // =================================================
        // ORDER
        // =================================================

        if (data.minimum_order !== undefined) {
          setMinimumOrder(
            String(data.minimum_order)
          );
        }

        if (data.auto_cancel !== undefined) {
          setAutoCancel(
            Boolean(data.auto_cancel)
          );
        }

        // =================================================
        // SHIPPING
        // =================================================

        if (data.inside_dhaka !== undefined) {
          setInsideDhaka(
            String(data.inside_dhaka)
          );
        }

        if (data.outside_dhaka !== undefined) {
          setOutsideDhaka(
            String(data.outside_dhaka)
          );
        }

        if (data.free_shipping !== undefined) {
          setFreeShipping(
            String(data.free_shipping)
          );
        }

        // =================================================
        // PAYMENT
        // =================================================

        if (data.cash_on_delivery !== undefined) {
          setCashOnDelivery(
            Boolean(data.cash_on_delivery)
          );
        }

        if (data.ssl_commerz !== undefined) {
          setSslCommerz(
            Boolean(data.ssl_commerz)
          );
        }

        // =================================================
        // NOTIFICATIONS
        // =================================================

        if (
          data.new_order_notification !== undefined
        ) {
          setNewOrderNotification(
            Boolean(data.new_order_notification)
          );
        }

        if (
          data.low_stock_notification !== undefined
        ) {
          setLowStockNotification(
            Boolean(data.low_stock_notification)
          );
        }

        if (
          data.new_customer_notification !== undefined
        ) {
          setNewCustomerNotification(
            Boolean(data.new_customer_notification)
          );
        }

        if (
          data.review_notification !== undefined
        ) {
          setReviewNotification(
            Boolean(data.review_notification)
          );
        }

        // =================================================
        // PRODUCT
        // =================================================

        if (data.customer_review !== undefined) {
          setCustomerReview(
            Boolean(data.customer_review)
          );
        }

        if (data.product_rating !== undefined) {
          setProductRating(
            Boolean(data.product_rating)
          );
        }

        if (data.low_stock_limit !== undefined) {
          setLowStockLimit(
            String(data.low_stock_limit)
          );
        }

        // =================================================
        // COUPON
        // =================================================

        if (data.coupon_enabled !== undefined) {
          setCouponEnabled(
            Boolean(data.coupon_enabled)
          );
        }
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error?.response?.data || error
        );

        if (error?.response?.status === 401) {
          toast.error(
            "Your login session has expired."
          );
        } else {
          toast.error(
            getErrorMessage(
              error,
              "Failed to load settings."
            )
          );
        }
      } finally {
        if (mounted) {
          setLoadingSettings(false);
        }
      }
    };

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // LOGO CHANGE
  // =====================================================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Logo size must be less than 5MB."
      );
      e.target.value = "";
      return;
    }

    if (logo?.startsWith("blob:")) {
      URL.revokeObjectURL(logo);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setLogoFile(file);
    setLogo(previewUrl);
  };

  // =====================================================
  // ADMIN LOGO CHANGE
  // =====================================================

  const handleAdminLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Admin logo size must be less than 5MB."
      );
      e.target.value = "";
      return;
    }

    if (adminLogo?.startsWith("blob:")) {
      URL.revokeObjectURL(adminLogo);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setAdminLogoFile(file);
    setAdminLogo(previewUrl);
  };

  // =====================================================
  // SIDEBAR NAVBAR LOGO CHANGE
  // =====================================================

  const handleSidebarLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Sidebar navbar logo size must be less than 5MB."
      );
      e.target.value = "";
      return;
    }

    if (sidebarLogo?.startsWith("blob:")) {
      URL.revokeObjectURL(sidebarLogo);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSidebarLogoFile(file);
    setSidebarLogo(previewUrl);
  };

  // =====================================================
  // BANNER 1 CHANGE
  // =====================================================

  const handleBanner1Change = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error(
        "Banner 1 size must be less than 8MB."
      );
      e.target.value = "";
      return;
    }

    if (banner1?.startsWith("blob:")) {
      URL.revokeObjectURL(banner1);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setBanner1File(file);
    setBanner1(previewUrl);
  };

  // =====================================================
  // BANNER 2 CHANGE
  // =====================================================

  const handleBanner2Change = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error(
        "Banner 2 size must be less than 8MB."
      );
      e.target.value = "";
      return;
    }

    if (banner2?.startsWith("blob:")) {
      URL.revokeObjectURL(banner2);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setBanner2File(file);
    setBanner2(previewUrl);
  };

  // =====================================================
  // BANNER 3 CHANGE
  // =====================================================

  const handleBanner3Change = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error(
        "Banner 3 size must be less than 8MB."
      );
      e.target.value = "";
      return;
    }

    if (banner3?.startsWith("blob:")) {
      URL.revokeObjectURL(banner3);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setBanner3File(file);
    setBanner3(previewUrl);
  };

  // =====================================================
  // SAVE STORE SETTINGS
  // =====================================================

  const handleSaveStore = async () => {
    if (!storeName.trim()) {
      toast.error("Store name is required.");
      return;
    }

    if (!storeEmail.trim()) {
      toast.error("Store email is required.");
      return;
    }

    if (!storePhone.trim()) {
      toast.error("Store phone is required.");
      return;
    }

    try {
      setSavingStore(true);

      const token = getToken();

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      const payload = {
        store_name: storeName.trim(),
        store_email: storeEmail.trim(),
        store_phone: storePhone.trim(),
        store_address: storeAddress.trim(),
        currency,
      };

      await axios.put(
        `${API_URL}/api/settings/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        "Store settings saved successfully!"
      );
    } catch (error) {
      console.error(
        "Store settings error:",
        error?.response?.data || error
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to save store settings."
        )
      );
    } finally {
      setSavingStore(false);
    }
  };

  // =====================================================
  // SAVE BRANDING
  // =====================================================

  const handleSaveBranding = async () => {
    if (
      !logoFile &&
      !adminLogoFile &&
      !sidebarLogoFile &&
      !banner1File &&
      !banner2File &&
      !banner3File
    ) {
      toast.error(
        "Please select a logo, admin logo, sidebar logo or banner first."
      );
      return;
    }

    try {
      setSavingBranding(true);

      const token = getToken();

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      const formData = new FormData();

      // Website Logo
      if (logoFile instanceof File) {
        formData.append(
          "user_logo",
          logoFile
        );
      }

      // Admin Logo
      if (adminLogoFile instanceof File) {
        formData.append(
          "admin_logo",
          adminLogoFile
        );
      }

      // Sidebar Navbar Logo
      if (sidebarLogoFile instanceof File) {
        formData.append(
          "sidebar_logo",
          sidebarLogoFile
        );
      }

      // Banner 1
      if (banner1File instanceof File) {
        formData.append(
          "banner_1",
          banner1File
        );
      }

      // Banner 2
      if (banner2File instanceof File) {
        formData.append(
          "banner_2",
          banner2File
        );
      }

      // Banner 3
      if (banner3File instanceof File) {
        formData.append(
          "banner_3",
          banner3File
        );
      }

      const response = await axios.put(
        `${API_URL}/api/settings/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data || {};

      console.log(
        "BRANDING SAVE RESPONSE:",
        data
      );

      // =================================================
      // USER LOGO
      // =================================================

      if (data.user_logo) {
        const imageUrl =
          getImageUrl(data.user_logo);

        setLogo(imageUrl);

        localStorage.setItem(
          "userLogo",
          data.user_logo
        );
      }

      // =================================================
      // ADMIN LOGO
      // =================================================

      if (data.admin_logo) {
        const imageUrl =
          getImageUrl(data.admin_logo);

        setAdminLogo(imageUrl);

        localStorage.setItem(
          "adminLogo",
          data.admin_logo
        );
      }

      // =================================================
      // SIDEBAR NAVBAR LOGO
      // =================================================

      if (data.sidebar_logo) {
        const imageUrl =
          getImageUrl(data.sidebar_logo);

        setSidebarLogo(imageUrl);

        localStorage.setItem(
          "sidebarLogo",
          data.sidebar_logo
        );
      }

      // =================================================
      // BANNER 1
      // =================================================

      if (data.banner_1) {
        setBanner1(
          getImageUrl(data.banner_1)
        );
      }

      // =================================================
      // BANNER 2
      // =================================================

      if (data.banner_2) {
        setBanner2(
          getImageUrl(data.banner_2)
        );
      }

      // =================================================
      // BANNER 3
      // =================================================

      if (data.banner_3) {
        setBanner3(
          getImageUrl(data.banner_3)
        );
      }

      // =================================================
      // CLEAR FILE STATES
      // =================================================

      setLogoFile(null);
      setAdminLogoFile(null);
      setSidebarLogoFile(null);

      setBanner1File(null);
      setBanner2File(null);
      setBanner3File(null);

      // =================================================
      // BRANDING UPDATE EVENT
      // =================================================

      window.dispatchEvent(
        new CustomEvent(
          "brandingUpdated",
          {
            detail: {
              user_logo:
                data.user_logo || null,

              admin_logo:
                data.admin_logo || null,

              sidebar_logo:
                data.sidebar_logo || null,

              banner_1:
                data.banner_1 || null,

              banner_2:
                data.banner_2 || null,

              banner_3:
                data.banner_3 || null,
            },
          }
        )
      );

      toast.success(
        "Branding settings saved successfully!"
      );
    } catch (error) {
      console.error(
        "Branding save error:",
        error?.response?.data || error
      );

      if (error?.response?.status === 401) {
        toast.error(
          "Please login again."
        );
      } else if (
        error?.response?.status === 403
      ) {
        toast.error(
          "You do not have permission to update branding."
        );
      } else {
        toast.error(
          getErrorMessage(
            error,
            "Failed to save branding settings."
          )
        );
      }
    } finally {
      setSavingBranding(false);
    }
  };

  // =====================================================
  // CHANGE ADMIN EMAIL
  // =====================================================

  const handleChangeEmail = async () => {
    if (!adminName.trim()) {
      toast.error(
        "Please enter admin name."
      );
      return;
    }

    if (!adminEmail.trim()) {
      toast.error(
        "Please enter admin email."
      );
      return;
    }

    try {
      setChangingEmail(true);

      const token = getToken();

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      await axios.put(
        `${API_URL}/api/settings/`,
        {
          admin_name: adminName.trim(),
          admin_email: adminEmail.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        "Admin account updated successfully!"
      );

      window.dispatchEvent(
        new Event("adminSettingsUpdated")
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to update admin account."
        )
      );
    } finally {
      setChangingEmail(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirm password do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const token = getToken();

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      await axios.post(
        `${API_URL}/api/auth/change-password/`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        "Password changed successfully!"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to change password."
        )
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // SAVE OTHER SETTINGS
  // =====================================================

  const handleSaveOtherSettings = async () => {
    try {
      setSavingOtherSettings(true);

      const token = getToken();

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      const payload = {
        minimum_order:
          Number(minimumOrder) || 0,

        auto_cancel:
          autoCancel,

        inside_dhaka:
          Number(insideDhaka) || 0,

        outside_dhaka:
          Number(outsideDhaka) || 0,

        free_shipping:
          Number(freeShipping) || 0,

        cash_on_delivery:
          cashOnDelivery,

        ssl_commerz:
          sslCommerz,

        new_order_notification:
          newOrderNotification,

        low_stock_notification:
          lowStockNotification,

        new_customer_notification:
          newCustomerNotification,

        review_notification:
          reviewNotification,

        customer_review:
          customerReview,

        product_rating:
          productRating,

        low_stock_limit:
          Number(lowStockLimit) || 0,

        coupon_enabled:
          couponEnabled,
      };

      await axios.put(
        `${API_URL}/api/settings/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        "Settings saved successfully!"
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to save settings."
        )
      );
    } finally {
      setSavingOtherSettings(false);
    }
  };

  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      if (logo?.startsWith("blob:")) {
        URL.revokeObjectURL(logo);
      }

      if (adminLogo?.startsWith("blob:")) {
        URL.revokeObjectURL(adminLogo);
      }

      if (sidebarLogo?.startsWith("blob:")) {
        URL.revokeObjectURL(sidebarLogo);
      }

      if (banner1?.startsWith("blob:")) {
        URL.revokeObjectURL(banner1);
      }

      if (banner2?.startsWith("blob:")) {
        URL.revokeObjectURL(banner2);
      }

      if (banner3?.startsWith("blob:")) {
        URL.revokeObjectURL(banner3);
      }
    };
  }, [
    logo,
    adminLogo,
    sidebarLogo,
    banner1,
    banner2,
    banner3,
  ]);

  // =====================================================
  // SETTING CARD
  // =====================================================

  const SettingCard = ({
    icon,
    title,
    description,
    children,
  }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#DB4444]">
              {icon}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {title}
              </h2>

              {description && (
                <p className="text-sm text-gray-500 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    );
  };

  // =====================================================
  // TOGGLE
  // =====================================================

  const Toggle = ({
    checked,
    onChange,
  }) => {
    return (
      <button
        type="button"
        onClick={() =>
          onChange(!checked)
        }
        className={`relative w-12 h-6 rounded-full transition ${
          checked
            ? "bg-[#DB4444]"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
            checked
              ? "left-7"
              : "left-1"
          }`}
        />
      </button>
    );
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#DB4444] focus:ring-1 focus:ring-[#DB4444]";

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingSettings) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#DB4444] rounded-full animate-spin mx-auto" />

            <p className="text-sm text-gray-500 mt-3">
              Loading settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="mb-6">
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 bg-[#DB4444] text-white rounded-xl flex items-center justify-center">
            <FiSettings size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Settings
            </h1>

            <p className="text-sm text-gray-500">
              Manage your SmartBazar store and admin account
            </p>
          </div>

        </div>
      </div>

      <div className="space-y-6">

        {/* =================================================
            STORE INFORMATION
        ================================================= */}

        <SettingCard
          icon={<FiSettings size={20} />}
          title="Store Information"
          description="Manage your basic store information"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>

              <input
                type="text"
                value={storeName}
                onChange={(e) =>
                  setStoreName(e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Email
              </label>

              <input
                type="email"
                value={storeEmail}
                onChange={(e) =>
                  setStoreEmail(e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Phone
              </label>

              <input
                type="text"
                value={storePhone}
                onChange={(e) =>
                  setStorePhone(e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>

              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value)
                }
                className={inputClass}
              >
                <option value="BDT">
                  ৳ BDT
                </option>

                <option value="USD">
                  $ USD
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Address
              </label>

              <textarea
                rows="3"
                value={storeAddress}
                onChange={(e) =>
                  setStoreAddress(e.target.value)
                }
                className={inputClass}
              />
            </div>

          </div>

          <button
            onClick={handleSaveStore}
            disabled={savingStore}
            className="mt-5 flex items-center gap-2 bg-[#DB4444] hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium"
          >
            <FiSave />

            {savingStore
              ? "Saving..."
              : "Save Store Settings"}
          </button>

        </SettingCard>

        {/* =================================================
            WEBSITE BRANDING
        ================================================= */}

        <SettingCard
          icon={<FiImage size={20} />}
          title="Website Branding"
          description="Manage logos and banners displayed across SmartBazar"
        >

          {/* 6 CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* =================================================
                WEBSITE LOGO
            ================================================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Logo
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5">

                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden">

                  {logo ? (
                    <img
                      src={logo}
                      alt="Website Logo"
                      className="max-h-24 max-w-[220px] object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage
                        size={35}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm">
                        No logo selected
                      </p>
                    </div>
                  )}

                </div>

                <label className="cursor-pointer flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50">

                  <FiUpload />

                  Choose Logo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                </label>

              </div>
            </div>

            {/* =================================================
                ADMIN LOGO
            ================================================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Logo
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5">

                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden">

                  {adminLogo ? (
                    <img
                      src={adminLogo}
                      alt="Admin Logo"
                      className="max-h-24 max-w-[220px] object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage
                        size={35}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm">
                        No admin logo selected
                      </p>
                    </div>
                  )}

                </div>

                <label className="cursor-pointer flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50">

                  <FiUpload />

                  Choose Admin Logo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAdminLogoChange}
                    className="hidden"
                  />

                </label>

              </div>
            </div>

            {/* =================================================
                SIDEBAR NAVBAR LOGO
            ================================================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sidebar Navbar Logo
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5">

                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden">

                  {sidebarLogo ? (
                    <img
                      src={sidebarLogo}
                      alt="Sidebar Navbar Logo"
                      className="max-h-24 max-w-[220px] object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage
                        size={35}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm">
                        No sidebar logo selected
                      </p>
                    </div>
                  )}

                </div>

                <label className="cursor-pointer flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50">

                  <FiUpload />

                  Choose Sidebar Logo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSidebarLogoChange}
                    className="hidden"
                  />

                </label>

              </div>
            </div>

            {/* =================================================
                BANNER 1
            ================================================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Banner 1
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5">

                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden">

                  {banner1 ? (
                    <img
                      src={banner1}
                      alt="Website Banner 1"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage
                        size={35}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm">
                        No banner 1 selected
                      </p>
                    </div>
                  )}

                </div>

                <label className="cursor-pointer flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50">

                  <FiUpload />

                  Choose Banner 1

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBanner1Change}
                    className="hidden"
                  />

                </label>

              </div>
            </div>

            {/* =================================================
                BANNER 2
            ================================================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Banner 2
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5">

                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden">

                  {banner2 ? (
                    <img
                      src={banner2}
                      alt="Website Banner 2"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage
                        size={35}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm">
                        No banner 2 selected
                      </p>
                    </div>
                  )}

                </div>

                <label className="cursor-pointer flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50">

                  <FiUpload />

                  Choose Banner 2

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBanner2Change}
                    className="hidden"
                  />

                </label>

              </div>
            </div>

            {/* =================================================
                BANNER 3
            ================================================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Banner 3
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5">

                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden">

                  {banner3 ? (
                    <img
                      src={banner3}
                      alt="Website Banner 3"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage
                        size={35}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm">
                        No banner 3 selected
                      </p>
                    </div>
                  )}

                </div>

                <label className="cursor-pointer flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50">

                  <FiUpload />

                  Choose Banner 3

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBanner3Change}
                    className="hidden"
                  />

                </label>

              </div>
            </div>

          </div>

          {/* SAVE BRANDING */}

          <button
            onClick={handleSaveBranding}
            disabled={savingBranding}
            className="mt-5 flex items-center gap-2 bg-[#DB4444] hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium"
          >
            <FiSave />

            {savingBranding
              ? "Saving..."
              : "Save Branding"}
          </button>

        </SettingCard>

        {/* =================================================
            ADMIN ACCOUNT
        ================================================= */}

        <SettingCard
          icon={<FiUser size={20} />}
          title="Admin Account"
          description="Manage your admin account information"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Name
              </label>

              <input
                type="text"
                value={adminName}
                onChange={(e) =>
                  setAdminName(e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>

              <div className="relative">

                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) =>
                    setAdminEmail(e.target.value)
                  }
                  className={`${inputClass} pl-11`}
                />

              </div>
            </div>

          </div>

          <button
            onClick={handleChangeEmail}
            disabled={changingEmail}
            className="mt-5 flex items-center gap-2 bg-[#DB4444] hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium"
          >
            <FiMail />

            {changingEmail
              ? "Updating..."
              : "Update Email"}
          </button>

        </SettingCard>

        {/* =================================================
            CHANGE PASSWORD
        ================================================= */}

        <SettingCard
          icon={<FiLock size={20} />}
          title="Change Password"
          description="Update your admin login password"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* CURRENT PASSWORD */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>

              <div className="relative">

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCurrentPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>
            </div>

            {/* NEW PASSWORD */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>

              <div className="relative">

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>
            </div>

          </div>

          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="mt-5 flex items-center gap-2 bg-[#DB4444] hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium"
          >
            <FiLock />

            {changingPassword
              ? "Changing..."
              : "Change Password"}
          </button>

        </SettingCard>

        {/* =================================================
            ORDER SETTINGS
        ================================================= */}

        <SettingCard
          icon={<FiPackage size={20} />}
          title="Order Settings"
          description="Manage order related preferences"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Amount (৳)
              </label>

              <input
                type="number"
                min="0"
                value={minimumOrder}
                onChange={(e) =>
                  setMinimumOrder(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-4">

              <div>
                <p className="font-medium text-gray-700">
                  Auto Cancel Pending Orders
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Automatically cancel old pending orders
                </p>
              </div>

              <Toggle
                checked={autoCancel}
                onChange={setAutoCancel}
              />

            </div>

          </div>
        </SettingCard>

        {/* =================================================
            SHIPPING
        ================================================= */}

        <SettingCard
          icon={<FiTruck size={20} />}
          title="Shipping Settings"
          description="Manage shipping charges"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inside Dhaka (৳)
              </label>

              <input
                type="number"
                min="0"
                value={insideDhaka}
                onChange={(e) =>
                  setInsideDhaka(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outside Dhaka (৳)
              </label>

              <input
                type="number"
                min="0"
                value={outsideDhaka}
                onChange={(e) =>
                  setOutsideDhaka(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Above (৳)
              </label>

              <input
                type="number"
                min="0"
                value={freeShipping}
                onChange={(e) =>
                  setFreeShipping(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

          </div>
        </SettingCard>

        {/* =================================================
            PAYMENT
        ================================================= */}

        <SettingCard
          icon={<FiCreditCard size={20} />}
          title="Payment Settings"
          description="Manage available payment methods"
        >
          <div className="space-y-4">

            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">

              <div>
                <p className="font-medium text-gray-700">
                  Cash on Delivery
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Allow customers to pay when they receive
                  their order
                </p>
              </div>

              <Toggle
                checked={cashOnDelivery}
                onChange={setCashOnDelivery}
              />

            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">

              <div>
                <p className="font-medium text-gray-700">
                  SSLCommerz
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Enable online payment through SSLCommerz
                </p>
              </div>

              <Toggle
                checked={sslCommerz}
                onChange={setSslCommerz}
              />

            </div>

          </div>
        </SettingCard>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <SettingCard
          icon={<FiBell size={20} />}
          title="Notifications"
          description="Choose which notifications you want to receive"
        >
          <div className="space-y-4">

            {[
              [
                "New Order Notification",
                newOrderNotification,
                setNewOrderNotification,
              ],
              [
                "Low Stock Notification",
                lowStockNotification,
                setLowStockNotification,
              ],
              [
                "New Customer Notification",
                newCustomerNotification,
                setNewCustomerNotification,
              ],
              [
                "New Review Notification",
                reviewNotification,
                setReviewNotification,
              ],
            ].map(
              ([title, checked, setter]) => (
                <div
                  key={title}
                  className="flex items-center justify-between border border-gray-200 rounded-xl p-4"
                >
                  <p className="font-medium text-gray-700">
                    {title}
                  </p>

                  <Toggle
                    checked={checked}
                    onChange={setter}
                  />
                </div>
              )
            )}

          </div>
        </SettingCard>

        {/* =================================================
            PRODUCT SETTINGS
        ================================================= */}

        <SettingCard
          icon={<FiPackage size={20} />}
          title="Product Settings"
          description="Manage product related settings"
        >
          <div className="space-y-4">

            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">

              <div>
                <p className="font-medium text-gray-700">
                  Customer Reviews
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Allow customers to submit product reviews
                </p>
              </div>

              <Toggle
                checked={customerReview}
                onChange={setCustomerReview}
              />

            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">

              <div>
                <p className="font-medium text-gray-700">
                  Product Rating
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Allow customers to rate products
                </p>
              </div>

              <Toggle
                checked={productRating}
                onChange={setProductRating}
              />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Alert Quantity
              </label>

              <input
                type="number"
                min="0"
                value={lowStockLimit}
                onChange={(e) =>
                  setLowStockLimit(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

          </div>
        </SettingCard>

        {/* =================================================
            COUPON SETTINGS
        ================================================= */}

        <SettingCard
          icon={<FiTag size={20} />}
          title="Coupon Settings"
          description="Manage coupon and discount features"
        >
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">

            <div>
              <p className="font-medium text-gray-700">
                Enable Coupons
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Allow customers to use discount coupons
              </p>
            </div>

            <Toggle
              checked={couponEnabled}
              onChange={setCouponEnabled}
            />

          </div>
        </SettingCard>

        {/* =================================================
            SAVE ALL SETTINGS
        ================================================= */}

        <div className="flex justify-end">

          <button
            onClick={handleSaveOtherSettings}
            disabled={savingOtherSettings}
            className="flex items-center gap-2 bg-[#DB4444] hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-medium"
          >
            <FiSave />

            {savingOtherSettings
              ? "Saving..."
              : "Save All Settings"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default Settings;

