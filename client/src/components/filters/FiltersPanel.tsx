import { motion } from "framer-motion";
import { FilterDropdown } from "./FilterDropdown";
import { AgeRangeFilter } from "./AgeRangeFilter";
import { Button } from "../ui/Button";

interface FiltersPanelProps {
    filters: {
        country: string;
        province: string;
        searchTerm: string;
        minAge: number;
        maxAge: number;
    };
    uniqueCountries: string[];
    uniqueProvinces: string[];
    onFilterChange: (filterName: string, value: any) => void;
    onClearFilters: () => void;
}

export function FiltersPanel({
    filters,
    uniqueCountries,
    uniqueProvinces,
    onFilterChange,
    onClearFilters,
}: FiltersPanelProps) {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-4 bg-white rounded-lg shadow-md"
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FilterDropdown
                    label="País"
                    options={uniqueCountries}
                    selectedValue={filters.country}
                    onChange={(value) => onFilterChange("country", value)}
                />
                <FilterDropdown
                    label="Província"
                    options={uniqueProvinces}
                    selectedValue={filters.province}
                    onChange={(value) => onFilterChange("province", value)}
                />
                <AgeRangeFilter
                    minAge={filters.minAge}
                    maxAge={filters.maxAge}
                    onMinAgeChange={(value) => onFilterChange("minAge", value)}
                    onMaxAgeChange={(value) => onFilterChange("maxAge", value)}
                />
            </div>
            <div className="flex justify-end">
                <Button
                    variant="secondary"
                    onClick={onClearFilters}
                    className="text-sm"
                >
                    Limpar Filtros
                </Button>
            </div>
        </motion.div>
    );
}
