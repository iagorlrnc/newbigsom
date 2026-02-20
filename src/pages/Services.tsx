const servicesList = [
    { icon: "fa-volume-up", title: "Instalação de Som", desc: "Projetos de som personalizados, desde o básico até competições de alta fidelidade e pressão sonora." },
    { icon: "fa-box-open", title: "Acessórios & Módulos", desc: "Venda e instalação de alto-falantes, subwoofers, módulos amplificadores e centrais multimídia.", delay: "delay-1" },
    { icon: "fa-tint", title: "Insulfilm", desc: "Aplicação de películas de controle solar de alta performance para proteção UV e privacidade.", delay: "delay-2" },
    { icon: "fa-car-side", title: "Personalização", desc: "Estética automotiva, iluminação em LED e acessórios que destacam o design do seu veículo.", delay: "delay-3" }
];

export default function Services() {
    return (
        <section className="services" id="servicos">
            <div className="container text-center">
                <h2 className="section-title">
                    Nossos <span className="text-neon">Serviços</span>
                </h2>
                <div className="services-grid">
                    {servicesList.map((service, idx) => (
                        <div key={idx} className={`service-card scale-in ${service.delay || ''}`}>
                            <div className="service-icon"><i className={`fas ${service.icon}`}></i></div>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
