import { useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { gql, useMutation } from "@apollo/client";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import TransitionEffect from "./TransitionEffect";
import Credits from "./Credits";

import client from "../../../../ApolloClient";
import Logo from "./images/logo.png";
import phoneIcon from "./images/icon-phone.svg";
import mailIcon from "./images/icon-email.svg";
import { toast } from "react-toastify";

export const Footer = () => {
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const matches = useMediaQuery({ query: "(max-width:900px)" });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (validateEmail(newEmail)) {
      setEmailError(""); // Clear error message if the email is valid
    }
  };

  const subscribeUser = async (email) => {
    try {
      const { data } = await client.mutate({
        mutation: gql`
          mutation Subscribe($email: String!) {
            subscribe(email: $email) {
              success
              message
            }
          }
        `,
        variables: { email },
      });

      if (data && data.subscribe.success) {
        toast.success(data.subscribe.message);
        return data.subscribe;
      } else {
        toast.error(data.subscribe.message);
        return null;
      }
    } catch (error) {
      console.error("Error subscribing user:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      await subscribeUser(email);
    } else {
      setEmailError("Please enter a valid email address"); // Set error message
    }
  };

  return (
    <footer className="overflow-hidden text-white bg-black">
      <div className="flex flex-col-reverse items-center justify-around bg-midnight pb-4 pt-16 lg:flex-row lg:items-stretch lg:py-16">
        {matches && <Credits />}
        <TransitionEffect
          effect="fadeLeft"
          duration={2}
          className="mt-24 max-w-[85%] lg:mt-0 lg:max-w-[20rem]"
        >
          <img
            src={Logo}
            aria-hidden="true"
            alt="TaskMT Logo"
            className="h-[3rem] w-[10rem] sm:w-[16rem] sm:h-[5rem] invert"
          />
          <p className="mt-6 text-base leading-relaxed">
            Redefine your approach to tasks, break free from old routines.
            Embrace flexibility and productivity with our platform designed for
            your success.
          </p>
          <div className="mt-10 flex items-center">
            <img src={phoneIcon} aria-hidden="true" alt="Phone Icon" />
            <p className="ml-6 text-base">Phone: +1-543-123-4567</p>
          </div>
          <div className="mt-6 flex items-center">
            <img src={mailIcon} aria-hidden="true" alt="Mail Icon" />
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
            To receive tips on how to grow your community, sign up to our weekly
            newsletter. We’ll never send you spam or pass on your email address.
          </p>
          <div>
            <form
              onSubmit={handleSubmit}
              className="mt-10 grid gap-2 gri lg:grid-cols-2 lg:gap-x-2"
            >
              <div className="lg:col-span-1 flex flex-col sm:flex-row items-center gap-2">
                <input
                  ref={emailRef}
                  onChange={handleInputChange}
                  type="text"
                  name="email"
                  value={email}
                  aria-label="Email"
                  className="flex-grow h-[35px] rounded-full px-2 text-lg text-midnight outline-none"
                />
                <button className="h-[37px] w-32 rounded-full bg-[#ff2a4d] px-4 font-poppins text-sm font-bold transition-all duration-500 hover:bg-[#ff2a4d]/60">
                  Subscribe
                </button>
              </div>
              {emailError && (
                <p className="text-sm text-[#ff2a4d] lg:col-span-2 lg:text-left ml-2">
                  {emailError}
                </p>
              )}
            </form>
          </div>

          {!matches && <Credits />}
        </TransitionEffect>
      </div>
    </footer>
  );
};

export default Footer;
