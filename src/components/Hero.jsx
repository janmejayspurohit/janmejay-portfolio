export default function Hero() {
  return (
    <header id="home" className="hero">
      <img
        src="/img/logos/home.jpg"
        alt="Janmejay S Purohit - Full Stack Developer"
        className="hero-bg"
        loading="eager"
        fetchPriority="high"
      />

      <a href="#about" className="hero-arrow" aria-label="Scroll down">
        <i className="fa fa-arrow-down" aria-hidden="true" />
      </a>
    </header>
  );
}
