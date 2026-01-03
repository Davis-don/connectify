import Hero from "../components/home/Hero"
import Popularservices from "../components/home/Popularservices"
import HowItWorks from "../components/home/Howitworks"
function Home() {
  return (
    <div className="overall-homepage-page-container">
        <Hero/>
        <Popularservices/>
        <HowItWorks/>
    </div>
  )
}

export default Home