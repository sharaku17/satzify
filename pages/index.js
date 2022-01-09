import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ParaphraseSection from "../components/ParaphraseSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div id="container" className="">
      <div class="wrapper spacer layer1  min-h-screen">
        <Navbar></Navbar>
        <HeroSection></HeroSection>
      </div>
      <div
        id="paraphrase"
        class="wrapper snap-y min-h-screen max-h-screen bg-gray-100"
      >
        <ParaphraseSection></ParaphraseSection>
      </div>
      <div class="wrapper bg-gray-100  min-h-[33vh] spacer2 layer2">
        <Footer></Footer>
      </div>
    </div>
  );
}
