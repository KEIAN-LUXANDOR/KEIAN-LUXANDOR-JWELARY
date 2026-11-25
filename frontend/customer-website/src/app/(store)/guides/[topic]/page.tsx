import type { Metadata } from 'next';
import InfoContent from '@/components/common/InfoContent';
import { INFO_PAGES } from '@/lib/data/infoPages';

export async function generateMetadata({ params }: PageProps<'/guides/[topic]'>): Promise<Metadata> {
  return { title: INFO_PAGES[(await params).topic]?.title ?? 'Guide' };
}

// Address: /guides/engagement-ring-guide, /guides/choose-a-diamond …
export default async function GuidePage({ params }: PageProps<'/guides/[topic]'>) {
  return <InfoContent topic={(await params).topic} />;
}
