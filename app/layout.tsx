import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BESA Park | Work. Play. Connect.",
    template: "%s | BESA Park",
  },
  description: "BESA Park is Traralgon's emerging industrial, business and entertainment precinct, bringing premium warehouses together with fitness and future entertainment.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
