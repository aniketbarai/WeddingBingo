import AboutHorizontal from "../components/AboutHorizontal"
import AboutSection from "../components/AboutSection"
import Footer from "../components/Footer"
import HomePortfolio from "../components/HomePortfolio"
import FaqSection from "../components/FaqSection"
import ServicesSection from "../components/ServicesSection"
import TestimonialSection from "../components/TestimonialSection"
import CinematicHero from "./CinematicHero"
import ContactPage from "./ContactPage"
import LandingPage from "./LandingPage"

const Home = () => {
    return (
        <div className='min-h-screen w-full bg-[#0F0F0F]'>
            <LandingPage />
            <HomePortfolio />
            <AboutHorizontal />
            <AboutSection />
            <ServicesSection />
            <TestimonialSection />
            <FaqSection />
            <ContactPage />
            <Footer />
        </div>
    )
}

export default Home