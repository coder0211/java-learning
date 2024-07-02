import { Tv } from "lucide-react";
import React from "react";

const Details = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Tv className="mt-6 w-12 h-12 text-muted-foreground" />
      <h3 className="mt-6 font-medium text-lg text-muted-foreground">
        Would you like to see the details?
      </h3>
      <p className="font-normal text-sm text-muted-foreground mt-2">
        Try to click on a summary and see what will happens!
      </p>
    </div>
  );
};

export default Details;
