import { ContactForm } from "../components/ContactForm";
import { siteConfig } from "../config/siteConfig";

export default function ContactPage() {
  const { phone, phoneDisplay, email, address } = siteConfig;

  return (
    <>
      <section className="contact-actions">
        <h2>Contact Us</h2>
        <p>You can reach Servicios El Paisano directly using the options below.</p>
        <div className="contact-buttons">
          <a href={`tel:${phone}`} className="btn primary">
            Call {phoneDisplay}
          </a>
          <a href={`mailto:${email}`} className="btn secondary">
            Email Us
          </a>
          <a href={`sms:${phone}`} className="btn secondary">
            Text Message
          </a>
        </div>
        <p className="contact-address">{address}</p>
      </section>

      <ContactForm locale="en" />
    </>
  );
}
