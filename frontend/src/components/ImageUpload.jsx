import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pizza } from "lucide-react";
import { Badge } from "./ui/badge";

const ImageUpload = ({ image, onChange }) => {
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileSelect = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    onChange(file);

    let size = 0;
    let unit = "MB";

    if (file.size < 1024 * 1024) {
      size = (file.size / 1024).toFixed(2); // KB
      unit = "KB";
    } else {
      size = (file.size / (1024 * 1024)).toFixed(2); // MB
    }

    setFileInfo({
      name: file.name,
      type: file.type,
      size: `${size} ${unit}`,
    });
  }
};


  return (
    <div className="flex gap-2">
      <label htmlFor="food-image">
        <input
          id="food-image"
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />
        <Avatar className="size-24 rounded-lg border cursor-pointer hover:brightness-90 transition-all">
          <AvatarImage src={image || ""} className="w-full h-full object-cover" />
          <AvatarFallback className="rounded-none">
            <Pizza className="text-muted-foreground size-10" />
          </AvatarFallback>
        </Avatar>
      </label>

      {fileInfo && (
        <div className="flex items-start justify-between w-full gap-2">
          <div>
            <p className="font-semibold">{fileInfo.name}</p>
            <p className="text-muted-foreground text-sm">{fileInfo.type}</p>
          </div>
          <Badge className={"whitespace-nowrap"}>{fileInfo.size}</Badge>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
