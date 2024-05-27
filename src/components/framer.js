// Sidebar Framer Motion Animation Variants

export const framerSidebarPanel = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
  transition: { duration: 0.2 },
};

export const framerNavbarCards = {
  initial: { y: "-20%" },
  animate: { y: 0 },
  exit: { y: "-100%", transition: { duration: 0.1, ease: "linear" } },
  transition: { duration: 0.2, ease: "linear" },
};

export const mobileFramerNavbarCards = {
  initial: { y: "-10%" },
  animate: { y: 0 },
  exit: { y: "-100%", transition: { duration: 0.1, ease: "linear" } },
  transition: { duration: 0.2, ease: "linear" },
};

export const framerButtonVariants = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.1, ease: "linear" },
  },
  whileTap: {
    scale: 0.75,
    transition: { duration: 0.1, ease: "linear" },
  },
};

export const framerdropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};
