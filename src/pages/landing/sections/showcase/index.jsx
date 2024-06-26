import { data } from "./data";
import React from "react";
import { Benefit } from "../../components";

export const Showcase = () => {
  return (
    <ul
      id="showcase"
      className="flex flex-col items-center justify-center gap-20 p-5 mx-auto mt-[5rem] xl:flex-row lg:gap-5 lg:justify-between max-w-[70rem]"
    >
      {data.map((item, idx) => {
        const isEven = idx % 2 === 0 ? true : false;
        return (
          <li
            key={item.title}
            className={
              isEven
                ? "md:ml-[5rem] lg:ml-0 lg:mt-[2rem]"
                : "md:mr-[5rem] lg:mr-0 lg:mb-[2rem]"
            }
          >
            <Benefit info={item} idx={idx} />
          </li>
        );
      })}
    </ul>
  );
};
