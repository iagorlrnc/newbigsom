const galleryItems = [
    { img: "/assets/gallery-1.jpg", title: "Porta Malas Personalizado" },
    { img: "/assets/gallery-2.jpg", title: "Central Multimídia" },
    { img: "/assets/gallery-3.jpg", title: "Projeto Alta Fidelidade" },
    { img: "/assets/gallery-4.jpg", title: "Iluminação Interna LED" },
    { img: "/assets/gallery-5.jpg", title: "Aplicação Insulfilm Nano" },
    { img: "/assets/gallery-6.jpg", title: "Som para Competição" },
];

export default function Gallery() {
    return (
        <section className="gallery" id="galeria">
            <div className="container text-center">
                <h2 className="section-title">
                    Projetos <span className="text-neon">Realizados</span>
                </h2>
                <div className="gallery-grid" id="gallery-container">
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className="gallery-item fade-in"
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <img src={item.img} alt={item.title} loading="lazy" />
                            <div className="gallery-overlay">
                                <h4>{item.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
