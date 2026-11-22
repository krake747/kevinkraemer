const SITE_URL = "https://www.kevinkraemer.com/"

export const site = {
    name: "Kevin Kraemer",
    url: SITE_URL,
    email: "kraemer.kevin747@gmail.com",
    image: `${SITE_URL}social-preview.png`,
    socials: {
        github: "https://github.com/krake747",
        linkedin: "https://www.linkedin.com/in/kevin-kraemer-5b1a0583/",
    },
    twitter: {
        handle: "@kevinkraemer",
        site: "@kevinkraemer",
    },

    keywords: [
        "Kevin Kraemer",
        "Full-stack developer",
        "Full-stack development",
        "TypeScript",
        "React",
        "SolidJS",
        "Tailwind CSS",
        "Financial risk analysis",
        "Luxembourg",
    ],
    organization: {
        name: "Kevin Kraemer",
        url: SITE_URL,
        logo: `${SITE_URL}favicon.svg`,
    },
    address: {
        locality: "Luxembourg",
        country: "LU",
    },
    contactType: "professional inquiries",
    feed: {
        description: "Thoughts on software architecture, type systems, finance meets code, and the spaces between.",
    },
    imageDimensions: {
        width: 1200,
        height: 630,
    },
} as const
