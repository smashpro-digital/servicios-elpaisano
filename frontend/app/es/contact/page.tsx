import { ContactForm } from "../../components/ContactForm";
import { siteConfig } from "../../config/siteConfig";

export default function ContactPageES() {
  const { phone, phoneDisplay, email, address } = siteConfig;

  return (
    <>
      <section className="contact-actions">
        <h2>Contáctenos</h2>
        <p>Puedes comunicarte con Servicios El Paisano usando las opciones abajo.</p>
        <div className="contact-buttons">
          <a href={`tel:${phone}`} className="btn primary">
            Llamar {phoneDisplay}
          </a>
          <a href={`mailto:${email}`} className="btn secondary">
            Enviar correo
          </a>
          <a href={`sms:${phone}`} className="btn secondary">
            Mensaje de texto
          </a>
        </div>
        <p className="contact-address">{address}</p>
      </section>

      <ContactForm locale="es" />
    </>
  );
}
