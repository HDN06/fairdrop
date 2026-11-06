import Link from "next/link";
import { FileCheck2 } from "lucide-react";

export default async function ReceiptPlaceholder({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <div className="container" style={{ padding: "90px 0", maxWidth: 540, textAlign: "center", minHeight: 480 }}><div style={{ width: 60, height: 60, display: "grid", placeItems: "center", borderRadius: 18, background: "#e9f4e8", color: "#287a4b", margin: "0 auto 20px" }}><FileCheck2 size={26} /></div><span className="eyebrow">Claim receipt</span><h1 style={{ fontSize: 38, letterSpacing: "-.06em", margin: "12px 0" }}>Receipt preview</h1><p style={{ color: "#777d72", lineHeight: 1.6 }}>This reference is a placeholder. No claim, verification, or transaction has been completed.</p><div className="card" style={{ padding: 18, textAlign: "left", margin: "24px 0", fontSize: 12, color: "#777d72" }}>Reference <b style={{ display: "block", color: "#171a16", marginTop: 7, overflowWrap: "anywhere" }}>{reference}</b></div><Link href="/drops" className="btn btn-lime">Browse drops</Link></div>;
}
