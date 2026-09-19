import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiPackage,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiPlus,
  FiMinus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

const AdminInventory = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [currentPage, setCurrentPage] = useState(1);

  const [showStockModal, setShowStockModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [stockAction, setStockAction] = useState("increase");

  const [addStockProductId, setAddStockProductId] = useState("");

  const [quantity, setQuantity] = useState("");

  const itemsPerPage = 7;

  // =====================================================
  // AUTH CONFIG
  // =====================================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("accessToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${BASEURL}${
      image.startsWith("/") ? image : `/${image}`
    }`;
  };

  // =====================================================
  // CATEGORY ID
  // =====================================================

  const getCategoryId = (category) => {
    if (!category) {
      return "";
    }

    if (typeof category === "object") {
      return (
        category.id ??
        category.pk ??
        category.category_id ??
        ""
      );
    }

    return category;
  };

  // =====================================================
  // CATEGORY NAME
  // =====================================================

  const getCategoryName = (category) => {
    if (!category) {
      return "—";
    }

    if (typeof category === "object") {
      return (
        category.name ||
        category.title ||
        "—"
      );
    }

    const categoryId = getCategoryId(category);

    const found = categories.find(
      (item) =>
        String(item.id) === String(categoryId)
    );

    return (
      found?.name ||
      found?.title ||
      "—"
    );
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASEURL}/api/products/`,
        getAuthConfig()
      );

      const data = response.data;

      const productList = Array.isArray(data)
        ? data
        : data?.results || [];

      setProducts(productList);
    } catch (error) {
      console.error(
        "INVENTORY PRODUCT ERROR:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error("Please login again.", {
          toastId: "admin-login-error",
        });
      } else {
        toast.error(
          "Failed to load inventory."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/categories/`,
        getAuthConfig()
      );

      const data = response.data;

      const categoryList = Array.isArray(data)
        ? data
        : data?.results || [];

      setCategories(categoryList);
    } catch (error) {
      console.error(
        "CATEGORY ERROR:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error("Please login again.", {
          toastId: "admin-login-error",
        });
      }
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (product) => {
    const stock = Number(product.stock || 0);

    if (
      product.available === false ||
      stock <= 0
    ) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-50 text-red-600 border-red-200",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className:
          "bg-amber-50 text-amber-600 border-amber-200",
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-emerald-50 text-emerald-600 border-emerald-200",
    };
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const total = products.length;

    const inStock = products.filter(
      (product) =>
        product.available !== false &&
        Number(product.stock || 0) > 10
    ).length;

    const lowStock = products.filter(
      (product) =>
        product.available !== false &&
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <= 10
    ).length;

    const outOfStock = products.filter(
      (product) =>
        product.available === false ||
        Number(product.stock || 0) <= 0
    ).length;

    return {
      total,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [products]);

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredProducts = useMemo(() => {
    let data = [...products];

    // SEARCH
    if (search.trim()) {
      const keyword = search
        .toLowerCase()
        .trim();

      data = data.filter((product) => {
        const name = String(
          product.name || ""
        ).toLowerCase();

        const id = String(
          product.id || ""
        ).toLowerCase();

        const category = getCategoryName(
          product.category
        ).toLowerCase();

        const sku = `sku-${product.id}`.toLowerCase();

        return (
          name.includes(keyword) ||
          id.includes(keyword) ||
          category.includes(keyword) ||
          sku.includes(keyword)
        );
      });
    }

    // STATUS FILTER
    if (statusFilter !== "all") {
      data = data.filter((product) => {
        const stock = Number(
          product.stock || 0
        );

        if (statusFilter === "in_stock") {
          return (
            product.available !== false &&
            stock > 10
          );
        }

        if (statusFilter === "low_stock") {
          return (
            product.available !== false &&
            stock > 0 &&
            stock <= 10
          );
        }

        if (statusFilter === "out_of_stock") {
          return (
            product.available === false ||
            stock <= 0
          );
        }

        return true;
      });
    }

    // CATEGORY FILTER
    if (categoryFilter !== "all") {
      data = data.filter(
        (product) =>
          String(
            getCategoryId(
              product.category
            )
          ) === String(categoryFilter)
      );
    }

    // SORT
    if (sortBy === "name") {
      data.sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
    }

    if (sortBy === "stock_high") {
      data.sort(
        (a, b) =>
          Number(b.stock || 0) -
          Number(a.stock || 0)
      );
    }

    if (sortBy === "stock_low") {
      data.sort(
        (a, b) =>
          Number(a.stock || 0) -
          Number(b.stock || 0)
      );
    }

    if (sortBy === "price_high") {
      data.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sortBy === "price_low") {
      data.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    return data;
  }, [
    products,
    search,
    statusFilter,
    categoryFilter,
    sortBy,
    categories,
  ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        itemsPerPage
    )
  );

  const paginatedProducts =
    filteredProducts.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage *
        itemsPerPage
    );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =====================================================
  // OPEN STOCK MODAL
  // =====================================================

  const openStockModal = (
    product = null,
    action = "increase"
  ) => {
    setSelectedProduct(product);
    setStockAction(action);
    setQuantity("");

    if (product) {
      setAddStockProductId(
        String(product.id)
      );
    } else {
      setAddStockProductId("");
    }

    setShowStockModal(true);
  };

  // =====================================================
  // CLOSE STOCK MODAL
  // =====================================================

  const closeStockModal = () => {
    if (saving) {
      return;
    }

    setShowStockModal(false);
    setSelectedProduct(null);
    setAddStockProductId("");
    setQuantity("");
  };

  // =====================================================
  // SELECT PRODUCT FOR ADD STOCK
  // =====================================================

  const handleSelectStockProduct = (e) => {
    const productId = e.target.value;

    setAddStockProductId(productId);

    if (!productId) {
      setSelectedProduct(null);
      return;
    }

    const product = products.find(
      (item) =>
        String(item.id) ===
        String(productId)
    );

    if (product) {
      setSelectedProduct(product);
    }
  };

  // =====================================================
  // UPDATE STOCK
  // =====================================================

  const handleUpdateStock = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("Please select a product.");
      return;
    }

    const qty = Number(quantity);

    if (!quantity || qty <= 0) {
      toast.error(
        "Please enter a valid quantity."
      );
      return;
    }

    const currentStock = Number(
      selectedProduct.stock || 0
    );

    let newStock = currentStock;

    if (stockAction === "increase") {
      newStock = currentStock + qty;
    } else {
      newStock = currentStock - qty;

      if (newStock < 0) {
        toast.error(
          "Stock cannot be negative."
        );
        return;
      }
    }

    try {
      setSaving(true);

      /*
        IMPORTANT:
        PATCH only updates stock + available.
        We don't need to send name/category/price/image.
      */

      const newAvailable =
        newStock > 0
          ? selectedProduct.available !== false
          : false;

      await axios.patch(
        `${BASEURL}/api/products/${selectedProduct.id}/`,
        {
          stock: newStock,
          available: newAvailable,
        },
        getAuthConfig()
      );

      // Update UI immediately
      setProducts((prev) =>
        prev.map((item) =>
          item.id === selectedProduct.id
            ? {
                ...item,
                stock: newStock,
                available: newAvailable,
              }
            : item
        )
      );

      toast.success(
        stockAction === "increase"
          ? `Stock increased by ${qty}.`
          : `Stock decreased by ${qty}.`
      );

      closeStockModal();
    } catch (error) {
      console.error(
        "UPDATE STOCK ERROR:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error(
          "Please login again.",
          {
            toastId:
              "admin-login-error",
          }
        );
      } else {
        toast.error(
          error.response?.data
            ?.detail ||
            "Failed to update stock."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // TOGGLE AVAILABLE
  // =====================================================

  const handleToggleAvailable = async (
    product
  ) => {
    try {
      const newAvailable =
        !Boolean(product.available);

      await axios.patch(
        `${BASEURL}/api/products/${product.id}/`,
        {
          available: newAvailable,
        },
        getAuthConfig()
      );

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                available:
                  newAvailable,
              }
            : item
        )
      );

      toast.success(
        newAvailable
          ? "Product enabled."
          : "Product disabled."
      );
    } catch (error) {
      console.error(
        "TOGGLE ERROR:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error(
          "Please login again.",
          {
            toastId:
              "admin-login-error",
          }
        );
      } else {
        toast.error(
          "Failed to update availability."
        );
      }
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (
    product
  ) => {
    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `${BASEURL}/api/products/${product.id}/`,
        getAuthConfig()
      );

      toast.success(
        "Product deleted successfully."
      );

      setProducts((prev) =>
        prev.filter(
          (item) =>
            item.id !== product.id
        )
      );
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error(
          "Please login again.",
          {
            toastId:
              "admin-login-error",
          }
        );
      } else {
        toast.error(
          error.response?.data
            ?.detail ||
            "Failed to delete product."
        );
      }
    }
  };

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const changePage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Inventory Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track and manage your product stock levels
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            openStockModal(
              null,
              "increase"
            )
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <FiPlus size={18} />

          Add Stock
        </button>
      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {statistics.total}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                In your inventory
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FiPackage size={23} />
            </div>
          </div>
        </div>

        {/* IN STOCK */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                In Stock
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {statistics.inStock}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Available for sale
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <FiCheckCircle size={23} />
            </div>
          </div>
        </div>

        {/* LOW STOCK */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Low Stock
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {statistics.lowStock}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Needs attention
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <FiAlertTriangle size={23} />
            </div>
          </div>
        </div>

        {/* OUT OF STOCK */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Out of Stock
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {statistics.outOfStock}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Not available
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FiXCircle size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          FILTER BAR
      ================================================= */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* SEARCH */}

          <div className="relative">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              placeholder="Search products, categories, SKU..."
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* STATUS */}

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">
                All Status
              </option>

              <option value="in_stock">
                In Stock
              </option>

              <option value="low_stock">
                Low Stock
              </option>

              <option value="out_of_stock">
                Out of Stock
              </option>
            </select>

            <FiChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* CATEGORY */}

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name ||
                      category.title}
                  </option>
                )
              )}
            </select>

            <FiChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* SORT */}

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="name">
                Name (A-Z)
              </option>

              <option value="stock_high">
                Stock High to Low
              </option>

              <option value="stock_low">
                Stock Low to High
              </option>

              <option value="price_high">
                Price High to Low
              </option>

              <option value="price_low">
                Price Low to High
              </option>
            </select>

            <FiChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-[1000px] w-full">

            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                <th className="px-5 py-4">
                  Product
                </th>

                <th className="px-5 py-4">
                  SKU
                </th>

                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Current Stock
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Available
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Loading inventory...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <FiPackage
                        size={38}
                        className="mb-3 text-slate-300"
                      />

                      <p className="text-sm font-medium text-slate-600">
                        No products found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(
                  (product) => {
                    const status =
                      getStatus(product);

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* PRODUCT */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">

                              {getImageUrl(
                                product.image
                              ) ? (
                                <img
                                  src={getImageUrl(
                                    product.image
                                  )}
                                  alt={
                                    product.name
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                  <FiPackage
                                    size={21}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[200px] truncate text-sm font-semibold text-slate-800">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                ৳
                                {Number(
                                  product.price || 0
                                ).toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>

                            </div>
                          </div>
                        </td>

                        {/* SKU */}

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-slate-600">
                            SKU-
                            {product.id}
                          </span>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-600">
                            {getCategoryName(
                              product.category
                            )}
                          </span>
                        </td>

                        {/* STOCK */}

                        <td className="px-5 py-4">
                          <span
                            className={`text-sm font-bold ${
                              Number(
                                product.stock || 0
                              ) <= 10
                                ? "text-amber-600"
                                : "text-slate-700"
                            }`}
                          >
                            {product.stock ?? 0}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        {/* AVAILABLE */}

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleAvailable(
                                product
                              )
                            }
                            className={`relative h-6 w-11 rounded-full transition ${
                              product.available
                                ? "bg-blue-600"
                                : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                product.available
                                  ? "left-6"
                                  : "left-1"
                              }`}
                            />
                          </button>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">

                            {/* INCREASE */}

                            <button
                              type="button"
                              onClick={() =>
                                openStockModal(
                                  product,
                                  "increase"
                                )
                              }
                              title="Increase Stock"
                              className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100"
                            >
                              <FiPlus size={16} />
                            </button>

                            {/* DECREASE */}

                            <button
                              type="button"
                              onClick={() =>
                                openStockModal(
                                  product,
                                  "decrease"
                                )
                              }
                              title="Decrease Stock"
                              className="rounded-lg bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100"
                            >
                              <FiMinus size={16} />
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                openStockModal(
                                  product,
                                  "increase"
                                )
                              }
                              title="Update Stock"
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                            >
                              <FiEdit2 size={16} />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  product
                                )
                              }
                              title="Delete"
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            >
                              <FiTrash2 size={16} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

          <p className="text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-700">
              {filteredProducts.length === 0
                ? 0
                : (currentPage - 1) *
                    itemsPerPage +
                  1}
            </span>

            {" "}to{" "}

            <span className="font-semibold text-slate-700">
              {Math.min(
                currentPage *
                  itemsPerPage,
                filteredProducts.length
              )}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-700">
              {filteredProducts.length}
            </span>

            {" "}products
          </p>

          <div className="flex items-center gap-1">

            <button
              type="button"
              onClick={() =>
                changePage(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft
                size={17}
              />
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            )
              .slice(0, 5)
              .map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() =>
                    changePage(page)
                  }
                  className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              onClick={() =>
                changePage(
                  currentPage + 1
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronRight
                size={17}
              />
            </button>

          </div>
        </div>
      </div>

      {/* =================================================
          STOCK MODAL
      ================================================= */}

      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">

          <div className="my-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selectedProduct
                    ? "Update Stock"
                    : "Add Stock"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Adjust product inventory
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeStockModal
                }
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <FiX size={19} />
              </button>

            </div>

            {/* SELECT PRODUCT */}

            {!selectedProduct && (
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Product
                </label>

                <div className="relative">

                  <select
                    value={
                      addStockProductId
                    }
                    onChange={
                      handleSelectStockProduct
                    }
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >

                    <option value="">
                      Select a product
                    </option>

                    {products.map(
                      (product) => (
                        <option
                          key={
                            product.id
                          }
                          value={
                            product.id
                          }
                        >
                          {product.name} — Stock:{" "}
                          {product.stock ?? 0}
                        </option>
                      )
                    )}

                  </select>

                  <FiChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>
              </div>
            )}

            {/* PRODUCT INFO */}

            {selectedProduct && (
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">

                    {getImageUrl(
                      selectedProduct.image
                    ) ? (
                      <img
                        src={getImageUrl(
                          selectedProduct.image
                        )}
                        alt={
                          selectedProduct.name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <FiPackage
                          size={22}
                        />
                      </div>
                    )}

                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate text-sm font-bold text-slate-800">
                      {
                        selectedProduct.name
                      }
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      SKU: SKU-
                      {
                        selectedProduct.id
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Current Stock:{" "}
                      <span className="font-semibold text-slate-700">
                        {
                          selectedProduct.stock ??
                          0
                        }
                      </span>
                    </p>

                  </div>
                </div>

              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={
                handleUpdateStock
              }
              className="space-y-5 p-5 sm:p-6"
            >

              {/* ACTION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Stock Action
                </label>

                <select
                  value={
                    stockAction
                  }
                  onChange={(e) =>
                    setStockAction(
                      e.target.value
                    )
                  }
                  disabled={
                    !selectedProduct ||
                    saving
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50"
                >

                  <option value="increase">
                    Increase Stock
                  </option>

                  <option value="decrease">
                    Decrease Stock
                  </option>

                </select>

              </div>

              {/* QUANTITY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                  disabled={
                    !selectedProduct ||
                    saving
                  }
                  placeholder="Enter quantity"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

              </div>

              {/* NEW STOCK */}

              {selectedProduct && (
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    New Stock
                  </label>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">

                    {(() => {
                      const current =
                        Number(
                          selectedProduct.stock ||
                            0
                        );

                      const qty =
                        Number(
                          quantity || 0
                        );

                      return stockAction ===
                        "increase"
                        ? current +
                            qty
                        : Math.max(
                            0,
                            current -
                              qty
                          );
                    })()}

                  </div>
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">

                <button
                  type="button"
                  onClick={
                    closeStockModal
                  }
                  disabled={saving}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !selectedProduct ||
                    !quantity
                  }
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving
                    ? "Updating..."
                    : stockAction ===
                      "increase"
                    ? "Add Stock"
                    : "Decrease Stock"}

                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;