import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function AdminPlaceholder() {
  return <div className="container" style={{ padding: "90px 0", maxWidth: 540, textAlign: "center", minHeight: 480 }}><div style={{ width: 60, height: 60, display: "grid", placeItems: "center", borderRadius: 18, background: "#eef0e9", margin: "0 auto 20px" }}><LockKeyhole size={25} /></div><span className="eyebrow">Organizer space</span><h1 style={{ fontSize: 38, letterSpacing: "-.06em", margin: "12px 0" }}>Admin dashboard</h1><p style={{ color: "#777d72", lineHeight: 1.6 }}>The protected organizer dashboard will be added in a later phase. No sign-in or campaign management is active.</p><Link href="/drops" className="btn btn-lime" style={{ marginTop: 18 }}>View campaigns</Link></div>;
}
