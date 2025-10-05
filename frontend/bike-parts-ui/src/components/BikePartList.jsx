import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from "react"; // Added Suspense and lazy
import { createPortal } from "react-dom";
import FilterIcon from "./FilterIcon.jsx";
import { useBikePartStore } from "../store/bikePartStore";

// --- LAZY LOADING ---
const LazyBikePartForm = lazy(() => import("./BikePartForm.jsx"));

const ITEMS_PER_PAGE = 10;
const articleCategories = ["Hub", "Crank", "Bottom Bracket", "Derailleur", "Shifter", "Brake Lever", "Cassette", "Chain", "Saddle", "Handlebar"];
const bicycleCategories = ["Road", "Gravel", "e-Gravel", "MTB", "e-MTB", "City", "e-City", "Trekking", "e-Trekking", "Foldable", "Cargo", "e-Cargo bike"];
const materials = ["Aluminium", "Steel", "Alloy", "Carbon", "Titanium", "Nickel", "Plastic", "Rubber", "Leather"];
const bicycleCategoryStyles = {
  "Road": { abbr: "R", color: "bg-red-200", textColor: "text-red-800" },
  "Gravel": { abbr: "G", color: "bg-yellow-200", textColor: "text-yellow-800" },
  "e-Gravel": { abbr: "eG", color: "bg-yellow-300", textColor: "text-yellow-900" },
  "MTB": { abbr: "M", color: "bg-green-200", textColor: "text-green-800" },
  "e-MTB": { abbr: "eM", color: "bg-green-300", textColor: "text-green-900" },
  "City": { abbr: "C", color: "bg-blue-200", textColor: "text-blue-800" },
  "e-City": { abbr: "eC", color: "bg-blue-300", textColor: "text-blue-900" },
  "Trekking": { abbr: "T", color: "bg-indigo-200", textColor: "text-indigo-800" },
  "e-Trekking": { abbr: "eT", color: "bg-indigo-300", textColor: "text-indigo-900" },
  "Foldable": { abbr: "F", color: "bg-purple-200", textColor: "text-purple-800" },
  "Cargo": { abbr: "CA", color: "bg-pink-200", textColor: "text-pink-800" },
  "e-Cargo bike": { abbr: "eCA", color: "bg-pink-300", textColor: "text-pink-900" },
  "Default": { abbr: "?", color: "bg-gray-200", textColor: "text-gray-800" },
};

// --- Sub-components ---

// --- EFFICIENT RENDERING ---
const CategoryPill = React.memo(({ category }) => {
  const style = bicycleCategoryStyles[category] || bicycleCategoryStyles["Default"];
  return (
    <div className="relative inline-block group mr-1">
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style.color} ${style.textColor}`}>{style.abbr}</span>
      <div className="absolute bottom-full mb-2 w-max px-2 py-1 text-sm bg-gray-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {category}
      </div>
    </div>
  );
});

const FilterDropdown = ({ options, selected, onChange, onReset, onClose, position }) => {
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  return createPortal(
    <div
      ref={dropdownRef}
      className="w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2"
      style={{ position: "fixed", top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button onClick={onReset} className="text-sm text-blue-500 hover:underline mb-2">
        Reset
      </button>
      <div className="space-y-1">
        {options.map((option) => (
          <label key={option} className="flex items-center text-sm">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={selected.includes(option)} onChange={() => onChange(option)} />
            <span className="ml-2 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>,
    document.body
  );
};

// --- EFFICIENT RENDERING ---
const PaginationControls = React.memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center items-center mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &laquo; Prev
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 mx-1 rounded-md ${currentPage === number ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next &raquo;
      </button>
    </div>
  );
});

// --- Main List Component ---
const BikePartList = () => {
  const { bikeParts, loading, fetchBikeParts, deleteBikePart } = useBikePartStore();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "none" });
  const [filters, setFilters] = useState({ articleCategory: [], bicycleCategory: [], material: [] });
  const [activeFilter, setActiveFilter] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPartId, setCurrentPartId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBikeParts();
  }, [fetchBikeParts]);

  const filteredAndSortedParts = useMemo(() => {
    let processableParts = [...bikeParts];
    if (filters.articleCategory.length > 0) processableParts = processableParts.filter((part) => filters.articleCategory.includes(part.articleCategory));
    if (filters.material.length > 0) processableParts = processableParts.filter((part) => filters.material.includes(part.material));
    if (filters.bicycleCategory.length > 0)
      processableParts = processableParts.filter((part) => part.bicycleCategory && part.bicycleCategory.split(", ").some((cat) => filters.bicycleCategory.includes(cat)));
    if (sortConfig.key !== null && sortConfig.direction !== "none") {
      processableParts.sort((a, b) => {
        const valA = a[sortConfig.key],
          valB = b[sortConfig.key];
        if (valA == null || valB == null) return valA == null ? 1 : -1;
        let comparison = sortConfig.key === "articleNumber" ? parseInt(valA, 10) - parseInt(valB, 10) : String(valA).localeCompare(String(valB));
        return sortConfig.direction === "ascending" ? comparison : -comparison;
      });
    }
    return processableParts;
  }, [bikeParts, filters, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedParts.length / ITEMS_PER_PAGE);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return filteredAndSortedParts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredAndSortedParts]);

  const dropdownProps = useMemo(() => {
    if (!activeFilter) return null;
    const options = { articleCategory: articleCategories, bicycleCategory: bicycleCategories, material: materials }[activeFilter];
    return {
      options,
      selected: filters[activeFilter],
      onChange: (value) => handleFilterChange(activeFilter, value),
      onReset: () => resetFilter(activeFilter),
      onClose: () => setActiveFilter(null),
      position: dropdownPosition,
    };
  }, [activeFilter, filters, dropdownPosition]);

  const handleOpenForm = (id = null) => {
    setCurrentPartId(id);
    setIsFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentPartId(null);
  };
  const handleSaveForm = () => {};
  const handleDelete = (id) => deleteBikePart(id);
  const handleSort = (key) => {
    setCurrentPage(1);
    let direction = "ascending";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") direction = "descending";
      else if (sortConfig.direction === "descending") {
        direction = "none";
        key = null;
      }
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: prev[filterKey].includes(value) ? prev[filterKey].filter((item) => item !== value) : [...prev[filterKey], value] }));
    setCurrentPage(1);
  };

  const resetFilter = (filterKey) => {
    setFilters((prev) => ({ ...prev, [filterKey]: [] }));
    setActiveFilter(null);
    setCurrentPage(1);
  };

  const toggleFilter = (event, filterKey) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + 4, left: rect.left });
    setActiveFilter(activeFilter === filterKey ? null : filterKey);
  };

  const renderSortIcon = (key) => (sortConfig.key !== key || sortConfig.direction === "none" ? null : sortConfig.direction === "ascending" ? " ▲" : " ▼");

  if (loading) {
    return <div className="text-center p-6">Loading articles...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Article Listings</h1>
        <button onClick={() => handleOpenForm()} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          + Add New Article
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("articleNumber")}>
                Article Number{renderSortIcon("articleNumber")}
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center relative">
                  Category
                  <button onClick={(e) => toggleFilter(e, "articleCategory")}>
                    <FilterIcon />
                  </button>
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")}>
                Name{renderSortIcon("name")}
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center relative">
                  Bicycle Category
                  <button onClick={(e) => toggleFilter(e, "bicycleCategory")}>
                    <FilterIcon />
                  </button>
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center relative">
                  Material
                  <button onClick={(e) => toggleFilter(e, "material")}>
                    <FilterIcon />
                  </button>
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Weight (g)</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentTableData.map((part) => (
              <tr key={part.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{part.articleNumber || "N/A"}</td>
                <td className="py-3 px-4">
                  {part.articleCategory ? (
                    <div className="flex items-center">
                      <img
                        src={`/icons/${part.articleCategory.toLowerCase().replace(" ", "-")}.png`}
                        alt={part.articleCategory}
                        className="w-6 h-6 mr-2"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      {part.articleCategory}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-3 px-4">{part.name || "N/A"}</td>
                <td className="py-3 px-4">{part.bicycleCategory ? part.bicycleCategory.split(", ").map((cat) => <CategoryPill key={cat} category={cat} />) : "N/A"}</td>
                <td className="py-3 px-4">{part.material || "N/A"}</td>
                <td className="py-3 px-4">{part.netWeight || "N/A"}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-3">
                    <button onClick={() => handleOpenForm(part.id)} className="text-gray-500 hover:text-blue-700" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(part.id)} className="text-gray-500 hover:text-red-700" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* If the form is open, render Suspense and the lazy-loaded component */}
      {isFormOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
              <div className="text-white">Loading Form...</div>
            </div>
          }
        >
          <LazyBikePartForm isOpen={isFormOpen} onClose={handleCloseForm} onSave={handleSaveForm} partId={currentPartId} />
        </Suspense>
      )}

      {dropdownProps && <FilterDropdown {...dropdownProps} />}
    </div>
  );
};

export default BikePartList;
