export const WEBSITE_BASE_URL = "https://servicioselpaisano.com";
export const PHONE_NUMBER = "423-265-2528";
export const FAX_NUMBER = "423-521-4609";
export const EMAIL_ADDRESS = "servicioselpaisano@gmail.com";
export const OFFICE_ADDRESS = "3501 Rossville Blvd, Chattanooga, TN 37407";
export const GOOGLE_MAPS_URL = "https://goo.gl/maps/6T6h7qCY9URgwKxn7";
export const COUPON_URL = `${WEBSITE_BASE_URL}/coupon-d'anniversaire.docx`;
export const PRIVACY_URL = `${WEBSITE_BASE_URL}/privacy.html`;
export const YOUTUBE_VIDEO_URL = "https://youtu.be/OgTlSTC77Kg";

export const OFFICE_HOURS = {
  weekday: { open: 9, close: 18 },
  saturday: { open: 9, close: 15 },
};

export const SOCIAL_LINKS = [
  {
    label: "Twitter/X @servcselpaisano",
    url: "https://twitter.com/servcselpaisano",
  },
  {
    label: "Facebook @s.elpaisano",
    url: "https://www.facebook.com/s.elpaisano/",
  },
];

export const CONSULATE_LINKS = [
  {
    label: "El Salvador",
    url: "http://www.elsalvadorga.org/",
  },
  {
    label: "Guatemala",
    url: "http://consatlanta.blogspot.com/p/pasaportes-y-id-consular.html",
  },
  {
    label: "Honduras",
    url: "http://www.consuladohnatl.com/",
  },
  {
    label: "Mexico",
    url: "https://consulmex.sre.gob.mx/atlanta/",
  },
];

export const WEBSITE_IMAGE_URLS = {
  logo: `${WEBSITE_BASE_URL}/images/Servicios-Logo.png`,
  office: `${WEBSITE_BASE_URL}/images/slide01.webp`,
  anniversary: `${WEBSITE_BASE_URL}/images/20th-Anniversary.webp`,
  transfers: `${WEBSITE_BASE_URL}/images/slide02.webp`,
  consultation: `${WEBSITE_BASE_URL}/images/slide03.webp`,
  phones: `${WEBSITE_BASE_URL}/images/slide04.webp`,
  phoneAccessories: `${WEBSITE_BASE_URL}/images/slide08.webp`,
  taxes: `${WEBSITE_BASE_URL}/images/slide11.webp`,
  founder: `${WEBSITE_BASE_URL}/images/slide05.webp`,
  allServices: `${WEBSITE_BASE_URL}/images/slide09.webp`,
  building: `${WEBSITE_BASE_URL}/images/slide10.webp`,
  translation: `${WEBSITE_BASE_URL}/images/servicios-translation.webp`,
  assistance: `${WEBSITE_BASE_URL}/images/servicios-assistance.webp`,
  taxFiling: `${WEBSITE_BASE_URL}/images/servicios-declaracion-impuestos.webp`,
  location: `${WEBSITE_BASE_URL}/images/servicios-location.webp`,
  santos: `${WEBSITE_BASE_URL}/images/Santos-Chavez.jpg`,
  carmen: `${WEBSITE_BASE_URL}/images/Carmen-Hernandez.jpg`,
};

export const ABOUT_COPY = {
  en:
    "Servicios El Paisano helps customers with translation and interpretation from Spanish to English or English to Spanish, plus many document and community services for Chattanooga and surrounding areas. The business was founded in November 2005 by Santos Chavez after graduating from Chattanooga State Technical Community College with an Associate of Applied Science degree in Information Systems Technology. Carmen Hernandez joined in 2009, and together they have continued building a friendly office with strong customer service.",
  es:
    "Servicios El Paisano ayuda con traduccion e interpretacion de espanol a ingles o de ingles a espanol, ademas de muchos servicios de documentos y comunidad para Chattanooga y sus alrededores. El negocio fue fundado en noviembre de 2005 por Santos Chavez despues de graduarse de Chattanooga State Technical Community College con un titulo asociado en Tecnologia de Sistemas de Informacion. Carmen Hernandez se unio en 2009, y juntos han seguido creando una oficina amable con buen servicio al cliente.",
};

export const SERVICE_CATEGORIES = {
  en: ["All", "Documents", "Taxes", "Phones", "Money", "Vehicles", "Travel"],
  es: ["Todo", "Documentos", "Impuestos", "Telefonos", "Dinero", "Vehiculos", "Viajes"],
};

export const WEBSITE_SERVICES = [
  {
    category: "Taxes",
    title: { en: "Tax preparation and e-filing", es: "Preparacion de impuestos y e-file" },
    subtitle: {
      en: "Current-year and prior-year filing, IRS e-file support, ITIN/TAX ID guidance, and dependent document review.",
      es: "Declaraciones del ano actual y anos anteriores, e-file del IRS, ayuda con ITIN/TAX ID y revision de documentos para dependientes.",
    },
  },
  {
    category: "Documents",
    title: { en: "Translation", es: "Traduccion" },
    subtitle: {
      en: "Spanish to English and English to Spanish document translation.",
      es: "Traduccion de documentos de espanol a ingles y de ingles a espanol.",
    },
  },
  {
    category: "Documents",
    title: { en: "Interpretation", es: "Interpretacion" },
    subtitle: {
      en: "Bilingual interpreter help for appointments, offices, courts, and other visits.",
      es: "Ayuda de interprete bilingue para citas, oficinas, cortes y otras visitas.",
    },
  },
  {
    category: "Documents",
    title: { en: "Notary", es: "Notaria" },
    subtitle: {
      en: "Notarization for many types of documents.",
      es: "Notarizacion para muchos tipos de documentos.",
    },
  },
  {
    category: "Documents",
    title: { en: "Legal document help", es: "Ayuda con documentos legales" },
    subtitle: {
      en: "Private consultation help with legal documents, letters, notifications, taxes, and property deeds.",
      es: "Consultas privadas para documentos legales, cartas, notificaciones, impuestos y escrituras de propiedad.",
    },
  },
  {
    category: "Phones",
    title: { en: "Cell phones, SIM cards, and accessories", es: "Telefonos, tarjetas SIM y accesorios" },
    subtitle: {
      en: "Phone sales, activations, service plans, accessories, and smartphone help.",
      es: "Venta de telefonos, activaciones, planes de servicio, accesorios y ayuda con telefonos inteligentes.",
    },
  },
  {
    category: "Money",
    title: { en: "Money transfers", es: "Transferencias de dinero" },
    subtitle: {
      en: "Send and receive money in the United States and internationally.",
      es: "Envie y reciba dinero dentro de Estados Unidos e internacionalmente.",
    },
  },
  {
    category: "Money",
    title: { en: "Money orders", es: "Giros postales" },
    subtitle: {
      en: "Money orders of any amount.",
      es: "Giros postales de cualquier cantidad.",
    },
  },
  {
    category: "Money",
    title: { en: "Bill pay", es: "Pago de facturas" },
    subtitle: {
      en: "Bill payments for water, electricity, telephone, cell phone, and more.",
      es: "Pago de facturas de agua, electricidad, telefono, celular y mas.",
    },
  },
  {
    category: "Vehicles",
    title: { en: "Car insurance", es: "Seguro de auto" },
    subtitle: {
      en: "Car insurance assistance.",
      es: "Ayuda con seguro de auto.",
    },
  },
  {
    category: "Vehicles",
    title: { en: "Car tags, titles, and registration renewal", es: "Placas, titulos y renovacion de registro" },
    subtitle: {
      en: "Vehicle tags, titles, registration renewal, title copies, bills of sale, and VIN support.",
      es: "Placas, titulos, renovacion de registro, copias de titulo, bill of sale y ayuda con VIN.",
    },
  },
  {
    category: "Travel",
    title: { en: "Passports and passport photos", es: "Pasaportes y fotos de pasaporte" },
    subtitle: {
      en: "Passport pictures plus guidance for Guatemalan, Honduran, Mexican, and El Salvador passport requirements.",
      es: "Fotos de pasaporte y orientacion para requisitos de pasaportes de Guatemala, Honduras, Mexico y El Salvador.",
    },
  },
  {
    category: "Travel",
    title: { en: "Plane and bus tickets", es: "Boletos de avion y autobus" },
    subtitle: {
      en: "Airline and bus ticket support.",
      es: "Ayuda con boletos de avion y autobus.",
    },
  },
  {
    category: "Travel",
    title: { en: "Travel to consulates", es: "Viajes a consulados" },
    subtitle: {
      en: "Travel support for Guatemalan, Mexican, Honduras, and El Salvador consulates, the airport, and immigration courts.",
      es: "Ayuda de viaje a consulados de Guatemala, Mexico, Honduras y El Salvador, el aeropuerto y cortes de inmigracion.",
    },
  },
  {
    category: "Documents",
    title: { en: "Fax and copies", es: "Fax y copias" },
    subtitle: {
      en: "Domestic and international fax service plus color and black-and-white copies.",
      es: "Servicio de fax nacional e internacional y copias a color o blanco y negro.",
    },
  },
  {
    category: "Travel",
    title: { en: "Shipping", es: "Envios" },
    subtitle: {
      en: "Package shipping support to Central America.",
      es: "Ayuda con envios de paquetes a Centroamerica.",
    },
  },
];

export const SERVICE_CHECKLISTS: Record<
  string,
  { en: string[]; es: string[] }
> = {
  default: {
    en: [
      "Photo ID",
      "Any letters, forms, or documents related to the request",
      "Best phone number or email for follow-up",
    ],
    es: [
      "Identificacion con foto",
      "Cartas, formularios o documentos relacionados con la solicitud",
      "Mejor telefono o email para seguimiento",
    ],
  },
  "Tax preparation and e-filing": {
    en: [
      "Photo ID for each taxpayer",
      "W-2, 1099, or income documents",
      "Social Security, ITIN, or TAX ID documents",
      "Dependent documents and prior-year tax return if available",
    ],
    es: [
      "Identificacion con foto de cada contribuyente",
      "W-2, 1099 o documentos de ingresos",
      "Documentos de Social Security, ITIN o TAX ID",
      "Documentos de dependientes y declaracion anterior si la tiene",
    ],
  },
  Translation: {
    en: [
      "Original document or a clear photo/scan",
      "Target language needed",
      "Deadline or appointment date if urgent",
    ],
    es: [
      "Documento original o foto/escaneo claro",
      "Idioma que necesita",
      "Fecha limite o cita si es urgente",
    ],
  },
  Interpretation: {
    en: [
      "Appointment date, time, and location",
      "Office, court, or agency name",
      "Any notice or letter about the appointment",
    ],
    es: [
      "Fecha, hora y ubicacion de la cita",
      "Nombre de oficina, corte o agencia",
      "Carta o aviso sobre la cita",
    ],
  },
  Notary: {
    en: [
      "Unsigned document",
      "Valid photo ID",
      "All signers must be present",
    ],
    es: [
      "Documento sin firmar",
      "Identificacion valida con foto",
      "Todos los firmantes deben estar presentes",
    ],
  },
  "Legal document help": {
    en: [
      "Letters, notices, deeds, or legal documents",
      "Court or agency deadline",
      "Photo ID and contact information",
    ],
    es: [
      "Cartas, notificaciones, escrituras o documentos legales",
      "Fecha limite de corte o agencia",
      "Identificacion con foto e informacion de contacto",
    ],
  },
  "Cell phones, SIM cards, and accessories": {
    en: [
      "Phone or device if you need help",
      "Carrier/account information if available",
      "Photo ID for activations when required",
    ],
    es: [
      "Telefono o equipo si necesita ayuda",
      "Informacion de cuenta o compania si la tiene",
      "Identificacion con foto para activaciones cuando se requiera",
    ],
  },
  "Money transfers": {
    en: [
      "Valid photo ID",
      "Recipient full name and destination",
      "Amount to send and contact number",
    ],
    es: [
      "Identificacion valida con foto",
      "Nombre completo del destinatario y destino",
      "Cantidad a enviar y numero de contacto",
    ],
  },
  "Money orders": {
    en: ["Payment amount", "Payee name", "Photo ID if needed"],
    es: ["Cantidad del giro", "Nombre del beneficiario", "Identificacion si se necesita"],
  },
  "Bill pay": {
    en: ["Bill statement", "Account number", "Payment amount"],
    es: ["Factura", "Numero de cuenta", "Cantidad de pago"],
  },
  "Car insurance": {
    en: ["Driver license", "Vehicle information", "Current policy if available"],
    es: ["Licencia de conducir", "Informacion del vehiculo", "Poliza actual si la tiene"],
  },
  "Car tags, titles, and registration renewal": {
    en: [
      "Photo ID",
      "Title, registration, bill of sale, or VIN information",
      "Renewal notice if available",
    ],
    es: [
      "Identificacion con foto",
      "Titulo, registro, bill of sale o informacion de VIN",
      "Aviso de renovacion si lo tiene",
    ],
  },
  "Passports and passport photos": {
    en: [
      "Current passport or birth certificate",
      "Photo ID",
      "Consulate or country requirement letter if available",
    ],
    es: [
      "Pasaporte actual o acta de nacimiento",
      "Identificacion con foto",
      "Carta de requisitos del consulado o pais si la tiene",
    ],
  },
};
