export function PageIntro({
  aside,
  eyebrow,
  intro,
  title,
}: Readonly<{
  aside?: React.ReactNode;
  eyebrow: string;
  intro: string;
  title: string;
}>) {
  return (
    <section className="page-intro">
      <div className="site-container page-intro__grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className="page-intro__aside">
          <p className="page-intro__lede">{intro}</p>
          {aside}
        </div>
      </div>
    </section>
  );
}
