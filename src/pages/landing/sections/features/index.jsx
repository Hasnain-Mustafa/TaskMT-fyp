import { Card } from "../../components";
import { data } from "./data";

export const Pricing = () => {
  return (
    <section className=" p-[1rem] md:p-[70px] m-auto my-[10rem] space-y-10 md:space-y-20 bg-midnight">
      <div className="space-y-8 text-center md:max-w-[32.563rem] m-auto">
        <h2 className="text-3xl font-bold text-white">
          Explore our powerful features
        </h2>
        <p className="text-white text-base">
          Dedicated to empowering productivity. Our features are tailored to
          streamline your workflow and to boost productivity.
        </p>
      </div>
      <ul className="flex flex-col gap-20 md:gap-10 md:flex-row md:justify-center text-white">
        {data.map((item) => {
          return <Card key={item.title} info={item} ltr={item.isFree} />;
        })}
      </ul>
    </section>
  );
};
