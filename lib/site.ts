export const site = {
  name: "Francois Deguire",
  shortName: "francois.works",
  url: "https://francois.works",
  email: "hey@francois.works",
  description: "Design engineer / creative developer.",
  location: {
    city: "Montreal",
    timeZone: "America/Montreal",
    coordinates: { latitude: 45.5019, longitude: -73.5674 },
  },
} as const;

export const mailtoLinkProps = {
  href: `mailto:${site.email}?subject=${encodeURIComponent("Hello there! Reaching out from francois.works")}`,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
