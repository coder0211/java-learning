import { Search } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({
  className,
  onChange,
  placeholder,
}: SearchInputProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2" />
      <Input placeholder={placeholder} className="pl-9" onChange={onChange} />
    </div>
  );
};

export default SearchInput;
