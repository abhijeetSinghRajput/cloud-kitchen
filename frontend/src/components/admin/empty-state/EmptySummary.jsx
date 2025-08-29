import React from "react";

const EmptySummary = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
      <img src="/empty-pan.svg" className="grayscale max-w-72" />
      <div className="max-w-md">
        <h2 className="text-xl font-semibold">No ingredients to prep</h2>
        <p className="text-sm text-muted-foreground">
          Once orders start rolling in, you’ll see a breakdown of what needs
          cooking—item by item, quantity by quantity.
        </p>
      </div>
    </div>
  );
};

export default EmptySummary;
