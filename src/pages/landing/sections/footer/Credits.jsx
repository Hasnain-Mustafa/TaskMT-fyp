// icons
import {
  BsGithub,
  BsFillBriefcaseFill,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs";

const Credits = () => {
  return (
    <div className="dark:text-grayishBlue relative text-center text-xs lg:mt-auto lg:text-sm mt-16 text-white/50">
      <p className="text-lg">
        Developed by Eman Binte Kamran & Muhammad Hasnain Mustafa
      </p>
      <ul className="mt-2 flex items-center justify-center gap-x-3 text-lg  [&_a]:transition-all [&_a]:duration-500 hover:[&_a]:text-pink">
        Eman's Links:
        <li>
          <a
            href="https://github.com/emankamran"
            title="GitHub"
            target="_blank"
          >
            <BsGithub color="white" />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/eman-kamran/"
            title="LinkedIn"
            target="_blank"
          >
            <BsLinkedin color="white" />
          </a>
        </li>
        Hasnain's Links:
        <li>
          <a
            href="https://github.com/Hasnain-Mustafa"
            title="GitHub"
            target="_blank"
          >
            <BsGithub color="white" />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/hasnain-mustafa"
            title="LinkedIn"
            target="_blank"
          >
            <BsLinkedin color="white" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Credits;
