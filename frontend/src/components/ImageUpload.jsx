import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Pizza } from "lucide-react";
import { Badge } from "./ui/badge";

const ImageUpload = ({ image, onChange, isLoading, error }) => {
  const [fileInfo, setFileInfo] = useState(null);
  const [preview, setPreview] = useState(image || "");

  useEffect(() => {
    setPreview(image || "");
  }, [image]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange(file); // send file to parent for uploading

    const size = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(2)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    setFileInfo({
      name: file.name,
      type: file.type,
      size,
    });

    // show preview immediately
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex gap-2 items-start relative">
      <label htmlFor="food-image" className="relative">
        <input
          id="food-image"
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />
        <Avatar className="size-24 rounded-lg border cursor-pointer hover:brightness-90 transition-all relative overflow-hidden">
          <AvatarImage src={preview} className="w-full h-full object-cover" />
          <AvatarFallback className="rounded-none flex items-center justify-center bg-gray-100">
            <Pizza className="text-muted-foreground size-10" />
          </AvatarFallback>

          {/* Loader overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
              <span className="text-white font-semibold text-sm">
                <Loader2 className="animate-spin"/>
              </span>
            </div>
          )}
        </Avatar>
      </label>

      {fileInfo && (
        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{fileInfo.name}</p>
              <p className="text-muted-foreground text-sm">{fileInfo.type}</p>
            </div>
            <Badge className="whitespace-nowrap">{fileInfo.size}</Badge>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
