export default function AboutSection() {
  return (
    <section className="section wrap about">
      <p className="eyebrow">A LITTLE MORE ABOUT ME</p>
      <div className="about-grid">
        <h2>
          Curious by nature.
          <br />
          <span className="serif">An engineer by practice.</span>
        </h2>
        <div>
          <p>
            I enjoy working across the layers of a product: the interface, the
            APIs behind it, and the practical work of getting a release out the
            door.
          </p>
          <p>
            My experience also includes mentoring junior developers, reviewing
            pull requests, and working with teams to troubleshoot production
            issues.
          </p>
          <p className="education">
            <span aria-hidden="true">↗</span> B.Tech, Computer Science
            <br />
            <span>University of Kashmir · 2015–2019</span>
          </p>
        </div>
      </div>
    </section>
  );
}
