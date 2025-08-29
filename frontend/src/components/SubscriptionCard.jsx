import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

const SubscriptionCard = ({ header, items, price, onPurchase }) => {
  return (
    <Card className="w-[320px] p-6 rounded-3xl shadow-lg overflow-visible">
      <CardHeader>
        <div className="flex gap-2">
          <CardTitle className="flex gap-2 items-center text-2xl font-extrabold text-muted-foreground">
            <img src="/bowl.png" width={40} />
            {header}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 font-medium text-muted-foreground"
            >
              <CheckCircle
                strokeWidth={2.5}
                size={20}
                className="text-purple-500 mt-1 flex-shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 mb-6 text-center">
          <h3 className="text-purple-600 font-extrabold text-2xl">{price}</h3>
        </div>

        <Button
          size="lg"
          onClick={onPurchase}
          className="bg-purple-600 hover:bg-purple-600/90 w-full h-11 rounded-xl"
        >
          Purchase
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
