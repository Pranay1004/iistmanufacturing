import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manufacturing Technology | IIST Aerospace Engineering",
  description:
    "Academic directory and program website for M.Tech Manufacturing Technology under Aerospace Engineering at IIST.",
  keywords:
    "IIST, Manufacturing Technology, Aerospace Engineering, M.Tech, India, ISRO",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚙️</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOccupationalProgram",
              "name": "M.Tech in Manufacturing Technology",
              "description": "Postgraduate program in Manufacturing Technology at Indian Institute of Space Science and Technology (IIST), focusing on aerospace, automotive, machinery, biomedical, CAM/CAD, and advanced materials engineering.",
              "provider": {
                "@type": "CollegeOrUniversity",
                "name": "Indian Institute of Space Science and Technology (IIST)",
                "sameAs": "https://www.iist.ac.in",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Valiamala, Thiruvananthapuram",
                  "addressRegion": "Kerala",
                  "postalCode": "695547",
                  "addressCountry": "India"
                }
              },
              "programType": "Postgraduate",
              "educationalLevel": "Master's Degree",
              "occupationalCategory": "Manufacturing Engineer, Aerospace Engineer, Mechanical Engineer, Robotics and Smart Manufacturing Specialist",
              "url": "https://iistmanufacturing.vercel.app"
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
