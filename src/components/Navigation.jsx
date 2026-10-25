import { useEffect, useRef, useState } from "react";

export default function Navigation({ progress, scrolled, current }) {
  const [open, setOpen] = useState(false);
  const nav = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    const dismiss = (event) => {
      if (!nav.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("click", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("click", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const links = [
    ["work", "Selected work"],
    ["experience", "Experience"],
    ["skills", "Toolkit"],
    ["contact", "Let’s connect"],
  ];
  return (
    <header className={`header${scrolled ? " is-scrolled" : ""}`}>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <nav className="nav wrap" aria-label="Main navigation" ref={nav}>
        <a className="wordmark" href="#home" aria-label="Ahlam Wani home">
          aw<span className="wordmark-dot">.</span>
        </a>
        <button
          className="menu-toggle"
          ref={toggle}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((value) => !value)}
        >
          <span>Menu</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <div className={`nav-links${open ? " open" : ""}`} id="nav-links">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={[
                id === "contact" && "nav-contact",
                current === id && "current",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={current === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              {id === "contact" && (
                <>
                  {" "}
                  <span aria-hidden="true">↗</span>
                </>
              )}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
