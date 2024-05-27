import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./components";
import { Hero, Pricing, Showcase, Footer, CountUp } from "./sections";
import { MotionConfig } from "framer-motion";
import ResetPasswordModal from "../ResetPassword";
import CommunityIcon from "./icon-communities.svg";
import MessagesIcon from "./icon-messages.svg";

const Landing = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const { token } = useParams();
  const location = useLocation();

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const openSignUp = () => {
    setIsSignUpOpen(true);
  };

  const closeSignUp = () => {
    setIsSignUpOpen(false);
  };

  useEffect(() => {
    if (location.pathname.includes("/reset-password/") && token) {
      setIsResetPasswordOpen(true);
    }
  }, [location, token]);
  const closeResetPassword = () => {
    setIsResetPasswordOpen(false);
  };

  return (
    <div className="landing-page">
      <MotionConfig reducedMotion="user">
        <div className="relative flex flex-col justify-center">
          <Navbar
            closeLoginFn={closeLogin}
            closeSignUpFn={closeSignUp}
            isLoginOpen={isLoginOpen}
            isSignUpOpen={isSignUpOpen}
            openLoginFn={openLogin}
            openSignUpFn={openSignUp}
          />
          <Hero />
        </div>
        <Showcase />
        <Pricing />
        <div className="mx-auto mt-32 mb-32 flex flex-col items-center justify-evenly md:mt-36 md:flex-row  bg-no-repeat bg-contain bg-bg-footer-squiggle">
          <CountUp
            image={CommunityIcon}
            maxCount={100}
            unit="%"
            text="Boosting Productivity"
          />
          <CountUp
            image={MessagesIcon}
            maxCount={110}
            unit="%"
            text="Increased Collaboration"
            className="mt-20 md:mt-0"
          />
        </div>
        <Footer />
        {isResetPasswordOpen && (
          <ResetPasswordModal
            closeResetPasswordFn={closeResetPassword}
            token={token}
          />
        )}
      </MotionConfig>
    </div>
  );
};
export default Landing;
