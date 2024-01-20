import { RxClock, RxColorWheel, RxCountdownTimer, RxFileText, RxGear, RxHome, RxPaperPlane, RxReader, RxRocket, RxShare2, RxStack } from "react-icons/rx";

export const workspaceNav = {
  title: "Espacio de trabajo",
  description: "Espacio de trabajo",
  items: [
    {
      title: "Home",
      href: "/home",
      icon: RxHome,
    },
    {
      title: "Configuración",
      href: "/settings",
      icon: RxGear,
    },
    {
      title: "Agentes de IA",
      href: "/agents",
      icon: RxColorWheel,
    },
    {
      title: "Automatizaciones",
      href: "/workflows",
      icon: RxCountdownTimer,
    },
    {
      title: "Inbox",
      href: "/settings  ",
      icon: RxShare2,
    },
  ],
};

export const knowledgeBaseNav = {
  title: "Base del conocimiento",
  description: "Base del conocimiento",
  items: [
    {
      title: "Fuentes de datos",
      href: "/datasources",
      icon: RxReader,
    },
    {
      title: "FAQs",
      href: "/faqs",
      icon: RxStack,
    },
  ],
};


export const apiBaseNav = {
  title: "Conexiones",
  description: "Conexiones",
  items: [
    {
      title: "APIs",
      href: "/apis",
      icon: RxClock,
    },
    {
      title: "Plataformas",
      href: "/integration",
      icon: RxRocket,
    },
  ],
};

export const helpBaseNav = {
  title: "Obtener Ayuda",
  description: "Obtener Ayuda",
  items: [
    {
      title: "Tutoriales",
      href: "/datasources",
      icon: RxFileText,
    },
    {
      title: "Documentacion",
      href: "/faqs",
      icon: RxFileText,
    },
    {
      title: "Soporte",
      href: "/faqs",
      icon: RxPaperPlane,
    },
  ],
};

