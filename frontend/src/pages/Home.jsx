import AboutHorizontal from "../components/AboutHorizontal"
import AboutSection from "../components/AboutSection"
import Footer from "../components/Footer"
import PackagesSection from "../components/PackageSection"
import ServicesSection from "../components/ServicesSection"
import TestimonialSection from "../components/TestimonialSection"
import CinematicHero from "./CinematicHero"
import ContactPage from "./ContactPage"
import LandingPage from "./LandingPage"

const Home = () => {
    return (
        <div className='min-h-screen w-full bg-[#0F0F0F]'>
            <LandingPage />
            <CinematicHero />
            <AboutSection />
            <AboutHorizontal />
            <PackagesSection />
            <ServicesSection />
            <TestimonialSection />
            <ContactPage />
            <Footer />
        </div>
    )
}

export default Home