import React from "react";
import { motion } from "framer-motion";
import { framer_desc, framer_icon, framer_title } from "./framer";
import scrollAnimation from "./lottie_scroll.json";
import Lottie from "lottie-react";

export const Hero = () => {
  return (
    <section className="mt-[5rem] p-5 md:p-[7.5rem] text-white relative flex flex-col justify-center flex-1 gap-8 bg-main-dark-bg bg-no-repeat bg-hero-squiggle bg-invert">
      <div className="mt-7 sm:mt-0 flex flex-col items-center gap-8 h-[82vh] md:h-[85vh] p-5 md:max-w-[28.563rem] md:m-auto md:bg-bg-hero-squiggle md:bg-contain bg-no-repeat bg-center ">
        <motion.h1
          {...framer_title}
          className="font-bold leading-snug text-center text-2xl  md:text-4xl"
        >
          Streamline Your Success with Effortless <br />
          <span className="text-[#d1d5db] font-extrabold">
            Task Management!
          </span>
        </motion.h1>
        <motion.p {...framer_desc} className="text-center text-white text-lg">
          Redefine your approach to tasks, break free from old routines. Embrace
          flexibility and productivity with our platform designed for your
          success.
        </motion.p>
        <motion.a
          href="#showcase"
          className="max-w-[5rem] mt-7"
          {...framer_icon}
        >
          <Lottie animationData={scrollAnimation} loop={true} />
        </motion.a>
      </div>
      <div className="hidden lg:block absolute top-1/2 transform -translate-y-1/2 left-0 w-[30%] h-full bg-no-repeat bg-center bg-illustration-hero-left opacity-50"></div>
      <div className="hidden lg:block absolute top-1/2 transform -translate-y-1/2 right-0 w-[30%] h-full bg-no-repeat bg-center bg-illustration-hero-right opacity-50"></div>
    </section>
  );
};
