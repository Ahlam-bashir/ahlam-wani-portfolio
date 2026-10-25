export default function Footer({ motion }) {
  return (
    <footer className="wrap footer">
      <a className="wordmark" href="#home" aria-label="Back to top">
        aw<span className="wordmark-dot">.</span>
      </a>
      <p>
        © {new Date().getFullYear()} Ahlam Wani <span>·</span> Built with
        curiosity.
      </p>
      <a href="#home">
        Back to top <span aria-hidden="true">↑</span>
      </a>
      <button
        id="motion-toggle"
        className="motion-toggle"
        type="button"
        aria-pressed={!motion.enabled}
        disabled={motion.reduced}
        onClick={motion.toggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14M16 5v14" />
        </svg>
        <span>
          {motion.reduced
            ? "Reduced motion enabled"
            : motion.enabled
              ? "Pause motion"
              : "Enable motion"}
        </span>
      </button>
    </footer>
  );
}
