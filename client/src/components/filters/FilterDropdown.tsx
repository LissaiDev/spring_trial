import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterDropdownProps {
    label: string;
    options: string[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export function FilterDropdown({
    label,
    options,
    selectedValue,
    onChange,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-left border rounded-md hover:bg-gray-50"
            >
                <span className="text-sm text-gray-500">{label}</span>
                <div className="flex items-center justify-between">
                    <span>{selectedValue || "Todos"}</span>
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="ml-2"
                    >
                        ▼
                    </motion.span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                    >
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                                Todos
                            </button>
                            {options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
