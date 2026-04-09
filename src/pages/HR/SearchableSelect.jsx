import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  const selected = options.find(o => o.value === value);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-xl
          bg-white border border-gray-200 shadow-sm
          hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200
          transition-all duration-200 cursor-pointer
        `}
      >
        <span className={`${!selected && "text-gray-400"}`}>
          {selected ? selected.label : placeholder}
        </span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="
              absolute z-50 mt-2 w-full
              bg-white/90 backdrop-blur-xl
              border border-gray-100
              rounded-xl shadow-xl overflow-hidden
            "
          >
            {/* Search */}
            <div className="flex items-center px-3 py-2 border-b bg-gray-50">
              <Search size={14} className="text-gray-400 mr-2" />
              <input
                autoFocus
                type="text"
                placeholder="Search employee..."
                className="w-full text-sm bg-transparent outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((opt) => {
                  const isSelected = value === opt.value;

                  return (
                    <div
                      key={opt.value}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`
                        px-4 py-2 text-sm cursor-pointer flex justify-between items-center
                        transition-all
                        ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "hover:bg-gray-50"
                        }
                      `}
                    >
                      {opt.label}

                      {isSelected && (
                        <span className="text-xs">✓</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchableSelect;