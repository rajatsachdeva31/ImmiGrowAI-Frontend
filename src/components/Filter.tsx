import React, { useState } from "react";

interface FilterConfig {
  name: string;
  type: "text" | "number" | "select";
  placeholder: string;
  options?: string[]; // Only for select dropdowns
}

interface ReusableFilterProps {
  filtersConfig: FilterConfig[];
  onFilterChange: (filters: { [key: string]: string }) => void;
}

const Filter: React.FC<ReusableFilterProps> = ({ filtersConfig, onFilterChange }) => {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = filtersConfig.reduce((acc, filter) => {
      acc[filter.name] = "";
      return acc;
    }, {} as { [key: string]: string });
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="p-4 shadow-md rounded-lg mb-4"> {/*removed bg-white*/}
      <h3 className="text-lg font-semibold mb-3">Filter Listings</h3>
      
      {/* Filter inputs in a grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtersConfig.map((filter) => (
          <div key={filter.name}>
            {filter.type === "select" ? (
              <select
                name={filter.name}
                value={filters[filter.name] || ""}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              >
                <option value="">{filter.placeholder}</option>
                {filter.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={filter.type}
                name={filter.name}
                placeholder={filter.placeholder}
                value={filters[filter.name] || ""}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              />
            )}
          </div>
        ))}
      </div>

      {/* Buttons in a new row with spacing */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          ✖ Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
