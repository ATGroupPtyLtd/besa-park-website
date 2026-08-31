import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BESA Park | Work. Play. Connect.",
    template: "%s | BESA Park",
  },
  description: "BESA Park is a connected business, fitness and entertainment precinct in Traralgon, with three Stage One opportunities remaining.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
