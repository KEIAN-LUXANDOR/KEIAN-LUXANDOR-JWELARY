import { SITE } from '@/lib/site';

// Image logo: black version on white backgrounds, white version in the black footer.
// The files are public/icons/keian-logo-black.webp and public/icons/keian-logo-white.webp.
// (The old text logo styles are still in Header.css under "Two-line text logo".)
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`logo-img ${light ? 'logo-img--light' : ''}`}
      src={light ? '/icons/keian-logo-white.webp' : '/icons/keian-logo-black.webp'}
      alt={SITE.name}
      width="742"
      height="203"
    />
  );
}
