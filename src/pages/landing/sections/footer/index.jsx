import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import TransitionEffect from "./TransitionEffect";
import Credits from "./Credits";

import Logo from "./images/logo.png";
import phoneIcon from "./images/icon-phone.svg";
import mailIcon from "./images/icon-email.svg";

export const Footer = () => {
  const emailRef = useRef(null);
  const errorRef = useRef(null);

  const matches = useMediaQuery({ query: "(max-width:900px)" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (validate(emailRef.current?.value)) {
    //   emailRef.current.value = "";
    //   alert("Email Submitted!");
    //   errorRef.current?.classList.add("hidden");
    // } else {
    //   if (errorRef.current) {
    //     errorRef.current.textContent = "Check your email please";
    //     errorRef.current.classList.remove("hidden");
    //   }
    // }
  };

  return (
    <footer className="overflow-hidden text-white bg-black">
      {/* <picture>
        <source srcSet={bgDesktop} media="(min-width:900px)" />
        <img src={bgMobile} alt="" aria-hidden="true" className="w-full" />
      </picture> */}
      <div className="flex flex-col-reverse items-center justify-around bg-midnight pb-4 pt-16 lg:flex-row lg:items-stretch lg:py-16">
        {matches && <Credits />}
        <TransitionEffect
          effect="fadeLeft"
          duration={2}
          className="mt-24 max-w-[85%] lg:mt-0 lg:max-w-[20rem]"
        >
          <a href="#0" aria-label="Home">
            <img
              src={Logo}
              aria-hidden="true"
              alt="TaskMT Logo"
              className="max-w-[12rem] h-[5rem] invert lg:max-w-full"
            />
          </a>
          <p className="mt-6 text-base leading-relaxed">
            Redefine your approach to tasks, break free from old routines.
            Embrace flexibility and productivity with our platform designed for
            your success.
          </p>
          <div className="mt-10 flex items-center">
            <img
              src={phoneIcon}
              aria-hidden="true"
              alt=""
              className="phone icon"
            />
            <p className="ml-6 text-base">Phone: +1-543-123-4567</p>
          </div>
          <div className="mt-6 flex items-center">
            <img src={mailIcon} aria-hidden="true" alt="mail icon" />
            <p className="ml-6 text-base">example@taskmt.com</p>
          </div>
          <div className="mt-10 flex gap-5 text-3xl lg:gap-6 lg:text-4xl transition-all duration-500">
            <a href="#0" title="Facebook">
              <FaFacebook color="white" />
            </a>
            <a href="#0" title="Instagram">
              <FaInstagram color="white" />
            </a>
            <a href="#0" title="Twitter">
              <FaTwitter color="white" />
            </a>
          </div>
        </TransitionEffect>
        <TransitionEffect
          effect="fadeRight"
          duration={2}
          className="flex max-w-[85%] flex-col lg:max-w-[33rem]"
        >
          <h2 className="font-poppins text-xl font-semibold uppercase lg:text-2xl">
            Newsletter
          </h2>
          <p className="mt-6 text-base leading-relaxed lg:max-w-[65%]">
            To recieve tips on how to grow your community, sign up to our weekly
            newsletter. We’ll never send you spam or pass on your email address
          </p>
          <div className="">
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="mt-10 flex flex-col items-end justify-between gap-4 lg:flex-row lg:items-start lg:gap-0"
            >
              <div className="w-[40rem] flex items-center">
                <input
                  ref={emailRef}
                  type="text"
                  name="email"
                  aria-label="Email"
                  className="h-[35px] min-w-[20rem]  rounded-full px-2 text-lg text-midnight outline-white"
                />
                <p
                  ref={errorRef}
                  className="mt-1 hidden pl-1 text-sm text-lightRed"
                ></p>
                <button className="ml-2 h-[37px] rounded-full bg-[#ff2a4d]  px-10 font-poppins text-sm font-bold transition-all duration-500 hover:bg-[#ff2a4d]/60">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          {!matches && <Credits />}
        </TransitionEffect>
      </div>
    </footer>
  );
};

export default Footer;
