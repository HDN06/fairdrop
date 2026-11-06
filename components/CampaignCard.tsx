import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Campaign } from "@/lib/campaigns";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const remaining = Math.max(0, campaign.supply - campaign.claimed);
  const percent = campaign.supply ? Math.min(100, campaign.claimed / campaign.supply * 100) : 0;
  return <Link href={`/drops/${campaign.slug}`} className="card" style={{ display: "block", transition: "transform .2s, box-shadow .2s" }}>
    <div style={{ height: 205, background: campaign.color, padding: 22, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .12, backgroundImage: "radial-gradient(#171a16 1px, transparent 1px)", backgroundSize: "17px 17px" }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="pill" style={{ color: "#171a16", background: "rgba(255,255,255,.65)" }}>{campaign.category}</span><span style={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "50%", background: "rgba(255,255,255,.5)" }}><ArrowUpRight size={17} /></span></div>
      <div style={{ position: "absolute", right: 34, bottom: -29, width: 150, height: 150, borderRadius: 30, background: "rgba(255,255,255,.46)", transform: "rotate(-12deg)", display: "grid", placeItems: "center", fontSize: 104, fontWeight: 800, letterSpacing: "-.1em" }}>{campaign.mark}</div>
      <div style={{ position: "absolute", left: 22, bottom: 23, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 700 }}>{campaign.event}</div>
    </div>
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}><div><h3 style={{ margin: "0 0 8px", fontSize: 19, letterSpacing: "-.04em" }}>{campaign.name}</h3><div style={{ display: "flex", gap: 5, alignItems: "center", color: "#777d72", fontSize: 12 }}><MapPin size={13} />{campaign.location}</div></div><span style={{ fontSize: 11, color: campaign.status === "Live" ? "#287a4b" : "#777d72", background: campaign.status === "Live" ? "#eff8f0" : "#f3f4f0", borderRadius: 20, padding: "6px 9px", whiteSpace: "nowrap" }}>{campaign.status}</span></div>
      <p style={{ color: "#777d72", fontSize: 13, lineHeight: 1.55, margin: "15px 0 20px", minHeight: 40 }}>{campaign.description}</p>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#777d72", marginBottom: 8 }}><span>{remaining} of {campaign.supply} left</span><span>{campaign.claimed} claimed</span></div>
      <div style={{ height: 5, background: "#eef0e9", borderRadius: 8 }}><div style={{ height: "100%", width: `${percent}%`, background: "#171a16", borderRadius: 8 }} /></div>
    </div>
  </Link>;
}
