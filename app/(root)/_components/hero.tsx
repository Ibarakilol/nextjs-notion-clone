import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative hidden flex-col justify-center items-center w-full h-[300px] sm:flex">
      <Image alt="Hero" className="object-contain" fill priority src="/hero.webp" />
    </div>
  );
};

export default Hero;
