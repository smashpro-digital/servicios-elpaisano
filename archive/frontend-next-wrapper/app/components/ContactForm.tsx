// app/components/ContactForm.tsx
"use client";

import { useState, FormEvent } from "react";

type Locale = "en" | "es";

interface ContactFormProps {
  locale?: Locale;
}

export function ContactForm({ locale = "en" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const labels =
    locale === "es"
      ? {
          title: "Contáctanos",
          name: "Nombre",
          email: "Correo electrónico",
          message: "Mensaje",
          submit: "Enviar mensaje",
          success: "Gracias, hemos recibido tu mensaje.",
          error: "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.",
        }
      : {
          title: "Contact Us",
          name: "Name",
          email: "Email",
          message: "Message",
          submit: "Send Message",
          success: "Thank you, your message has been received.",
          error: "There was a problem sending your message. Please try again.",
        };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      locale,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || labels.error);
        setStatus("error");
        return;
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setErrorMessage(labels.error);
      setStatus("error");
    }
  };

  return (
    <section className="max-w-xl mx-auto p-8">
      <h2 className="text-3xl font-semibold mb-4 text-center">{labels.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="name">
            {labels.name}
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="email">
            {labels.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="message">
            {labels.message}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-md px-4 py-2 font-semibold bg-blue-700 text-white disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : labels.submit}
        </button>

        {status === "success" && (
          <p className="text-green-700 text-sm mt-2 text-center">{labels.success}</p>
        )}

        {status === "error" && (
          <p className="text-red-700 text-sm mt-2 text-center">{errorMessage}</p>
        )}
      </form>
    </section>
  );
}
