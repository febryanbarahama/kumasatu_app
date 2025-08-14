// import React from "react";

// export default function FieldInput({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   options = [],
//   maxLength,
//   min,
//   step,
//   required,
//   disabled,
//   multiple = false,
//   error,
// }) {
//   // Pastikan selalu ada default value agar controlled
//   let inputValue = value ?? (multiple ? [] : "");

//   // Untuk select single pastikan string
//   if (type === "select" && !multiple && Array.isArray(inputValue)) {
//     inputValue = inputValue.length > 0 ? inputValue[0] : "";
//   }

//   return (
//     <div>
//       <label htmlFor={name} className="block mb-1 font-semibold">
//         {label} {required && <span className="text-red-600">*</span>}
//       </label>

//       {type === "select" ? (
//         <select
//           id={name}
//           name={name}
//           value={inputValue}
//           onChange={onChange}
//           multiple={multiple}
//           required={required}
//           disabled={disabled}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
//         >
//           {!multiple && <option value="">-- Pilih --</option>}
//           {options.map((opt) => (
//             <option key={opt} value={opt}>
//               {opt}
//             </option>
//           ))}
//         </select>
//       ) : (
//         <input
//           id={name}
//           name={name}
//           type={type}
//           value={inputValue}
//           onChange={onChange}
//           maxLength={maxLength}
//           min={min}
//           step={step}
//           required={required}
//           disabled={disabled}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
//         />
//       )}

//       {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//     </div>
//   );
// }

import React from "react";

export default function FieldInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  options = [],
  maxLength,
  min,
  step,
  required,
  disabled,
  error,
}) {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 font-semibold">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "" ? "-- Pilih --" : opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          min={min}
          step={step}
          required={required}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
