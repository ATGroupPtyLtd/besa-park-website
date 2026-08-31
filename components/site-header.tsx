"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  ["/", "Home"],
  ["/warehouses", "Warehouses"],
  ["/precinct", "The Precinct"],
  ["/location", "Location"],
  ["/vision", "Future Vision"],
  ["/enquire", "Enquire"],
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="BESA Park home">
        BESA <span>PARK</span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([href, label]) => (
          <Link className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>
        ))}
      </nav>
      <Button className="header-cta" asChild>
        <Link href="/enquire">Register interest <ArrowUpRight /></Link>
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="mobile-trigger" variant="outline" size="icon" aria-label="Open menu"><Menu /></Button>
        </SheetTrigger>
        <SheetContent className="mobile-sheet">
          <SheetHeader><SheetTitle className="mobile-wordmark">BESA PARK</SheetTitle></SheetHeader>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map(([href, label]) => (
              <SheetClose asChild key={href}><Link className={pathname === href ? "active" : ""} href={href}>{label}<ArrowUpRight /></Link></SheetClose>
            ))}
          </nav>
          <SheetClose asChild><Link className="button button-primary mobile-enquire" href="/enquire">Register interest</Link></SheetClose>
        </SheetContent>
      </Sheet>
    </header>
  );
}
