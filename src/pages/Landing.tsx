import Navbar from 'components/landing/Navbar';
import Hero from 'components/landing/Hero';

const Landing = () => {
  return (
    <section className="xl:max-container max-h-screen">
      <div className="xs:mx-4 sm:mx-5 md:mx-6 lg:mx-7">
        <header className="mt-8">
          <Navbar />
          <Hero />
        </header>
      </div>
    </section>
  );
};

export default Landing;
