import React from "react";

const HeroSection = () => {
  return (
    <div>
      <div className="container mx-auto md:py-10  ">
        <div className="flex flex-col md:flex-row items-center justify-between ">
          <div className="HeroText flex flex-col items-center md:items-start  relative   w-full md:w-1/3">
            <div className=" px-4 text-left">
              <h1 className=" pt-5 md:pt-20 text-3xl md:text-7xl font-bold leading-none">
                Text <br></br>{" "}
                <span className=" text-light_red">umschreiben</span>, ganz{" "}
                <span className=" text-light_red">einfach</span>
              </h1>
            </div>
            <p className=" pt-10 px-4 max-w-lg text-lg md:text-xl text-white tracking-wide leading-tight md:text-gray-300">
              Satzify's AI-Technologie unterstützt dich beim verfassen jeglicher
              Texte
            </p>
            <a href="#paraphrase">
              <button className="md:py-2 md:px-7  px-8 py-3 mt-10  font-semibold hover:bg-light_red  transition-all ease-in border-[3px] border-light_red rounded-lg">
                <span className=" tracking-widest ">Try it yourself</span>
              </button>
            </a>
          </div>
          <div className="w-1/2 hidden md:flex">
            <div className="  ">
              <img
                className="rounded-2xl shadow-xl border border-gray-900"
                src="./images/Animation.gif"
                alt=""
              ></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
