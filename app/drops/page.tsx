import { CampaignCard } from "@/components/CampaignCard";
import { campaigns } from "@/lib/campaigns";

export default function DropsPage() {
  return <div className="container" style={{ paddingTop: 58, minHeight: 520 }}><span className="eyebrow">Find your next favorite</span><h1 style={{ fontSize: 50, letterSpacing: "-.07em", fontWeight: 600, margin: "12px 0" }}>Explore drops.</h1><p style={{ color: "#777d72", margin: "0 0 32px", fontSize: 14 }}>Limited goods from the events and communities you love.</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>{campaigns.map((campaign) => <CampaignCard key={campaign.slug} campaign={campaign} />)}</div><p style={{ fontSize: 11, color: "#777d72", marginTop: 24 }}>Sample campaign details are illustrative and are not connected to live inventory.</p></div>;
}
