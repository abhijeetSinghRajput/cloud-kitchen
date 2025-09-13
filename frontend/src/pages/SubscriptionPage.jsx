import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { CardSwipe } from "@/components/ui/card-swipe";
import { Link } from "react-router-dom";
import SubscriptionForm from "@/components/SubscriptionForm";
import SubscriptionCard from "@/components/SubscriptionCard";
import { IconBrandWhatsapp } from "@tabler/icons-react";

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
  const whatsappNumber = "919520442470";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hy`;

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

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Button className="landing-button h-12 mx-auto">
          <div className="size-8 aspect-square">
            <img
              src="/whatsapp-logo.svg"
              className="w-full h-full object-contain"
            />
          </div>
          {whatsappNumber}
        </Button>
      </a>

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
