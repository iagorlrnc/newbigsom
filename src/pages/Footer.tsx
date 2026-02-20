export default function Footer() {
    return (
        <>
            <footer>
                <div className="container footer-content text-center">
                    <a href="#" className="footer-logo">BIG <span className="text-neon">SOM</span></a>
                    <p>&copy; 2026 Big Som. Todos os direitos reservados.</p>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
            </footer>

            {/* Botão flutuante WhatsApp */}
            <a
                href="https://wa.me/5563999999999"
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
            >
                <i className="fab fa-whatsapp"></i>
            </a>
        </>
    );
}
