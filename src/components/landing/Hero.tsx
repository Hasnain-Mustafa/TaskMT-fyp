import HeroImg from 'assets/Hero1.svg';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className=" mt-[3.4rem]">
      <div className="flex flex-col md:items-center justify-between md:flex-row">
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-semibold mb-4">
            Task Management <br /> & Collaboration <br /> Made Easy
          </h1>
          <p className="text-md mb-8">
            Organize your work, boost productivity,
            <br /> and stay on top of your tasks.
          </p>
          {/* <Link to="/login"> */}
          <button className="mt-5 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primaryhover ">
            Get Started
          </button>
          {/* </Link> */}
        </div>
        <img className=" h-[27rem] w-[27rem]" src={HeroImg} alt="" />
      </div>
    </section>
  );
};
export default Hero;
