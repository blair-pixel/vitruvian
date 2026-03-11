import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { TreatmentsShowcase } from '@/components/ui/treatments-showcase';
import { VitruvianSection } from '@/components/ui/vitruvian-section';

export default function Home() {
  return (
    <main>
      <ScrollExpandMedia
        mediaType='video'
        mediaSrc='/header_home_main.webm'
        bgGradient='radial-gradient(ellipse at 25% 35%, #2e2e2e 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, #242424 0%, transparent 50%), radial-gradient(ellipse at 50% 0%, #333333 0%, transparent 45%), linear-gradient(160deg, #1e1e1e 0%, #141414 50%, #0d0d0d 100%)'
        title='Confidence Starts Here'
        date='Leeds & Barnsley'
      />
      <TreatmentsShowcase />
      <VitruvianSection />
    </main>
  );
}
