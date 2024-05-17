import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottieAnimation = ({ animationPath, isVisible }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    let anim;
    if (isVisible && animationContainer.current) {
      anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: animationPath,
      });

      return () => {
        if (anim) {
          anim.destroy();
        }
      };
    }
  }, [isVisible, animationPath]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "300px",
      }}
    >
      <div
        ref={animationContainer}
        style={{ width: "300px", height: "300px" }}
      />
    </div>
  );
};

export default LottieAnimation;
