import { useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { CardSwipe } from "@/components/ui/card-swipe";
import SubscriptionForm from "@/components/SubscriptionForm";
import SubscriptionCard from "@/components/SubscriptionCard";
import WhatsappButton from "@/components/WhatsappButton";

const plans = [
  {
    header: "Basic Mess",
    price: "₹2500 / month",
    items: [
      "2 Meals per day",
      "Veg Menu",
      "Weekly Rotating Menu",
      "Clean Dining Area",
    ],
  },
  {
    header: "Premium Mess",
    price: "₹4000 / month",
    items: [
      "3 Meals per day",
      "Veg + Non-Veg",
      "Special Weekend Dishes",
      "Priority Seating & AC Dining",
    ],
  },
  {
    header: "Luxury Mess",
    price: "₹6000 / month",
    items: [
      "Unlimited Buffet Style",
      "Veg + Non-Veg + Desserts",
      "Special Candle Light Dinner Weekly",
      "Premium Seating Lounge",
    ],
  },
];

const SubscriptionPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="p-4 max-w-screen-2xl mx-auto h-svh">
      <div className="max-w-md text-center mx-auto mb-10">
        <h1 className="text-4xl font-bold text-[#ff5200]">Subscription Plan</h1>
        <p className="text-muted-foreground">
          Affordable and hygienic meals. Choose your plan.
        </p>
      </div>

      <CardSwipe autoplayDelay={86400000}>
        {plans.map((plan, idx) => (
          <SubscriptionCard
            key={idx}
            header={plan.header}
            items={plan.items}
            price={plan.price}
            onPurchase={() => {
              setSelectedPlan(plan);
              setOpen(true);
            }}
          />
        ))}
      </CardSwipe>

      <WhatsappButton/>

      {/* Popup Form */}
      <SubscriptionForm
        open={open}
        setOpen={setOpen}
        selectedOrder={selectedPlan}
      />
    </div>
  );
};

export default SubscriptionPage;
