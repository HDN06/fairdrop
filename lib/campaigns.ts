export type Campaign = {
  slug: string;
  name: string;
  event: string;
  location: string;
  supply: number;
  claimed: number;
  category: string;
  color: string;
  mark: string;
  status: "Live" | "Coming soon";
  description: string;
};

// Illustrative sample campaign metadata for the Phase 1 UI skeleton.
export const campaigns: Campaign[] = [
  { slug: "ethglobal-mumbai-hoodie", name: "Mumbai Builder Hoodie", event: "ETHGlobal Mumbai", location: "Mumbai, India", supply: 100, claimed: 36, category: "Apparel", color: "#d9ff70", mark: "M", status: "Live", description: "A heavyweight keepsake for the people building what comes next." },
  { slug: "devconnect-tote", name: "Devconnect Everyday Tote", event: "Devconnect", location: "Buenos Aires, Argentina", supply: 250, claimed: 91, category: "Accessories", color: "#dbe6ff", mark: "D", status: "Live", description: "Room for your laptop, notebook, and the next big idea." },
  { slug: "builders-club-tee", name: "Builders Club Tee", event: "ETHGlobal Online", location: "Online", supply: 500, claimed: 184, category: "Apparel", color: "#ffd9cf", mark: "B", status: "Live", description: "A soft cotton tee for the curious, the stubborn, and the shipping." },
  { slug: "protocol-sticker-pack", name: "Protocol Sticker Pack", event: "Protocol Village", location: "Singapore", supply: 300, claimed: 300, category: "Collectibles", color: "#e8ddff", mark: "P", status: "Coming soon", description: "A small set of big ideas, made to travel with your laptop." },
];

export function getCampaign(slug: string) {
  return campaigns.find((campaign) => campaign.slug === slug);
}
