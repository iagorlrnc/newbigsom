export default function BusinessHours() {
    return (
        <section className="business-hours" id="horarios">
            <div className="container text-center">
                <h2 className="section-title">
                    Onde Estamos & <span className="text-neon">Horários</span>
                </h2>

                <div className="location-grid">
                    <div className="hours-card scale-in">
                        <i className="fas fa-clock time-icon text-neon"></i>
                        <div className="hours-list">
                            <div className="hour-item">
                                <span className="day">Segunda a Sexta</span>
                                <span className="time">08:00 - 18:00</span>
                            </div>
                            <div className="hour-item">
                                <span className="day">Sábado</span>
                                <span className="time">08:00 - 12:00</span>
                            </div>
                            <div className="hour-item closed">
                                <span className="day">Domingo e Feriados</span>
                                <span className="time text-red">Fechado</span>
                            </div>
                        </div>
                    </div>

                    <div className="map-container scale-in delay-1">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1963.5071369618965!2d-48.330892999458875!3d-10.179494756012364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cb6896430bed%3A0x9b9d01d9b541a3d1!2sBig%20Som%20Auto%20Center!5e0!3m2!1spt-BR!2sbr!4v1771609370666!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
