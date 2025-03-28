interface AgeRangeFilterProps {
    minAge: number;
    maxAge: number;
    onMinAgeChange: (value: number) => void;
    onMaxAgeChange: (value: number) => void;
}

export function AgeRangeFilter({
    minAge,
    maxAge,
    onMinAgeChange,
    onMaxAgeChange,
}: AgeRangeFilterProps) {
    return (
        <div className="space-y-2">
            <span className="text-sm text-gray-500">Faixa etária</span>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min={0}
                    max={maxAge}
                    value={minAge}
                    onChange={(e) => onMinAgeChange(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                />
                <span>até</span>
                <input
                    type="number"
                    min={minAge}
                    max={150}
                    value={maxAge}
                    onChange={(e) => onMaxAgeChange(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                />
            </div>
        </div>
    );
}
