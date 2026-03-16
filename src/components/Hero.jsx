export default function Hero() {
  return (
    <header id="home" className="hero">
      <img
        src="/img/logos/home.jpg"
        alt="Janmejay S Purohit – Full Stack Developer"
        className="hero-bg"
        loading="eager"
        fetchPriority="high"
      />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <h1 className="hero-name">Janmejay S Purohit</h1>
        <p className="hero-subtitle">Full Stack Developer &amp; Software Engineer</p>
        <a href="#about" className="hero-cta">
          Explore
        </a>
      </div>

      <a href="#about" className="hero-arrow" aria-label="Scroll down">
        <i className="fa fa-arrow-down" aria-hidden="true" />
      </a>
    </header>
  );
}
