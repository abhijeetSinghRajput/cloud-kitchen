import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Image } from "lucide-react";

const ImageWithSkeleton = ({
  src,
  alt,
  className,
  skeletonClass = "w-full h-full",
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton Loader */}
      {!loaded && (
        <Skeleton className={`absolute inset-0  ${skeletonClass}`}/>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          !loaded ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default ImageWithSkeleton;
