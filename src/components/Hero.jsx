export default function Hero({ onExplore }) {
  return (
    <section className="hero wrap" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="little-star" aria-hidden="true">
            ✳
          </span>{" "}
          AHLAM WANI <span className="eyebrow-divider"></span> DEVELOPER
        </div>
        <div className="intro-pill">
          <span className="status-dot" aria-hidden="true"></span> Open to remote
          opportunities
        </div>
        <h1 id="hero-title">
          Thoughtful apps.
          <br />
          <span className="serif">Connected systems.</span>
        </h1>
        <p className="hero-description">
          I’m a React.js, React Native &amp; full-stack developer building LMS
          platforms, admin panels, and mobile apps. Now extending my practice
          into DevOps and cloud engineering.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#work">
            View my projects <span aria-hidden="true">↘</span>
          </a>
          <a className="text-link" href="#contact">
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="hero-explore" aria-label="Explore my experience">
          <span>Explore my experience</span>
          <div>
            <a
              href="#experience"
              data-explore-area="mobile"
              onClick={() => onExplore("mobile")}
            >
              Mobile <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#experience"
              data-explore-area="fullstack"
              onClick={() => onExplore("fullstack")}
            >
              Full-stack <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#experience"
              data-explore-area="lms"
              onClick={() => onExplore("lms")}
            >
              LMS platforms <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#experience"
              data-explore-area="devops"
              onClick={() => onExplore("devops")}
            >
              DevOps journey <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="location">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
            <circle cx="12" cy="10" r="2"></circle>
          </svg>{" "}
          Srinagar, India <span>·</span> Mobile · Web · Cloud
        </div>
      </div>
      <div
        className="hero-art"
        aria-label="An illustration connecting mobile, web and cloud development"
      >
        <div className="art-grid"></div>
        <span className="art-index">A PRACTICE IN PROGRESS</span>
        <div className="cloud-chip">
          <span className="status-dot"></span> Mobile → Web → Cloud
        </div>
        <div className="code-window">
          <div className="window-top">
            <span></span>
            <span></span>
            <span></span>
            <span className="window-title">developer.ts</span>
          </div>
          <div className="code-lines">
            <span className="code-comment">// Connecting the dots</span>
            <br />
            <span className="code-purple">const</span> developer = &#123;
            <br />  name: <span className="code-green">'Ahlam Wani'</span>,
            <br />  builds: [<span className="code-green">'mobile'</span>,{" "}
            <span className="code-green">'web'</span>],
            <br />  exploring: <span className="code-green">'DevOps'</span>,
            <br />  mindset:{" "}
            <span className="code-green">'always learning'</span>
            <br />
            &#125;;
          </div>
          <div className="code-bottom">
            <span className="status-dot"></span> One connected engineering
            journey
          </div>
        </div>
        <div className="phone">
          <div className="phone-speaker"></div>
          <div className="phone-screen">
            <div className="phone-heading">
              Hello, world <span>↗</span>
            </div>
            <div className="phone-sub">Made for the everyday.</div>
            <div className="phone-orbit">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="2.4">
                  <ellipse cx="50" cy="50" rx="39" ry="15"></ellipse>
                  <ellipse
                    cx="50"
                    cy="50"
                    rx="39"
                    ry="15"
                    transform="rotate(60 50 50)"
                  ></ellipse>
                  <ellipse
                    cx="50"
                    cy="50"
                    rx="39"
                    ry="15"
                    transform="rotate(120 50 50)"
                  ></ellipse>
                </g>
                <circle cx="50" cy="50" r="5" fill="currentColor"></circle>
              </svg>
            </div>
            <div className="phone-line"></div>
            <div className="phone-line short"></div>
            <div className="phone-tile">
              <span>Native experiences</span>
              <span>↗</span>
            </div>
            <div className="phone-tabs">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="art-caption">
          <span className="asterisk" aria-hidden="true">
            ✳
          </span>
          <span>
            Good experiences start
            <br />
            with thoughtful engineering.
          </span>
        </div>
        <div className="art-label">01 / BUILD. LEARN. ITERATE.</div>
      </div>
    </section>
  );
}
