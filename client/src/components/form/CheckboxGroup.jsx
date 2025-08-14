// components/CheckboxGroup.jsx
import React from "react";

export default function CheckboxGroup({
  label,
  name,
  options,
  selected,
  onChange,
}) {
  return (
    <div className="md:col-span-2">
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={opt}
            className="inline-flex items-center space-x-2 text-gray-700 dark:text-gray-200"
          >
            <input
              type="checkbox"
              name={name}
              value={opt}
              checked={selected.includes(opt)}
              onChange={(e) => onChange(e, name)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
