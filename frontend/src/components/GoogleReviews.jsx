import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { constructNow, formatDistanceToNowStrict } from "date-fns";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import GoogleIcon from "./icons/GoogleIcon";
import { Button } from "./ui/button";
import { googleReviews } from "@/constants/review";

const GoogleReviews = () => {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <div className="flex gap-4 items-center text-xl font-bold">
            <h3 className="text-xl">Google Reviews</h3>
            <div className="flex items-center gap-1">
              {4.3}{" "}
              <Star className="inline-block stroke-amber-400 fill-amber-400 size-5 mr-1" />
            </div>
          </div>
          <div>
            <p className="text-sm">
              Based on {googleReviews.length} verified customers
            </p>
          </div>
        </div>
        <div>
          <Button
            asChild
            size="lg"
            className="hidden sm:flex w-full rounded-full"
          >
            <a
              target="_blank"
              href="https://www.google.com/search?sca_esv=727911a362dc4a92&sxsrf=ANbL-n6wVceqaR9sta48l9KVZwcZBQY-Ng:1767909932802&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOdiS5Xqk_Gh92bMEiWeKcxuJuMgndWfOHSzNiv6ng-VW2TSk2oFlluEmsK1bVKaRH-qPF-wRQeOfaahZOYz3lsl_QKt3IsPmVoTdXiPvwh6FjXsTqw%3D%3D&q=247+cloud+kitchen+Reviews&sa=X&ved=2ahUKEwjUnKjc-fyRAxWGXGwGHcZENigQ0bkNegQIMRAE&biw=1536&bih=742&dpr=1.25&aic=0#lrd=0x39092b0002b18479:0xe41b874d78d567ce,3,,,,"
            >
              Rate us
            </a>
          </Button>
        </div>
      </div>

      <ScrollArea>
        <div className="flex gap-4 pb-4">
          {googleReviews.map((data, index) => (
            <ReviewCard key={index} data={data} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Button asChild className="w-full h-12 rounded-full sm:hidden mt-2">
        <a
          target="_blank"
          href="https://www.google.com/search?sca_esv=727911a362dc4a92&sxsrf=ANbL-n6wVceqaR9sta48l9KVZwcZBQY-Ng:1767909932802&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOdiS5Xqk_Gh92bMEiWeKcxuJuMgndWfOHSzNiv6ng-VW2TSk2oFlluEmsK1bVKaRH-qPF-wRQeOfaahZOYz3lsl_QKt3IsPmVoTdXiPvwh6FjXsTqw%3D%3D&q=247+cloud+kitchen+Reviews&sa=X&ved=2ahUKEwjUnKjc-fyRAxWGXGwGHcZENigQ0bkNegQIMRAE&biw=1536&bih=742&dpr=1.25&aic=0#lrd=0x39092b0002b18479:0xe41b874d78d567ce,3,,,,"
        >
          Rate us
        </a>
      </Button>
    </div>
  );
};

const ReviewCard = ({ data }) => {
  return (
    <Card className="w-[300px] sm:w-[350px] flex flex-col gap-2 p-4 rounded-2xl bg-muted/50">
      <CardHeader className="p-0 flex justify-between items-start flex-row">
        <a
          href={data.author.contrib}
          target="_blank"
          className="flex gap-3 items-center group border border-transparent hover:border-border"
        >
          <Avatar className="size-9">
            <AvatarImage
              src={data.author.avatar}
              referrerPolicy="no-referrer"
              alt={data.author.name}
            />
            <AvatarFallback>{data.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm group-hover:underline">
              {data.author.name}
            </div>
            <div className="flex gap-2 items-center">
              <GoogleIcon size={14} />

              <span className="text-xs text-muted-foreground -mt-">
                {formatDistanceToNowStrict(new Date(data.review.timestamp), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </a>
        <div className="text-sm flex gap-1 items-center">
          <Badge className={"gap-1 px-1.5 bg-blue-500"}>
            {data.review.ratings.score}{" "}
            <Star className="fill-primary-foreground size-3" />
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 p-0 space-y-1">
        <p className="line-clamp-2 text-sm sm:text-base">{data.review.text}</p>
      </CardContent>
      <CardFooter className="p-0 flex-col justify-start">
        <div className="text-muted-foreground w-full justify-between font-medium text-xs sm:text-sm flex gap-4 py-1 px-2 sm:py-2 sm:px-4 rounded-lg bg-muted">
          <span>Food: {data.review.ratings.food}/5</span>
          <span>Service: {data.review.ratings.service}/5</span>
          <span>Atmosphere: {data.review.ratings.atmosphere}/5</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GoogleReviews;
