import { useEffect, useRef } from "react";
import { projects } from "../data/portfolio.js";

export default function ProjectDialog({ projectId, onClose, triggerRef }) {
  const dialog = useRef(null);
  const project = projects[projectId];
  useEffect(() => {
    const node = dialog.current;
    if (!projectId) return;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [projectId, triggerRef]);
  const close = () => onClose();
  function onBackdrop(event) {
    if (event.target !== dialog.current) return;
    const bounds = dialog.current.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      close();
  }
  return (
    <dialog
      ref={dialog}
      id="project-dialog"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={onBackdrop}
    >
      {project && (
        <div className="dialog-inner">
          <button
            className="dialog-close"
            aria-label="Close project details"
            onClick={close}
          >
            <span aria-hidden="true">×</span>
          </button>
          <p className="eyebrow" id="dialog-category">
            {project.category}
          </p>
          <h2 id="dialog-title">{project.name}</h2>
          <p className="dialog-summary" id="dialog-summary">
            {project.summary}
          </p>
          <h3 id="dialog-role-heading">
            {project.contributionHeading ?? "My contribution"}
          </h3>
          <ul id="dialog-contributions">
            {project.contributions.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
          <div className="panel-tags" id="dialog-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {project.apps && (
            <section
              id="dialog-apps-section"
              aria-labelledby="dialog-apps-heading"
            >
              <h3 id="dialog-apps-heading">Explore the mobile counterparts</h3>
              <div id="dialog-apps" className="published-apps">
                {project.apps.map((app) => (
                  <a
                    key={app.url}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>{app.name}</strong>
                    <span>{app.summary}</span>
                    <small>View on Google Play ↗</small>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </section>
          )}
          <p className="dialog-note">
            Project summary based on my development experience. Illustrations on
            this site are conceptual, rather than product screenshots.
          </p>
          <button className="button button-dark dialog-done" onClick={close}>
            Back to selected work <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
    </dialog>
  );
}
