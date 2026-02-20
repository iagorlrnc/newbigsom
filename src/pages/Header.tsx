import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="container nav-content">
                <a href="#" className="logo">BIG<span className="text-neon">SOM</span></a>
                <nav className={`nav-links flex items-center ${isMobileMenuOpen ? 'active' : ''}`} id="nav-links">
                    <a href="#home" onClick={closeMenu} className="flex items-center">Início</a>
                    <a href="#sobre" onClick={closeMenu} className="flex items-center">Sobre Nós</a>
                    <a href="#servicos" onClick={closeMenu} className="flex items-center">Serviços</a>
                    <a href="#galeria" onClick={closeMenu} className="flex items-center">Galeria</a>
                    <a href="#contato" onClick={closeMenu} className="flex items-center">Contato</a>
                    <Link
                        to="/orcamento"
                        onClick={closeMenu}
                        className="btn btn-primary ml-4 px-4 py-2 text-sm !inline-flex items-center"
                    >
                        Agendar Orçamento
                    </Link>
                </nav>
                <div
                    className="mobile-menu-btn"
                    id="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
            </div>
        </header>
    );
}
