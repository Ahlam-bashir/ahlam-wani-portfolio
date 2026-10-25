import { useState } from "react";
import { steps } from "../data/portfolio.js";

const path = [
  ["github", "GitHub", true],
  ["actions", "GitHub Actions", false],
  ["docker", "Docker", true],
  ["ecr", "Amazon ECR", false],
  ["ecs", "ECS / Fargate", false],
  ["cloudwatch", "CloudWatch", true],
  ["terraform", "Terraform", false],
];

export default function DevOpsJourney() {
  const [active, setActive] = useState("github");
  const step = steps[active];
  const position = path.findIndex(([id]) => id === active) + 1;
  return (
    <section
      className="journey-section"
      id="devops"
      aria-labelledby="journey-title"
    >
      <div className="wrap journey-inner">
        <div className="journey-intro">
          <p className="eyebrow">04 / THE NEXT CHAPTER</p>
          <h2 id="journey-title">
            Building apps.
            <br />
            <span className="serif">
              Learning what
              <br />
              keeps them running.
            </span>
          </h2>
          <p>
            I’m transitioning toward junior DevOps and cloud roles, bringing
            application development experience to a more complete understanding
            of software delivery.
          </p>
          <div className="journey-legend">
            <span>
              <i className="foundation-dot" /> Foundation & exposure
            </span>
            <span>
              <i className="learning-dot" /> Learning focus
            </span>
          </div>
        </div>
        <div className="journey-interactive">
          <p className="small-label">
            MY LEARNING PATH{" "}
            <span id="path-position">
              STEP {String(position).padStart(2, "0")} / 07
            </span>
          </p>
          <div
            className="path-steps"
            role="group"
            aria-label="Explore DevOps learning path"
          >
            {path.map(([id, label, foundation], index) => (
              <button
                key={id}
                className={`path-step${active === id ? " active" : ""}`}
                data-step={id}
                aria-pressed={active === id}
                onClick={() => setActive(id)}
              >
                <span className="step-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{label}</span>
                <i className={foundation ? "foundation-dot" : "learning-dot"} />
              </button>
            ))}
          </div>
          <div className="path-position-track" aria-hidden="true">
            <span
              id="path-position-bar"
              style={{ width: `${(position / path.length) * 100}%` }}
            />
          </div>
          <div className="path-detail" aria-live="polite" aria-atomic="true">
            <div key={active} className="path-content">
              <span className="small-label" id="path-status">
                {step.status}
              </span>
              <h3 id="path-title">{step.title}</h3>
              <p id="path-description">{step.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
