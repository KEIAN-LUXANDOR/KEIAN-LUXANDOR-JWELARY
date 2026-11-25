import Hero from '@/components/home/Hero';
import CampaignBanner from '@/components/home/CampaignBanner';
import ZigZagStory from '@/components/home/ZigZagStory';
import OurCraft from '@/components/home/OurCraft';
import Benefits from '@/components/home/Benefits';
import CategoryStrip from '@/features/categories/components/CategoryStrip';
import '@/components/home/home.css';

// Home page sections, top to bottom.
// Address: /
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <CampaignBanner />
      <ZigZagStory />
      <OurCraft />
      <Benefits />
    </>
  );
}
