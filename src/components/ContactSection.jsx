import { useState } from "react";

const email = "waniahlam625@gmail.com";

export default function ContactSection() {
  const [status, setStatus] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied. Let’s connect!");
    } catch {
      setStatus(`Select and copy: ${email}`);
    }
  }
  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="wrap contact-inner">
        <div>
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2 id="contact-title">
            Let’s build
            <br />
            <span className="serif">what’s next.</span>{" "}
            <span className="contact-star" aria-hidden="true">
              ✳
            </span>
          </h2>
          <p>
            For React Native, full-stack opportunities, or a conversation about
            my move into DevOps — let’s connect.
          </p>
        </div>
        <div className="contact-links">
          <p className="contact-action-label">SEND ME AN EMAIL</p>
          <a className="contact-email" href={`mailto:${email}`}>
            {email} <span aria-hidden="true">↗</span>
          </a>
          <div className="contact-secondary">
            <a
              href="https://www.linkedin.com/in/ahlam-wani-2162831a7/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <button id="copy-email" type="button" onClick={copyEmail}>
              Copy email{" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="8" y="8" width="12" height="12" rx="2" />
                <path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4" />
              </svg>
            </button>
          </div>
          <p id="copy-status" className="copy-status" role="status">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
