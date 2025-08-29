import React from "react";

const EmptyCompletedOrder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
      <img src="/qrcode.svg" className="grayscale max-w-80" />
      <div className="max-w-md">
        <h2 className="text-xl font-semibold">No Completed Orders</h2>
        <p className="text-sm text-muted-foreground">
          You haven’t completed any orders yet. Once orders are marked as done,
          they will show up here.
        </p>
      </div>
    </div>
  );
};

export default EmptyCompletedOrder;
