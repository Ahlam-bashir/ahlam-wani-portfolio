import { projectCards } from "../data/portfolio.js";
import ProjectArtwork from "./ProjectArtwork.jsx";

const filters = [
  ["all", "All projects"],
  ["mobile", "Mobile"],
  ["web", "Web"],
  ["learning", "LMS & learning"],
];

export default function ProjectsSection({ filter, onFilter, onOpen }) {
  const visible = projectCards.filter(
    (card) => filter === "all" || card.categories.includes(filter),
  );
  const label =
    { mobile: "mobile ", web: "web ", learning: "LMS & learning " }[filter] ??
    "";
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / SELECTED WORK</p>
            <h2 id="work-title">
              Ideas I’ve helped
              <br />
              <span className="serif">bring to life.</span>
            </h2>
          </div>
          <div className="work-heading-right">
            <p className="section-intro">
              Explore the projects by area. Open a project to see my role,
              contributions, and available app links.
            </p>
            <div
              className="filter-bar"
              role="group"
              aria-label="Filter projects"
            >
              {filters.map(([id, text]) => (
                <button
                  key={id}
                  className={`filter${filter === id ? " active" : ""}`}
                  aria-pressed={filter === id}
                  data-filter={id}
                  onClick={() => onFilter(id)}
                >
                  {text}
                  {id === "all" && (
                    <>
                      {" "}
                      <span>{projectCards.length}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="work-toolbar">
          <p aria-live="polite" id="project-count">
            Showing {filter === "all" ? "all " : ""}
            {visible.length} {label}projects
          </p>
          <span>
            <span aria-hidden="true">↗</span> Select a project to explore
          </span>
        </div>
        <div className="project-grid">
          {visible.map((card) => (
            <article
              className={`project-card${card.featured ? " project-featured" : ""}`}
              data-categories={card.categories.join(" ")}
              data-project={card.id}
              key={card.id}
            >
              <button
                className="project-open"
                data-open={card.id}
                aria-label={`View ${card.displayName} project details`}
                onClick={(event) => onOpen(card.id, event.currentTarget)}
              >
                <div className={`project-visual ${card.artClass}`}>
                  <span className="visual-label">{card.visualLabel}</span>
                  <ProjectArtwork id={card.id} />
                  <span className="visual-foot">{card.visualFoot}</span>
                  <span className="visual-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="project-info">
                  <div className="project-meta">
                    {card.meta.map((text) => (
                      <span key={text}>{text}</span>
                    ))}
                  </div>
                  <h3>
                    {card.displayName} <span aria-hidden="true">↗</span>
                  </h3>
                  <p>{card.shortSummary}</p>
                  {card.id === "niit" && (
                    <div className="niit-app-names">
                      <span className="niit-app-label">
                        MOBILE COUNTERPARTS
                      </span>
                      Suzuki STAR · P3 Sales Academy
                      <br />
                      Schneider Sales Academy · Digital Sales Tool
                    </div>
                  )}
                  <div className="project-tags">
                    {card.cardTags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <span className="detail-link">
                    {card.detailLink} <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
