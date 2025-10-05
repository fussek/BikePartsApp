import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import BikePartService from "../service/BikePartService";
import { useBikePartStore } from "../store/bikePartStore";

const articleCategories = ["Hub", "Crank", "Bottom Bracket", "Derailleur", "Shifter", "Brake Lever", "Cassette", "Chain", "Saddle", "Handlebar"];
const bicycleCategories = ["Road", "Gravel", "e-Gravel", "MTB", "e-MTB", "City", "e-City", "Trekking", "e-Trekking", "Foldable", "Cargo", "e-Cargo bike"];
const materials = ["Aluminium", "Steel", "Alloy", "Carbon", "Titanium", "Nickel", "Plastic", "Rubber", "Leather"];

const MultiSelectDropdown = ({ options, selectedOptions, onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedSet = new Set(selectedOptions ? selectedOptions.split(", ").filter(Boolean) : []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    const newSelectedSet = new Set(selectedSet);
    if (newSelectedSet.has(option)) {
      newSelectedSet.delete(option);
    } else {
      newSelectedSet.add(option);
    }
    onChange(Array.from(newSelectedSet).join(", "));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = selectedOptions || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`mt-1 block w-full px-3 py-2 text-left bg-white border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
      >
        <span className={selectedOptions ? "text-black" : "text-gray-500"}>{displayValue}</span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label key={option} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={selectedSet.has(option)} onChange={() => handleOptionClick(option)} />
              <span className="ml-3 text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const BikePartForm = ({ isOpen, onClose, onSave, partId }) => {
  const { addBikePart, updateBikePart } = useBikePartStore();

  const [bikePart, setBikePart] = useState({
    articleNumber: "",
    name: "",
    articleCategory: articleCategories[0],
    bicycleCategory: "", //comma-separated string
    material: materials[0],
    netWeight: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const isEditMode = partId !== null && partId !== undefined;

      if (isEditMode) {
        BikePartService.getBikePartById(partId)
          .then((response) => {
            setBikePart(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching bike part:", error);
            setIsLoading(false);
          });
      } else {
        BikePartService.getNextArticleNumber()
          .then((response) => {
            setBikePart({
              articleNumber: response.data,
              name: "",
              articleCategory: articleCategories[0],
              bicycleCategory: "",
              material: materials[0],
              netWeight: "",
            });
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching next article number:", error);
            setBikePart((prev) => ({ ...prev, articleNumber: "N/A" }));
            setIsLoading(false);
          });
      }
      setErrors({});
    }
  }, [isOpen, partId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBikePart((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBicycleCategoryChange = (value) => {
    setBikePart((prev) => ({ ...prev, bicycleCategory: value }));
    if (errors.bicycleCategory) {
      setErrors((prev) => ({ ...prev, bicycleCategory: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!bikePart.name.trim()) newErrors.name = "Name is required.";
    if (!bikePart.netWeight || bikePart.netWeight <= 0) newErrors.netWeight = "Net weight must be a positive number.";
    if (!bikePart.bicycleCategory.trim()) newErrors.bicycleCategory = "At least one Bicycle Category is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const apiAction = partId ? updateBikePart(partId, bikePart) : addBikePart(bikePart);

    apiAction.then(() => {
      onClose();
    });
  };

  if (!isOpen) return null;

  const categoryIconSrc = `/icons/${String(bikePart.articleCategory || "")
    .toLowerCase()
    .replace(" ", "-")}.png`;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-fade-in-up">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
              <img
                src={categoryIconSrc}
                alt={bikePart.articleCategory}
                className="h-12 w-12"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{partId ? "Edit Article" : "Add New Article"}</h2>
          </div>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <div>
                <label htmlFor="articleNumber" className="block text-sm font-medium text-gray-700">
                  Article Number
                </label>
                <input
                  type="text"
                  name="articleNumber"
                  value={bikePart.articleNumber}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={bikePart.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="articleCategory" className="block text-sm font-medium text-gray-700">
                  Article Category
                </label>
                <select
                  name="articleCategory"
                  value={bikePart.articleCategory}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {articleCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bicycleCategory" className="block text-sm font-medium text-gray-700">
                  Bicycle Category
                </label>
                <MultiSelectDropdown
                  options={bicycleCategories}
                  selectedOptions={bikePart.bicycleCategory}
                  onChange={handleBicycleCategoryChange}
                  placeholder="Select categories..."
                  error={errors.bicycleCategory}
                />
                {errors.bicycleCategory && <p className="text-xs text-red-600 mt-1">{errors.bicycleCategory}</p>}
              </div>

              <div>
                <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                  Material
                </label>
                <select
                  name="material"
                  value={bikePart.material}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {materials.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="netWeight" className="block text-sm font-medium text-gray-700">
                  Net Weight (g)
                </label>
                <input
                  type="number"
                  name="netWeight"
                  value={bikePart.netWeight}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.netWeight ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.netWeight && <p className="text-xs text-red-600 mt-1">{errors.netWeight}</p>}
              </div>
            </>
          )}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none">
              {partId ? "Update" : "Add Article"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default BikePartForm;
