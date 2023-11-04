import React, { useState, useEffect, useRef } from 'react';

interface MultiSelectProps {
  options?: string[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  tag: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options = [], 
  defaultSelected = [], 
  onChange, 
  tag 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onChange && typeof onChange === 'function') {
      onChange(selectedOptions);
    }
  }, [selectedOptions, onChange]);

  const toggleOption = (option: string) => {
    setSelectedOptions(prevState => {
      if (prevState.includes(option)) {
        return prevState.filter(item => item !== option);
      } else {
        return [...prevState, option];
      }
    });
  };

  const removeOption = (option: string) => {
    setSelectedOptions(prevState => prevState.filter(item => item !== option));
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-5 relative" ref={dropdownRef}>
      <div 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full text-left bg-white border p-2 rounded shadow flex justify-between items-center cursor-pointer"
      >
        <div className="flex flex-wrap max-w-[186px] items-center">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500">Select a {tag}</span>
          ) : (
            selectedOptions.map(option => (
              <span key={option} className="mr-2 mb-2 flex items-center bg-indigo-200 rounded-md p-1">
                {option}
                <button
                  className="ml-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(option);
                  }}
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
        <div className="ml-2">
          {dropdownOpen ? (
            <svg width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 11.854a.5.5 0 0 0 .708 0L8 6.207l5.646 5.647a.5.5 0 0 0 .708-.708l-6-6a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 0 .708z"/>
            </svg>
          ) : (
            <svg width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          )}
        </div>
      </div>

      {dropdownOpen && (
        <div className="absolute w-full mt-2 rounded shadow-lg bg-white border z-10">
          {options.map(option => (
            <button
              key={option}
              className={`block w-full text-left p-2 hover:bg-indigo-100 ${selectedOptions.includes(option) ? 'bg-indigo-200' : ''}`}
              onClick={() => toggleOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
