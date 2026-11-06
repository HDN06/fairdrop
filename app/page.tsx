import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check, ShieldCheck, Sparkles, TicketCheck } from "lucide-react";
import { CampaignCard } from "@/components/CampaignCard";
import { campaigns } from "@/lib/campaigns";

const howItWorks = [
  { Icon: TicketCheck, title: "Choose a campaign", description: "Find the event merch you want and see what’s still available." },
  { Icon: ShieldCheck, title: "Prove you’re one of one", description: "World ID checks the configured proof of humanity. No wallet needed." },
  { Icon: Sparkles, title: "Claim your drop", description: "One eligible identity can claim once per campaign. We cover the gas." },
];

export default function HomePage() {
  return <>
    <section className="container" style={{ paddingTop: 78, paddingBottom: 80 }}>
      <div style={{ maxWidth: 760 }}><span className="eyebrow">A little more fair. A lot more human.</span><h1 style={{ fontSize: "clamp(52px, 8vw, 96px)", letterSpacing: "-.085em", lineHeight: .98, margin: "24px 0", fontWeight: 600 }}>Good things<br />for <span style={{ background: "#d9ff70", padding: "0 12px 5px", borderRadius: 14 }}>real people.</span></h1><p style={{ color: "#686e63", fontSize: 18, lineHeight: 1.65, maxWidth: 500, marginBottom: 28 }}>Limited event merch should go to the people who show up. FairDrop makes every claim one human, one fair drop.</p><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Link className="btn btn-lime" href="/drops">Explore available drops <ArrowRight size={16} /></Link><a className="btn" href="#how-it-works" style={{ background: "transparent", color: "#171a16" }}>How it works <ArrowDownRight size={16} /></a></div></div>
      <div className="steps" style={{ marginTop: 76, borderTop: "1px solid #e6e8df", borderBottom: "1px solid #e6e8df" }}>{[["01", "Pick your drop"], ["02", "Verify you’re human"], ["03", "Claim it. No gas." ]].map(([n, label]) => <div key={n} style={{ padding: "21px 0", display: "flex", gap: 13, alignItems: "center", color: "#777d72", fontSize: 12 }}><span style={{ color: "#171a16", fontSize: 11, fontWeight: 700 }}>{n}</span>{label}</div>)}</div>
    </section>
    <section style={{ background: "#fff", padding: "70px 0 80px" }}><div className="container"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, marginBottom: 28 }}><div><span className="eyebrow">The good stuff</span><h2 style={{ fontSize: 36, letterSpacing: "-.06em", margin: "12px 0 0", fontWeight: 600 }}>Drops worth showing up for.</h2></div><Link href="/drops" className="nav-link" style={{ display: "inline-flex", gap: 7, alignItems: "center" }}>See all drops <ArrowRight size={14} /></Link></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>{campaigns.slice(0, 3).map((campaign) => <CampaignCard key={campaign.slug} campaign={campaign} />)}</div></div></section>
    <section id="how-it-works" className="container" style={{ paddingTop: 80, paddingBottom: 10 }}><span className="eyebrow">Simple by design</span><h2 style={{ fontSize: 38, letterSpacing: "-.06em", margin: "12px 0 32px", fontWeight: 600 }}>Fair access, without the fuss.</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>{howItWorks.map(({ Icon, title, description }) => <article key={title} className="card" style={{ padding: 22 }}><div style={{ width: 38, height: 38, display: "grid", placeItems: "center", background: "#f2f4ec", borderRadius: 12, marginBottom: 28 }}><Icon size={20} /></div><h3 style={{ fontSize: 16, margin: "0 0 8px" }}>{title}</h3><p style={{ fontSize: 13, color: "#777d72", lineHeight: 1.6, margin: 0 }}>{description}</p></article>)}</div><p style={{ marginTop: 22, color: "#777d72", fontSize: 11, display: "flex", gap: 8, alignItems: "center" }}><Check size={14} /> World ID confirms proof of humanity; it does not verify event attendance or ticket ownership.</p></section>
  </>;
}
