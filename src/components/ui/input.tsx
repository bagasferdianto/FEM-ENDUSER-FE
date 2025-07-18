import * as React from "react";

import { cn } from "@/lib/utils";
import { RequiredLabel } from "./form";
import { Files, FolderSearch2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useSearchOnEnter } from "@/hooks/use-search-on-enter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Button } from "./button";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | string | null;
  label: string;
  accept: string;
  required?: boolean;
  maxSizeInMB?: number;
}

function FileUpload({
  onFileSelect,
  selectedFile,
  label,
  accept,
  required,
  maxSizeInMB = 5,
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);

  const validateFileSize = (file: File): boolean => {
    const isValid = file.size <= maxSizeInMB * 1024 * 1024;
    if (!isValid) {
      toast.error(`Ukuran file tidak boleh melebihi ${maxSizeInMB} MB.`);
    }
    return isValid;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFileSize(file)) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFileSize(file)) {
      onFileSelect(file);
    }
  };

  const getDisplayName = () => {
    if (selectedFile instanceof File) {
      return selectedFile.name;
    }
    if (typeof selectedFile === "string" && selectedFile) {
      return selectedFile;
    }
    return null;
  };

  const displayName = getDisplayName();

  return (
    <div className="space-y-2">
      <RequiredLabel required={required}>{label}</RequiredLabel>
      <div
        className={cn(
          "relative border border-input bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 shadow-sm rounded-md p-2 transition-colors",
          dragActive ? "border-blue-500 bg-blue-50" : "",
          "hover:border-gray-400"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {displayName ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Files className="h-4 w-4" />
              <span className="text-sm text-blue-500 underline">
                {displayName}
              </span>
            </div>
            <FolderSearch2 className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row">
              <Files
                className="h-4 w-4 text-black"
                strokeOpacity={1}
                strokeWidth={2}
              />
              <p className="text-sm text-muted-foreground">
                Masukkan file disini
              </p>
            </div>
            <FolderSearch2 className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

interface SearchInputProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  onPageReset?: () => void;
  initialValue?: string;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  className?: string;
  tooltipText?: string;
}

export function SearchInput({
  placeholder = "Cari...",
  onSearch,
  onPageReset,
  initialValue = "",
  showSearchButton = false,
  showClearButton = false,
  className = "",
  tooltipText = "Tekan Enter untuk mencari",
}: SearchInputProps) {
  const {
    inputValue,
    handleKeyDown,
    handleSearch,
    handleClear,
    handleInputChange,
    hasActiveSearch,
  } = useSearchOnEnter({
    initialValue,
    onSearch,
    onPageReset,
  });

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />

              <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-w-[300px] w-full pl-10 pr-4"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-white">
            {tooltipText}
          </TooltipContent>
        </Tooltip>

        {showSearchButton && (
          <Button
            onClick={handleSearch}
            size="sm"
            variant="outline"
            className="px-3"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}

        {showClearButton && hasActiveSearch && (
          <Button
            onClick={handleClear}
            size="sm"
            variant="ghost"
            className="px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
}

export { Input, FileUpload };
