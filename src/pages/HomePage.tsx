import Seo from '../components/Seo';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-center">
      <Seo
        title="Home"
        description="Everything you need for your pet — scratchers, beds, tunnels, and toys."
      />
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Everything you need for your pet
      </h1>
      <img
        src="/images/home_image.jpg"
        alt="Happy pets"
        className="mx-auto mt-8 w-full max-w-3xl rounded-2xl object-cover shadow-sm"
      />
    </div>
  );
}
