import React, { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Ban, CupSoda } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ImageWithSkeleton = ({
  src,
  alt,
  className,
  disabled = false,
  skeletonClass = "w-full h-full",
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
    
    // If no src, hide skeleton immediately
    if (!src || src.trim() === "") {
      setLoaded(true);
      setError(true);
    }
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setLoaded(true);
    setError(true);
  };

  // Don't show skeleton if no src or error
  const showSkeleton = !loaded && src && src.trim() !== "";

  return (
    <div className="relative w-full h-full">
      {/* Skeleton Loader - only show when loading valid image */}
      {showSkeleton && (
        <Skeleton className={`absolute inset-0 ${skeletonClass}`} />
      )}

      {/* Actual Image */}
      <Avatar className="w-full h-full rounded-none">
        <AvatarImage
          src={src}
          alt={alt}
          className={`${className} ${
            !loaded ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
        <AvatarFallback className="text-muted-foreground rounded-none">
          <CupSoda className="size-1/3" />
        </AvatarFallback>
      </Avatar>

      {/* Disabled Overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Ban className="text-white size-8" />
        </div>
      )}
    </div>
  );
};

export default ImageWithSkeleton;