import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export const CountUp = ({
  image,
  maxCount,
  unit,
  text,
  once = true,
  className = "",
  ...props
}) => {
  // settings
  const countStep = 1;
  const countDelay = 100;
  const startCount = 85; // Initial count value

  // ref and inView
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: once });

  // State to manage the current count
  const [currentCount, setCurrentCount] = useState(startCount);

  // interval id to use for clearInterval
  let intervalId;

  // countUp function
  const countUp = () => {
    if (currentCount < maxCount) {
      setCurrentCount((prevCount) => prevCount + countStep);
    } else {
      clearInterval(intervalId);
    }
  };

  // Effect to start countUp when in view and stop when not
  useEffect(() => {
    if (inView) {
      intervalId = setInterval(countUp, countDelay);
    } else {
      clearInterval(intervalId);
    }
    // Cleanup function to clear interval on unmount or when inView changes
    return () => {
      clearInterval(intervalId);
    };
  }, [inView, maxCount]); // Dependencies include inView and maxCount

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
      <p className="mt-4 text-veryDarkCyan/60 md:mt-6 md:text-2xl">{text}</p>
    </div>
   
  );
};

export default CountUp;
