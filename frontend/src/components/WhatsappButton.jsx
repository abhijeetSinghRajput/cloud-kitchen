import React from "react";
import { Button } from "./ui/button";

const WhatsappButton = () => {
  const countryCode = 91;
  const whatsappNumber = "9520442470"; // your main number (without +91)
  const fullNumber = `${countryCode}${whatsappNumber}`;

  const msg = encodeURIComponent(
    "Hi 👋 I’m interested in your food plans and tiffin service. Please share the details.",
  );

  const whatsappUrl = `https://wa.me/${fullNumber}?text=${msg}`;

  return (
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
  );
};

export default WhatsappButton;
