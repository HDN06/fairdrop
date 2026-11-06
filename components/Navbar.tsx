import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  return <header style={{ borderBottom: "1px solid #e6e8df", background: "rgba(247,248,243,.88)" }}>
    <div className="container" style={{ height: 76, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Link href="/" aria-label="FairDrop home" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 750, letterSpacing: "-.05em", fontSize: 20 }}>
        <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: 9, background: "#d9ff70", fontSize: 17 }}>F</span> fairdrop
      </Link>
      <nav aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <Link className="nav-link" href="/drops">Explore drops</Link>
        <Link className="nav-link" href="/admin">For organizers</Link>
        <Link className="btn btn-lime" href="/drops" style={{ minHeight: 40, paddingInline: 16 }}>Find your drop <ArrowUpRight size={15} /></Link>
      </nav>
    </div>
  </header>;
}
