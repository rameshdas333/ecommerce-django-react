import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiX,
  FiImage,
} from "react-icons/fi";
import { toast } from "react-toastify";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

const AdminProducts = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockSort, setStockSort] = useState("high");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    rating: "0",
    available: true,
    image: null,
  });

  const itemsPerPage = 10;

  // =====================================================
  // AUTH HEADER
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
    if (!image) return null;

    if (typeof image !== "string") return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `${BASEURL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  // =====================================================
  // GET PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASEURL}/api/products/`,
        {
          ...getAuthConfig(),
          params: {
            search: search || undefined,
            page: currentPage,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(data);

        setTotalPages(
          Math.max(
            1,
            Math.ceil(data.length / itemsPerPage)
          )
        );
      } else {
        setProducts(data?.results || []);

        const total = Number(data?.count || 0);

        setTotalPages(
          Math.max(
            1,
            Math.ceil(total / itemsPerPage)
          )
        );
      }
    } catch (error) {
      console.error(
        "Product loading error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error("Please login again.", {
          toastId: "admin-login-error",
        });
      } else {
        toast.error("Failed to load products.", {
          toastId: "products-load-error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET CATEGORIES
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

      console.log("CATEGORIES:", categoryList);
    } catch (error) {
      console.error(
        "Category loading error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error("Please login again.", {
          toastId: "admin-login-error",
        });
      } else {
        toast.error("Failed to load categories.", {
          toastId: "category-load-error",
        });
      }
    }
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const processedProducts = useMemo(() => {
    let data = [...products];

    if (statusFilter === "active") {
      data = data.filter(
        (product) =>
          product.available === true &&
          Number(product.stock) > 0
      );
    }

    if (statusFilter === "inactive") {
      data = data.filter(
        (product) =>
          product.available === false ||
          Number(product.stock) <= 0
      );
    }

    if (statusFilter === "low") {
      data = data.filter(
        (product) =>
          Number(product.stock) > 0 &&
          Number(product.stock) <= 10
      );
    }

    data.sort((a, b) => {
      const stockA = Number(a.stock || 0);
      const stockB = Number(b.stock || 0);

      return stockSort === "high"
        ? stockB - stockA
        : stockA - stockB;
    });

    return data;
  }, [products, statusFilter, stockSort]);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleInputChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files?.[0] || null
            : value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      rating: "0",
      available: true,
      image: null,
    });

    setEditingProduct(null);
  };

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = () => {
    resetForm();
    setShowModal(true);
  };

  // =====================================================
  // GET CATEGORY ID
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
        category.value ??
        ""
      );
    }

    return category;
  };

  // =====================================================
  // GET CATEGORY NAME
  // =====================================================

  const getCategoryName = (category) => {
    if (!category) {
      return "—";
    }

    if (typeof category === "object") {
      if (category.name || category.title) {
        return category.name || category.title;
      }
    }

    const categoryId =
      typeof category === "object"
        ? (
            category.id ??
            category.pk ??
            category.category_id ??
            ""
          )
        : category;

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
  // EDIT PRODUCT
  // =====================================================

  const handleEditProduct = (product) => {
    const categoryId = getCategoryId(
      product.category
    );

    console.log(
      "EDIT PRODUCT CATEGORY:",
      product.category
    );

    console.log(
      "EDIT CATEGORY ID:",
      categoryId
    );

    setEditingProduct(product);

    setFormData({
      name: product.name || "",

      // DESCRIPTION
      description: product.description || "",

      category: categoryId,

      price: product.price ?? "",

      stock: product.stock ?? "",

      rating: product.rating ?? "0",

      available:
        product.available !== undefined
          ? product.available
          : true,

      image: null,
    });

    setShowModal(true);
  };

  // =====================================================
  // CREATE / UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!formData.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Product description is required.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    if (formData.price === "") {
      toast.error("Price is required.");
      return;
    }

    if (formData.stock === "") {
      toast.error("Stock is required.");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      // =================================================
      // PRODUCT NAME
      // =================================================

      data.append(
        "name",
        formData.name.trim()
      );

      // =================================================
      // PRODUCT DESCRIPTION
      // =================================================

      data.append(
        "description",
        formData.description.trim()
      );

      // =================================================
      // CATEGORY
      // =================================================

      data.append(
        "category_id",
        String(
          getCategoryId(
            formData.category
          )
        )
      );

      // =================================================
      // PRICE
      // =================================================

      data.append(
        "price",
        String(formData.price)
      );

      // =================================================
      // STOCK
      // =================================================

      data.append(
        "stock",
        String(formData.stock)
      );

      // =================================================
      // RATING
      // =================================================

      data.append(
        "rating",
        String(formData.rating || 0)
      );

      // =================================================
      // AVAILABLE
      // =================================================

      data.append(
        "available",
        String(formData.available)
      );

      // =================================================
      // IMAGE
      // =================================================

      if (formData.image) {
        data.append(
          "image",
          formData.image
        );
      }

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "========== PRODUCT FORM DATA =========="
      );

      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      console.log(
        "========================================"
      );

      // =================================================
      // UPDATE
      // =================================================

      if (editingProduct) {
        await axios.put(
          `${BASEURL}/api/products/${editingProduct.id}/`,
          data,
          {
            ...getAuthConfig(),
            headers: {
              ...getAuthConfig().headers,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Product updated successfully."
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        await axios.post(
          `${BASEURL}/api/products/`,
          data,
          {
            ...getAuthConfig(),
            headers: {
              ...getAuthConfig().headers,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Product added successfully."
        );
      }

      // =================================================
      // CLOSE MODAL
      // =================================================

      setShowModal(false);

      // =================================================
      // RESET FORM
      // =================================================

      resetForm();

      // =================================================
      // REFRESH PRODUCTS
      // =================================================

      await fetchProducts();

    } catch (error) {
      console.error(
        "SAVE PRODUCT ERROR:",
        error
      );

      console.log(
        "BACKEND ERROR:",
        error.response?.data
      );

      const backendError =
        error.response?.data;

      if (
        backendError?.description
      ) {
        toast.error(
          `Description: ${
            Array.isArray(
              backendError.description
            )
              ? backendError.description.join(
                  ", "
                )
              : backendError.description
          }`
        );
      }

      else if (
        backendError?.category_id
      ) {
        toast.error(
          `Category: ${
            Array.isArray(
              backendError.category_id
            )
              ? backendError.category_id.join(
                  ", "
                )
              : backendError.category_id
          }`
        );
      }

      else if (
        backendError?.category
      ) {
        toast.error(
          `Category: ${
            Array.isArray(
              backendError.category
            )
              ? backendError.category.join(
                  ", "
                )
              : backendError.category
          }`
        );
      }

      else if (
        backendError?.detail
      ) {
        toast.error(
          backendError.detail
        );
      }

      else {
        toast.error(
          "Failed to save product."
        );
      }

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDeleteProduct = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `${BASEURL}/api/products/${id}/`,
        getAuthConfig()
      );

      toast.success(
        "Product deleted successfully."
      );

      await fetchProducts();

    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error("Please login again.", {
          toastId: "admin-login-error",
        });

        return;
      }

      toast.error(
        error.response?.data?.detail ||
        "Failed to delete product."
      );
    }
  };

  // =====================================================
  // DUPLICATE PRODUCT
  // =====================================================

  const handleDuplicateProduct = async (product) => {
    try {
      const categoryId =
        getCategoryId(product.category);

      console.log(
        "Original product:",
        product
      );

      console.log(
        "Category:",
        product.category
      );

      console.log(
        "Category ID:",
        categoryId
      );

      console.log(
        "Original Image:",
        product.image
      );

      if (!categoryId) {
        toast.error(
          "Category not found for this product."
        );

        return;
      }

      const data = new FormData();

      // =================================================
      // PRODUCT NAME
      // =================================================

      data.append(
        "name",
        `${product.name || "Product"} Copy`
      );

      // =================================================
      // DESCRIPTION
      // =================================================

      data.append(
        "description",
        product.description || ""
      );

      // =================================================
      // CATEGORY
      // =================================================

      data.append(
        "category_id",
        String(categoryId)
      );

      // =================================================
      // PRICE
      // =================================================

      data.append(
        "price",
        String(product.price || 0)
      );

      // =================================================
      // STOCK
      // =================================================

      data.append(
        "stock",
        String(product.stock || 0)
      );

      // =================================================
      // RATING
      // =================================================

      data.append(
        "rating",
        String(product.rating || 0)
      );

      // =================================================
      // AVAILABLE
      // =================================================

      data.append(
        "available",
        String(
          product.available ?? true
        )
      );

      // =================================================
      // COPY ORIGINAL IMAGE
      // =================================================

      if (product.image) {
        try {
          const imageUrl =
            getImageUrl(product.image);

          console.log(
            "Image URL:",
            imageUrl
          );

          const imageResponse =
            await fetch(imageUrl);

          if (imageResponse.ok) {
            const imageBlob =
              await imageResponse.blob();

            const imagePath =
              product.image.split("/");

            const originalFileName =
              imagePath[
                imagePath.length - 1
              ] ||
              "product-image.jpg";

            data.append(
              "image",
              imageBlob,
              originalFileName
            );

            console.log(
              "Image copied successfully:",
              originalFileName
            );
          } else {
            console.log(
              "Could not fetch original image."
            );
          }

        } catch (imageError) {
          console.error(
            "Image copy error:",
            imageError
          );
        }
      }

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "========== DUPLICATE FORM DATA =========="
      );

      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      console.log(
        "=========================================="
      );

      // =================================================
      // CREATE DUPLICATE
      // =================================================

      const response =
        await axios.post(
          `${BASEURL}/api/products/`,
          data,
          {
            ...getAuthConfig(),
            headers: {
              ...getAuthConfig().headers,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        "DUPLICATE RESPONSE:",
        response.data
      );

      toast.success(
        "Product duplicated successfully."
      );

      await fetchProducts();

    } catch (error) {
      console.error(
        "DUPLICATE ERROR:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        toast.error("Please login again.", {
          toastId: "admin-login-error",
        });

        return;
      }

      const backendError =
        error.response?.data;

      if (
        backendError?.description
      ) {
        toast.error(
          `Description: ${
            Array.isArray(
              backendError.description
            )
              ? backendError.description.join(
                  ", "
                )
              : backendError.description
          }`
        );
      }

      else if (
        backendError?.category_id
      ) {
        toast.error(
          `Category: ${
            Array.isArray(
              backendError.category_id
            )
              ? backendError.category_id.join(
                  ", "
                )
              : backendError.category_id
          }`
        );
      }

      else if (
        backendError?.category
      ) {
        toast.error(
          `Category: ${
            Array.isArray(
              backendError.category
            )
              ? backendError.category.join(
                  ", "
                )
              : backendError.category
          }`
        );
      }

      else if (
        backendError?.detail
      ) {
        toast.error(
          backendError.detail
        );
      }

      else {
        toast.error(
          "Failed to duplicate product."
        );
      }
    }
  };

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const handleExport = () => {
    if (!processedProducts.length) {
      toast.info(
        "No products to export."
      );

      return;
    }

    const headers = [
      "ID",
      "Product Name",
      "Description",
      "Category",
      "Price",
      "Stock",
      "Status",
    ];

    const rows =
      processedProducts.map(
        (product) => [
          product.id,
          product.name,
          product.description || "",
          getCategoryName(
            product.category
          ),
          product.price,
          product.stock,
          getStatus(product).label,
        ]
      );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (item) =>
              `"${String(
                item ?? ""
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "products.csv";

    link.click();

    URL.revokeObjectURL(url);

    toast.success(
      "Products exported."
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (product) => {
    const stock =
      Number(product.stock || 0);

    if (
      product.available === false ||
      stock <= 0
    ) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-100 text-red-700",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className:
          "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: "Active",
      className:
        "bg-emerald-100 text-emerald-700",
    };
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-2">

        <h1 className="text-2xl font-bold text-slate-800">
          Product Manager
        </h1>

        <p className="text-sm text-slate-500">
          Manage your products, inventory and product information.
        </p>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

          {/* SEARCH */}

          <div className="relative w-full xl:max-w-sm">

            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
            />

          </div>

          {/* FILTERS */}

          <div className="flex flex-wrap gap-2">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
            >

              <option value="all">
                Status: All
              </option>

              <option value="active">
                Active
              </option>

              <option value="low">
                Low Stock
              </option>

              <option value="inactive">
                Out of Stock
              </option>

            </select>

            <select
              value={stockSort}
              onChange={(e) =>
                setStockSort(
                  e.target.value
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
            >

              <option value="high">
                Stock: High to Low
              </option>

              <option value="low">
                Stock: Low to High
              </option>

            </select>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >

              <FiDownload size={16} />

              Export

            </button>

            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >

              <FiPlus size={17} />

              Add New Product

            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-[900px] w-full">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                <th className="px-5 py-4">
                  ID
                </th>

                <th className="px-5 py-4">
                  Image
                </th>

                <th className="px-5 py-4">
                  Product Name
                </th>

                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Price
                </th>

                <th className="px-5 py-4">
                  Stock
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading products...
                  </td>

                </tr>

              ) : processedProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                processedProducts.map(
                  (product) => {

                    const status =
                      getStatus(
                        product
                      );

                    return (

                      <tr
                        key={
                          product.id
                        }
                        className="transition hover:bg-slate-50"
                      >

                        {/* ID */}

                        <td className="px-5 py-4 text-sm font-medium text-slate-600">
                          #{product.id}
                        </td>

                        {/* IMAGE */}

                        <td className="px-5 py-4">

                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">

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

                              <FiImage
                                className="text-slate-400"
                                size={20}
                              />

                            )}

                          </div>

                        </td>

                        {/* NAME */}

                        <td className="px-5 py-4">

                          <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">

                            {
                              product.name
                            }

                          </p>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4 text-sm text-slate-600">

                          {getCategoryName(
                            product.category
                          )}

                        </td>

                        {/* PRICE */}

                        <td className="px-5 py-4 text-sm font-semibold text-slate-800">

                          ৳
                          {Number(
                            product.price ||
                              0
                          ).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}

                        </td>

                        {/* STOCK */}

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">

                          {
                            product.stock ??
                            0
                          }

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >

                            {
                              status.label
                            }

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-center gap-1">

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                handleEditProduct(
                                  product
                                )
                              }
                              title="Edit"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            >

                              <FiEdit2
                                size={16}
                              />

                            </button>

                            {/* DUPLICATE */}

                            <button
                              onClick={() =>
                                handleDuplicateProduct(
                                  product
                                )
                              }
                              title="Duplicate"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                            >

                              <FiCopy
                                size={16}
                              />

                            </button>

                            {/* DELETE */}

                            <button
                              onClick={() =>
                                handleDeleteProduct(
                                  product.id
                                )
                              }
                              title="Delete"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >

                              <FiTrash2
                                size={16}
                              />

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

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">

            Page{" "}

            <span className="font-semibold text-slate-700">
              {currentPage}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-700">
              {totalPages}
            </span>

          </p>

          <div className="flex items-center gap-1">

            <button
              onClick={() =>
                goToPage(1)
              }
              disabled={
                currentPage === 1
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <FiChevronsLeft
                size={16}
              />

            </button>

            <button
              onClick={() =>
                goToPage(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <FiChevronLeft
                size={16}
              />

            </button>

            <span className="min-w-9 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-700">

              {currentPage}

            </span>

            <button
              onClick={() =>
                goToPage(
                  currentPage + 1
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <FiChevronRight
                size={16}
              />

            </button>

            <button
              onClick={() =>
                goToPage(
                  totalPages
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <FiChevronsRight
                size={16}
              />

            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>

                <h2 className="text-lg font-bold text-slate-800">

                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}

                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter product information below.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowModal(
                    false
                  );

                  resetForm();
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >

                <FiX
                  size={20}
                />

              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5 p-6"
            >

              {/* =================================================
                  NAME
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter product name"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleInputChange
                  }
                  rows="4"
                  placeholder="Enter product description"
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />

              </div>

              {/* =================================================
                  CATEGORY + PRICE
              ================================================= */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (

                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >

                          {
                            category.name ||
                            category.title
                          }

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* PRICE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      formData.price
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />

                </div>

              </div>

              {/* =================================================
                  STOCK + RATING
              ================================================= */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* STOCK */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={
                      formData.stock
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />

                </div>

                {/* RATING */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    value={
                      formData.rating
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />

                </div>

              </div>

              {/* =================================================
                  IMAGE
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Image
                </label>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={
                    handleInputChange
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
                />

              </div>

              {/* =================================================
                  AVAILABLE
              ================================================= */}

              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  name="available"
                  checked={
                    formData.available
                  }
                  onChange={
                    handleInputChange
                  }
                  className="h-4 w-4 accent-emerald-600"
                />

                <span className="text-sm font-medium text-slate-700">
                  Product Available
                </span>

              </label>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(
                      false
                    );

                    resetForm();
                  }}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Add Product"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminProducts;