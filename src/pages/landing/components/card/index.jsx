import { BsCheckLg } from "react-icons/bs";
import { motion } from "framer-motion";
import { framer_card, framer_icon, framer_text } from "./framer";

export const Card = ({ info, ltr }) => {
  const { title, desc, Icon, options } = info;
  return (
    <motion.article
      {...framer_card(ltr)}
      className={`relative p-8 rounded-xl space-y-5 md:w-[50%] max-w-[30rem] bg-black`}
    >
      <div className="absolute -top-10 left-51">
        <Icon />
      </div>
      <p className="font-extrabold text-base">{title}</p>
      <p className="text-white text-sm">{desc}</p>
      <ul className="space-y-2 text-sm">
        {options.map((item, idx) => {
          return (
            <li className="flex items-center gap-2 font-semibold" key={item}>
              <motion.div {...framer_icon(idx)}>
                <BsCheckLg className="text-cyan-400" />
              </motion.div>
              <motion.span {...framer_text(idx)}>{item}</motion.span>
            </li>
          );
        })}
      </ul>
    </motion.article>
  );
};
