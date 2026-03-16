export default function PageBanner({ title, subtitle }) {
  return (
    <section className="page-banner" aria-label={title}>
      <div className="container">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </section>
  );
}
