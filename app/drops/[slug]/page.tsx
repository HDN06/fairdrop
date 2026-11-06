import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, ShieldCheck } from "lucide-react";
import { getCampaign, campaigns } from "@/lib/campaigns";

export function generateStaticParams() { return campaigns.map(({ slug }) => ({ slug })); }

export default async function CampaignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();
  const remaining = campaign.supply - campaign.claimed;
  return <div className="container" style={{ paddingTop: 38, maxWidth: 950 }}><Link href="/drops" className="nav-link" style={{ display: "inline-flex", gap: 7, alignItems: "center", marginBottom: 24 }}><ArrowLeft size={14} /> All drops</Link><div className="detail-layout"><div className="detail-art" style={{ minHeight: 370, borderRadius: 22, background: campaign.color, display: "grid", placeItems: "center", overflow: "hidden", position: "relative" }}><span style={{ position: "absolute", inset: 0, opacity: .12, backgroundImage: "radial-gradient(#171a16 1px, transparent 1px)", backgroundSize: "17px 17px" }} /><span style={{ position: "relative", fontSize: 230, fontWeight: 800, letterSpacing: "-.12em" }}>{campaign.mark}</span></div><div><span className="eyebrow">{campaign.event}</span><h1 style={{ fontSize: 44, letterSpacing: "-.07em", lineHeight: 1.03, fontWeight: 600, margin: "15px 0" }}>{campaign.name}</h1><div style={{ color: "#777d72", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} />{campaign.location}</div><p style={{ color: "#686e63", lineHeight: 1.7, fontSize: 14, margin: "24px 0" }}>{campaign.description}</p><div className="card" style={{ padding: 16, marginBottom: 18 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}><b>{remaining} remaining</b><span style={{ color: "#777d72" }}>of {campaign.supply} total</span></div><div style={{ height: 5, background: "#eef0e9", borderRadius: 8 }}><div style={{ height: "100%", width: `${campaign.claimed / campaign.supply * 100}%`, background: "#171a16", borderRadius: 8 }} /></div></div><button className="btn btn-lime" disabled style={{ width: "100%", opacity: .58, cursor: "not-allowed" }}>Claim flow coming in a later phase</button><p style={{ display: "flex", gap: 7, alignItems: "center", color: "#777d72", fontSize: 11, lineHeight: 1.5 }}><ShieldCheck size={14} /> Verification and claiming are not active in this UI foundation.</p></div></div><div style={{ marginTop: 34, borderTop: "1px solid #e6e8df", paddingTop: 15, color: "#777d72", fontSize: 11 }}>Illustrative sample campaign data. Inventory is not live.</div></div>;
}
