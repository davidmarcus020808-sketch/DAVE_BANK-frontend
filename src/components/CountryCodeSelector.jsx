import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const countries = [
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
];

const CountryCodeSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const selectedCountry =
    countries.find((c) => c.code === value) || countries[0];

  return (
    <div className="relative w-36">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-xl bg-gray-50 px-3 py-2 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-green-500 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="text-sm font-medium">{selectedCountry.code}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-2 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl w-full">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-green-50 ${
                value === c.code ? "bg-green-100 text-green-700" : "text-gray-700"
              }`}
            >
              <span className="text-lg">{c.flag}</span>
              <span>{c.name}</span>
              <span className="ml-auto font-medium">{c.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelector;
