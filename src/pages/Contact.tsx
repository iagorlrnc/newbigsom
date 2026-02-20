import { Link } from 'react-router-dom';

export default function Contact() {
    return (
        <section className="contact" id="contato">
            <div className="container">
                <div className="contact-grid">
                    <div className="contact-info slide-right">
                        <h2 className="section-title">
                            Fale <span className="text-neon">Conosco</span>
                        </h2>
                        <p>
                            Entre em contato para solicitar seu orçamento ou tirar dúvidas
                            sobre nossos serviços.
                        </p>
                        <div className="contact-methods">
                            <div className="method">
                                <i className="fab fa-whatsapp text-neon"></i>
                                <div>
                                    <h4>WhatsApp</h4>
                                    <p>(63) 99999-9999</p>
                                </div>
                            </div>
                            <div className="method">
                                <i className="fas fa-envelope text-neon"></i>
                                <div>
                                    <h4>E-mail</h4>
                                    <p>contato@bigsom.com.br</p>
                                </div>
                            </div>
                            <div className="method">
                                <i className="fas fa-map-marker-alt text-neon"></i>
                                <div>
                                    <h4>Endereço</h4>
                                    <p>
                                        Q. 104 Norte Rua NE 7, 03 - Plano Diretor Norte<br />Palmas
                                        - TO, 77006-026
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form slide-left flex flex-col justify-center items-center text-center p-8 bg-zinc-900 rounded-lg border border-zinc-800">
                        <h3 className="text-2xl font-bold mb-4">Agende seu Orçamento</h3>
                        <p className="mb-6 text-zinc-400">
                            Para melhor atendê-lo e organizar nossa agenda, o solicitamento de orçamento agora é feito pela nossa plataforma digital.
                        </p>
                        <Link to="/orcamento" className="btn btn-primary w-full max-w-sm mb-4">
                            Solicitar Orçamento
                        </Link>
                        <p className="text-sm text-zinc-500">
                            Requer criação de conta / login.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
