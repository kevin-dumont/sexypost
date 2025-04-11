import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Import, Save } from "lucide-react";
import { PostStyle } from "../types";

interface StyleImportExportProps {
  currentStyle: PostStyle;
  onStyleChange: (style: PostStyle) => void;
}

export default function StyleImportExport({
  currentStyle,
  onStyleChange,
}: StyleImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const styleData = JSON.stringify(currentStyle, null, 2);
    const blob = new Blob([styleData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentStyle.name
      .toLowerCase()
      .replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedStyle = JSON.parse(content) as PostStyle;
        onStyleChange(importedStyle);
      } catch (error) {
        console.error("Error importing style:", error);
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />

      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={() => fileInputRef.current?.click()}
      >
        <Import className="h-4 w-4 mr-2" />
        Importer
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={handleExport}
      >
        <Save className="h-4 w-4 mr-2" />
        Exporter
      </Button>
    </div>
  );
}
