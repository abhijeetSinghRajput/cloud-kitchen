import React from "react";

const EmptyPendingOrder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
      <img src="/popcorn.svg" className="grayscale max-w-80" />
      <div className="max-w-md">
        <h2 className="text-xl font-semibold">No Orders Yet</h2>
        <p className="text-sm text-muted-foreground">
          Your recent orders will appear here.
        </p>
      </div>
    </div>
  );
};

export default EmptyPendingOrder;
