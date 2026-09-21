import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

import { toast } from "react-toastify";

const BASEURL = (
  import.meta.env.VITE_DJANGO_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const Categories = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // =====================================================
  // AUTH CONFIG
  // =====================================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("accessToken");

    return {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    };
  };

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    console.error("Full API Error:", error);
    console.error("API Response:", data);

    if (!data) {
      return "Something went wrong.";
    }

    if (typeof data === "string") {
      return data;
    }

    if (data.detail) {
      return String(data.detail);
    }

    if (data.name) {
      if (Array.isArray(data.name)) {
        return data.name.join(", ");
      }

      return String(data.name);
    }

    const firstKey = Object.keys(data)[0];

    if (firstKey) {
      const value = data[firstKey];

      if (Array.isArray(value)) {
        return value.join(", ");
      }

      if (typeof value === "object") {
        return JSON.stringify(value);
      }

      return String(value);
    }

    return "Something went wrong.";
  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async (showErrorToast = true) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASEURL}/api/categories/`,
        getAuthConfig()
      );

      console.log("Categories API Response:", response.data);

      const data = response.data;

      let categoryList = [];

      // Backend returns:
      // [
      //   { id: 1, name: "Electronics", slug: "electronics" }
      // ]

      if (Array.isArray(data)) {
        categoryList = data;
      }

      // Backend returns:
      // {
      //   count: 10,
      //   results: [...]
      // }

      else if (Array.isArray(data?.results)) {
        categoryList = data.results;
      }

      // Safety check
      if (!Array.isArray(categoryList)) {
        categoryList = [];
      }

      console.log("Category List:", categoryList);

      setCategories(categoryList);

    } catch (error) {
      console.error(
        "Fetch categories error:",
        error?.response?.data || error
      );

      if (showErrorToast) {
        toast.error(getErrorMessage(error));
      }

      setCategories([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchCategories(true);
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCategories = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return categories;
    }

    return categories.filter((category) =>
      String(category?.name || "")
        .toLowerCase()
        .includes(searchText)
    );
  }, [categories, search]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedCategories = useMemo(() => {
    const startIndex =
      (safeCurrentPage - 1) * itemsPerPage;

    return filteredCategories.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [
    filteredCategories,
    safeCurrentPage,
  ]);

  // =====================================================
  // SEARCH PAGE RESET
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // =====================================================
  // PAGE SAFETY
  // =====================================================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setFormData({
      name: "",
    });

    setEditingCategory(null);
  };

  // =====================================================
  // ADD
  // =====================================================

  const handleAddCategory = () => {
    resetForm();
    setShowModal(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEditCategory = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category?.name || "",
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName = formData.name.trim();

    // Validation
    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: categoryName,
      };

      // =================================================
      // UPDATE
      // =================================================

      if (editingCategory) {
        await axios.put(
          `${BASEURL}/api/categories/${editingCategory.id}/`,
          payload,
          getAuthConfig()
        );

        toast.success(
          "Category updated successfully"
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        await axios.post(
          `${BASEURL}/api/categories/`,
          payload,
          getAuthConfig()
        );

        toast.success(
          "Category added successfully"
        );
      }

      // Close modal
      setShowModal(false);
      resetForm();

      // Refresh list
      // IMPORTANT:
      // Don't show another error toast here.
      await fetchCategories(false);

    } catch (error) {
      console.error(
        "Category save error:",
        error?.response?.data || error
      );

      toast.error(
        getErrorMessage(error)
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${BASEURL}/api/categories/${category.id}/`,
        getAuthConfig()
      );

      toast.success(
        "Category deleted successfully"
      );

      // Refresh list
      await fetchCategories(false);

    } catch (error) {
      console.error(
        "Category delete error:",
        error?.response?.data || error
      );

      toast.error(
        getErrorMessage(error)
      );
    }
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  const goToNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(
        prev + 1,
        totalPages
      )
    );
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    if (safeCurrentPage <= 3) {
      return [
        1,
        2,
        3,
        4,
        5,
      ];
    }

    if (
      safeCurrentPage >=
      totalPages - 2
    ) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      safeCurrentPage - 2,
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      safeCurrentPage + 2,
    ];
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your product categories
          </p>
        </div>

        <button
          onClick={handleAddCategory}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#5fd6bd] text-white rounded-xl font-medium hover:bg-[#4fc8ae] transition"
        >
          <FiPlus size={18} />

          Add Category
        </button>

      </div>

      {/* SEARCH */}

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">

        <div className="relative max-w-md">

          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#5fd6bd] focus:border-transparent text-sm"
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[600px]">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  ID
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Category Name
                </th>

                <th className="text-center px-5 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="3"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Loading categories...
                  </td>
                </tr>

              ) : paginatedCategories.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    {search
                      ? "No categories found"
                      : "No categories available"}
                  </td>

                </tr>

              ) : (

                paginatedCategories.map(
                  (category) => (

                    <tr
                      key={category.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                    >

                      <td className="px-5 py-4 text-sm text-gray-600">
                        #{category.id}
                      </td>

                      <td className="px-5 py-4">

                        <span className="font-medium text-gray-800">
                          {category.name}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() =>
                              handleEditCategory(
                                category
                              )
                            }
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit Category"
                          >
                            <FiEdit2 size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteCategory(
                                category
                              )
                            }
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Delete Category"
                          >
                            <FiTrash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        {filteredCategories.length > 0 && (

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-200">

            <p className="text-sm text-gray-500">

              Showing{" "}

              <span className="font-medium text-gray-700">

                {(safeCurrentPage - 1) *
                  itemsPerPage +
                  1}

              </span>

              {" "}to{" "}

              <span className="font-medium text-gray-700">

                {Math.min(
                  safeCurrentPage *
                    itemsPerPage,
                  filteredCategories.length
                )}

              </span>

              {" "}of{" "}

              <span className="font-medium text-gray-700">

                {filteredCategories.length}

              </span>

              {" "}categories

            </p>

            <div className="flex items-center gap-1">

              <button
                onClick={goToFirstPage}
                disabled={
                  safeCurrentPage === 1
                }
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FiChevronsLeft size={16} />
              </button>

              <button
                onClick={goToPreviousPage}
                disabled={
                  safeCurrentPage === 1
                }
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FiChevronLeft size={16} />
              </button>

              {getPageNumbers().map(
                (page) => (

                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`min-w-[38px] h-[38px] px-3 rounded-lg text-sm font-medium transition ${
                      safeCurrentPage === page
                        ? "bg-[#5fd6bd] text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>

                )
              )}

              <button
                onClick={goToNextPage}
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FiChevronRight size={16} />
              </button>

              <button
                onClick={goToLastPage}
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FiChevronsRight size={16} />
              </button>

            </div>

          </div>

        )}

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">

                  {editingCategory
                    ? "Edit Category"
                    : "Add New Category"}

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  {editingCategory
                    ? "Update category information"
                    : "Create a new product category"}

                </p>

              </div>

              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#5fd6bd] focus:border-transparent text-sm"
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-[#5fd6bd] text-white font-medium hover:bg-[#4fc8ae] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Add Category"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Categories;