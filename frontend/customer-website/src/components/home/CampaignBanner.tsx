import Link from 'next/link';
import { CAMPAIGN } from '@/lib/data/home';
import Media from '@/components/common/Media';
import Reveal from '@/components/common/Reveal';

// Split layout: short centred text on the left, large photo on the right.
export default function CampaignBanner() {
  return (
    <section className="campaign">
      <Reveal className="campaign__copy">
        <h2>{CAMPAIGN.title}</h2>
        <p>{CAMPAIGN.text}</p>
        <Link href={CAMPAIGN.cta.to} className="campaign__link">{CAMPAIGN.cta.label}</Link>
      </Reveal>
      <Media className="campaign__media" src={CAMPAIGN.image} tone={CAMPAIGN.tone} kind="necklace" alt={CAMPAIGN.title} ratio="auto" />
    </section>
  );
}
