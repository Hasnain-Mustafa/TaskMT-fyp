import React from "react";
import CardComponent from "../components/screen/CardComponent";
import Area from "./Charts/Area";
import ChartCard from "../components/screen/ChartCard";
import MonthGoalsCard from "../components/screen/MonthGoalsCard";

const Dashboard = () => {
  return (
    <div className="flex flex-wrap justify-center space-y-4 md:space-y-0 md:space-x-4 p-5">
      <div className="mb-8">
        <CardComponent />
      </div>
      <div className="m-8">
        <MonthGoalsCard />
      </div>

      <div className="w-full md:w-1/2">
        <ChartCard />
      </div>
      <div className="w-full md:w-1/2">
        <Area />
      </div>
    </div>
  );
};

export default Dashboard;
