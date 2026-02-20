import { useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Gallery from './Gallery';
import Contact from './Contact';
import BusinessHours from './BusinessHours';
import Footer from './Footer';

function LandingPage() {
    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const animatedElements = document.querySelectorAll(
            ".slide-up, .fade-in, .scale-in, .slide-right, .slide-left"
        );
        animatedElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Header />
            <main>
                <Hero />
                <About />
                <Services />
                <Gallery />
                <Contact />
                <BusinessHours />
            </main>
            <Footer />
        </>
    );
}

export default LandingPage;
