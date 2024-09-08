import Heading from './_components/heading';
import Hero from './_components/hero';

const RootPage = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="container h-full flex flex-col justify-center items-center text-center gap-y-8 pt-10">
        <Heading />
        <Hero />
      </div>
    </div>
  );
};

export default RootPage;
