import { destinations } from "@/data/destinations";

export function TravelHero() {
  return <section className="travel-hero">
    <div className="hero-glow" /><div className="hero-cloud hero-cloud-a" /><div className="hero-cloud hero-cloud-b" />
    <div className="hero-slides">{destinations.map((destination) => <div className="hero-slide" key={destination.id}>
      <div className="hero-title">{destination.heroTitle}<small>{destination.heroTag}</small></div>
      <span className="hero-location">● {destination.heroLocation}</span>
    </div>)}</div>
  </section>;
}
