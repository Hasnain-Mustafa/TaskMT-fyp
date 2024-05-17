import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export const CountUp = ({
  image,
  maxCount,
  unit,
  text,
  once = true,
  className = "",
  countStep = 1, // customizable count step
  countDelay = 100, // increased delay for slower animation
  startCount = 85, // Make startCount a customizable prop with a default value
  ...props
}) => {
  // ref and inView
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: once });

  // State to manage the current count
  const [currentCount, setCurrentCount] = useState(startCount);

  // countUp function
  const countUp = () => {
    if (currentCount < maxCount) {
      setCurrentCount((prevCount) => prevCount + countStep);
    }
  };

  // Effect to start countUp when in view and stop when not
  useEffect(() => {
    let intervalId;
    if (inView) {
      intervalId = setInterval(countUp, countDelay);
    } else {
      clearInterval(intervalId);
    }
    // Cleanup function to clear interval on unmount or when inView changes
    return () => clearInterval(intervalId);
  }, [inView, maxCount, countStep, countDelay, currentCount]);

  const renderContent = () => {
    if (image) {
      return (
        <div className={"inline-block " + className} ref={ref} {...props}>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="mb-2 w-[3rem] h-[2.5rem] md:w-auto"
          />
          <p className="text-6xl font-bold md:text-8xl">
            <span>{Math.min(currentCount, maxCount)}</span>
            {unit}
          </p>
          <p className="mt-4 text-veryDarkCyan/60 md:mt-6 md:text-2xl">
            {text}
          </p>
        </div>
      );
    } else {
      return (
        <div ref={ref} {...props}>
          <span>{Math.min(currentCount, maxCount)}</span>
          {unit}
        </div>
      );
    }
  };

  return renderContent();
};
export default CountUp;
