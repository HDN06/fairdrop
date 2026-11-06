import Link from "next/link";

export function Footer() {
  return <footer style={{ borderTop: "1px solid #e6e8df", padding: "28px 0", marginTop: 90 }}><div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#777d72", fontSize: 12 }}><span>© 2026 FairDrop · One human. One fair drop.</span><div style={{ display: "flex", gap: 20 }}><Link href="/drops">Explore</Link><Link href="/admin">Organizers</Link></div></div></footer>;
}
