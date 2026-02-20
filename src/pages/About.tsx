export default function About() {
    return (
        <section className="about" id="sobre">
            <div className="container about-grid">
                <div className="about-text fade-in">
                    <h2 className="section-title">
                        Nossa <span className="text-neon">História</span>
                    </h2>
                    <p>
                        A Big Som é referência em som automotivo e acessórios. Com anos de
                        experiência no mercado, transformamos a paixão por carros em
                        projetos de alta performance, estética e qualidade sonora
                        superior.
                    </p>
                    <p>
                        Trabalhamos com as melhores marcas globais, garantindo
                        durabilidade, potência e um acabamento impecável em cada veículo.
                    </p>
                    <ul className="about-features">
                        <li>
                            <i className="fas fa-check text-neon"></i> Profissionais Altamente
                            Qualificados
                        </li>
                        <li>
                            <i className="fas fa-check text-neon"></i> Equipamentos de Última
                            Geração
                        </li>
                        <li>
                            <i className="fas fa-check text-neon"></i> Garantia em Todos os
                            Serviços
                        </li>
                    </ul>
                </div>
                <div className="about-img_container fade-in delay-1">
                    <div className="glow-box"></div>
                    <img
                        src="/assets/about-img.jpg"
                        alt="Equipe Big Som"
                        className="about-img"
                    />
                </div>
            </div>
        </section>
    );
}
