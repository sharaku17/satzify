import React from "react";

const HeroSection = () => {
  return (
    <div>
      <div class="container mx-auto md:py-10  ">
        <div class="flex flex-col md:flex-row items-center justify-between ">
          <div class="HeroText flex flex-col items-center md:items-start  relative   w-full md:w-1/3">
            <div class=" px-4 text-left">
              <h1 class=" pt-5 md:pt-20 text-3xl md:text-7xl font-bold leading-none">
                Text <br></br> <span class=" text-light_red">umschreiben</span>,{" "}
                ganz <span class=" text-light_red">einfach</span>
              </h1>
            </div>
            <p class=" pt-10 px-4 max-w-lg text-lg md:text-xl text-white tracking-wide leading-tight md:text-gray-300">
              Satzify's AI-Technologie unterstützt dich beim verfassen jeglicher
              Texte
            </p>
            <a href="#paraphrase">
              <button class="md:py-2 md:px-7  px-8 py-3 mt-10  font-semibold hover:bg-light_red  transition-all ease-in border-[3px] border-light_red rounded-lg">
                <span class=" tracking-widest ">Try it yourself</span>
              </button>
            </a>
          </div>
          <div class="w-1/2 hidden md:flex">
            <div class="  ">
              <img
                class="rounded-2xl shadow-xl border border-gray-900"
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
