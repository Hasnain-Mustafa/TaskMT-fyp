import { motion } from "framer-motion";
import { framer_desc, framer_image, framer_title } from "./framer";
import { useWindowSize } from "../../hooks";

export const Benefit = ({ info, idx }) => {
  const { title, desc, Illustration } = info;

  const { width } = useWindowSize();
  const isDesktop = width > 976;

  return (
    <div className="flex max-w-[30rem] flex-col items-center gap-5 lg:gap-7 text-center md:flex-row md:text-left lg:flex-col lg:text-center">
      <motion.div
        {...framer_image(idx, isDesktop)}
        className="flex w-[250px] h-[200px] items-center justify-center p-5 rounded-3xl "
      >
        <img src={Illustration} alt={title} />
      </motion.div>
      <div className="space-y-5">
        <motion.h2 {...framer_title(isDesktop)} className="font-bold text-base">
          {title}
        </motion.h2>
        <motion.p {...framer_desc(isDesktop)} className="text-gray text-sm">
          {desc}
        </motion.p>
      </div>
    </div>
  );
};
