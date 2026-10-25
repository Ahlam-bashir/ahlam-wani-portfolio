import { useRef } from "react";
import { areas } from "../data/portfolio.js";
import CareerTimeline from "./CareerTimeline.jsx";

const tabs = [
  {
    id: "mobile",
    title: "Mobile development",
    subtitle: "React Native · iOS · Android",
    icon: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M10 5h4M10 19h4" />
      </>
    ),
  },
  {
    id: "fullstack",
    title: "Web & full-stack development",
    subtitle: "React.js · TanStack Query · APIs",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 9h20M6 6.5h.01M9 6.5h.01m0 7-3 2 3 2m6-4 3 2-3 2" />
      </>
    ),
  },
  {
    id: "lms",
    title: "LMS & learning platforms",
    subtitle: "Courses · Assessments · Proctoring",
    icon: <path d="m2 8 10-5 10 5-10 5L2 8Zm4 2v7c4 3 8 3 12 0v-7m4-2v9" />,
  },
  {
    id: "devops",
    title: "DevOps & cloud",
    subtitle: "Building on a developer foundation",
    icon: (
      <>
        <path d="M6 18a5 5 0 0 1-1-10 7 7 0 0 1 13-1 5.5 5.5 0 0 1 .5 11H6Z" />
        <path d="m9 13 3-3 3 3m-3-3v11" />
      </>
    ),
  },
];

export default function ExperienceExplorer({ active, onChange, onFilter }) {
  const buttons = useRef([]);
  const area = areas[active];
  function onKeyDown(event, index) {
    let next;
    if (["ArrowDown", "ArrowRight"].includes(event.key))
      next = (index + 1) % tabs.length;
    else if (["ArrowUp", "ArrowLeft"].includes(event.key))
      next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    onChange(tabs[next].id);
    buttons.current[next]?.focus();
  }
  return (
    <section
      className="section wrap experience"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / MY EXPERIENCE</p>
          <h2 id="experience-title">
            One developer.
            <br />
            <span className="serif">A few different lenses.</span>
          </h2>
        </div>
        <p className="section-intro">
          From a screen in your hand to the systems behind it. Choose an area to
          explore where I’ve worked and where I’m heading.
        </p>
      </div>
      <div className="experience-explorer">
        <div
          className="area-tabs"
          role="tablist"
          aria-label="Explore experience by area"
          aria-orientation="vertical"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              className={`area-tab${active === tab.id ? " active" : ""}`}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={active === tab.id}
              aria-controls="experience-panel"
              tabIndex={active === tab.id ? 0 : -1}
              data-area={tab.id}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="tab-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">{tab.icon}</svg>
              </span>
              <span>
                <strong>{tab.title}</strong>
                <small>{tab.subtitle}</small>
              </span>
              <span className="tab-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
        <div
          className="experience-panel"
          id="experience-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
        >
          <div className="panel-content" key={active}>
            <div className="panel-top">
              <span className="small-label" id="area-label">
                {area.label}
              </span>
              <span className="panel-number" id="area-number">
                {area.number}
              </span>
            </div>
            <h3 id="area-title">
              {area.title.split("\n").map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </h3>
            <p id="area-description">{area.description}</p>
            <div className="panel-tags" id="area-tags">
              {area.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="panel-context" id="area-context">
              {area.context}
            </div>
          </div>
          <a
            className="text-link"
            href={area.target}
            id="area-link"
            onClick={() => {
              if (area.filter) onFilter(area.filter);
            }}
          >
            {area.link} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <CareerTimeline />
    </section>
  );
}
