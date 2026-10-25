import React, { useEffect, useState } from "react";

const repo =
  "https://github.com/Ahlam-bashir/ahlam-wani-portfolio/tree/main/devops-lab";
const lessons = [
  {
    id: "source",
    number: "01",
    title: "Start with the source",
    tool: "Git & GitHub",
    task: "Create a branch, change the app version, run tests, and open a pull request.",
    commands: [
      "git switch -c practice/my-first-release",
      "npm test",
      "npm run build",
    ],
    proof:
      "Save the pull request URL and explain why a failing check should block a release.",
  },
  {
    id: "ci",
    number: "02",
    title: "Let the checks do the work",
    tool: "GitHub Actions",
    task: "Push a deliberate failing assertion. Find the failed CI step, fix it, and watch the next run.",
    commands: [
      "npm test",
      "git add .",
      'git commit -m "Practice CI feedback"',
      "git push -u origin HEAD",
    ],
    proof:
      "Record one failed and one passing Actions run. Explain the trigger, job, runner, and step.",
  },
  {
    id: "container",
    number: "03",
    title: "Package a repeatable runtime",
    tool: "Docker",
    task: "Build the multi-stage image and run it with Compose. Compare readiness with liveness.",
    commands: [
      "docker compose up --build -d",
      "docker compose ps",
      "docker compose logs -f app",
    ],
    proof:
      "Capture the healthy container and describe USER, HEALTHCHECK, and the build/runtime stages.",
  },
  {
    id: "registry",
    number: "04",
    title: "Give the image an address",
    tool: "Amazon ECR",
    task: "After AWS setup, use the manual deployment workflow to push a commit-tagged image.",
    commands: [
      "aws ecr describe-images --repository-name learnops --region ap-south-1",
    ],
    proof:
      "Record the image tag and digest. Explain why the pipeline does not deploy a mutable latest tag.",
  },
  {
    id: "delivery",
    number: "05",
    title: "Deliver a healthy service",
    tool: "ECS / Fargate",
    task: "Review a Terraform plan, then opt into a deployment. Inspect the task, service, and target health.",
    commands: [
      "terraform -chdir=infra/app plan",
      "aws ecs describe-services --cluster learnops --services learnops --region ap-south-1",
    ],
    proof:
      "Save your reviewed plan and the running task version. Cloud exercises create billable resources.",
  },
  {
    id: "observe",
    number: "06",
    title: "Read what the system tells you",
    tool: "CloudWatch",
    task: "Find a structured request log by requestId. Inspect CPU, memory, and ALB target health.",
    commands: ["aws logs tail /ecs/learnops --since 10m --region ap-south-1"],
    proof:
      "Write a short incident note with the symptom, evidence, cause, recovery, and prevention.",
  },
  {
    id: "infra",
    number: "07",
    title: "Make infrastructure repeatable",
    tool: "Terraform",
    task: "Run the mocked infrastructure tests. Inspect drift with a plan, then follow the cleanup guide.",
    commands: [
      "terraform -chdir=infra/app init -backend=false",
      "terraform -chdir=infra/app test",
      "terraform -chdir=infra/app fmt -check",
    ],
    proof:
      "Explain state locking and save a destroy-plan review. Mock tests do not provision AWS resources.",
  },
];
const incidents = [
  {
    title: "Readiness is failing",
    subtitle: "The process is alive, but it cannot take traffic.",
    steps: [
      "Open the Overview and start the local readiness drill.",
      "Send a test request: it should return 503. Liveness should stay 200.",
      "Inspect the JSON request log, then restore readiness.",
      "With Compose, inspect unhealthy status; Compose does not restart a container just because its health check fails.",
    ],
    commands: [
      "curl -i http://localhost:3000/health/live",
      "curl -i http://localhost:3000/health/ready",
      "docker compose logs --tail=30 app",
    ],
  },
  {
    title: "A release needs a rollback",
    subtitle:
      "Redeploy a known image through the same infrastructure workflow.",
    steps: [
      "Record the current working commit-tagged ECR image.",
      "Review docs/runbooks.md before attempting an AWS failure drill.",
      "Run the manual deploy workflow with the previous image tag.",
      "Verify the reported commit and readiness. The ECS circuit breaker needs a previously completed deployment to roll back automatically.",
    ],
    commands: [
      "aws ecs describe-services --cluster learnops --services learnops --region ap-south-1",
      "aws ecr describe-images --repository-name learnops --region ap-south-1",
    ],
  },
  {
    title: "The service is not reachable",
    subtitle: "Trace the request from your IP to the container.",
    steps: [
      "Confirm your current public IPv4 address matches the allowed CIDR.",
      "Check the ALB listener and target health.",
      "Check the task security group: only the ALB security group can reach port 3000.",
      "Read task startup logs and confirm the container listens on 0.0.0.0.",
    ],
    commands: [
      "aws logs tail /ecs/learnops --since 10m --region ap-south-1",
      "terraform -chdir=infra/app output",
    ],
  },
];

function Icon({ type = "terminal", size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === "terminal" ? (
        <path d="m5 6 6 6-6 6m9 0h5" />
      ) : type === "grid" ? (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      ) : type === "path" ? (
        <>
          <circle cx="6" cy="5" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="M6 7v7a5 5 0 0 0 5 5h5M9 5h8a4 4 0 0 1 0 8H7" />
        </>
      ) : type === "book" ? (
        <>
          <path d="M12 6c-3-3-8-2-9-1v15c4-2 7-1 9 1 2-2 5-3 9-1V5c-1-1-6-2-9 1Z" />
          <path d="M12 6v15" />
        </>
      ) : type === "arrow" ? (
        <path d="M5 19 19 5M5 5h14v14" />
      ) : type === "pulse" ? (
        <path d="M2 12h5l3-8 4 16 3-8h5" />
      ) : type === "shield" ? (
        <>
          <path d="m12 3 8 3v6c0 4-5 8-8 9-3-1-8-5-8-9V6l8-3Z" />
          <path d="m8 12 3 3 5-6" />
        </>
      ) : type === "refresh" ? (
        <>
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1" />
        </>
      ) : (
        <path d="m6 12 4 4 8-8" />
      )}
    </svg>
  );
}
function Badge({ children, tone = "" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
function formatUptime(value) {
  if (value == null) return "—";
  const minutes = Math.floor(value / 60);
  return minutes ? `${minutes}m ${value % 60}s` : `${value}s`;
}
async function api(path, options) {
  const response = await fetch(path, {
    ...options,
    signal: AbortSignal.timeout(5000),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? `HTTP ${response.status}`);
  return body;
}
function Commands({ lines }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="commands">
      <div>
        <span>TERMINAL</span>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(lines.join("\n"));
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        {lines.map((line) => (
          <code key={line}>
            <span>$ </span>
            {line}
            {"\n"}
          </code>
        ))}
      </pre>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("overview");
  const [status, setStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [connected, setConnected] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [lesson, setLesson] = useState(0);
  const [incident, setIncident] = useState(0);
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("learnops-practice") ?? "[]",
      ).filter((id) => lessons.some((item) => item.id === id));
    } catch {
      return [];
    }
  });
  async function refresh() {
    try {
      const [nextStatus, nextMetrics] = await Promise.all([
        api("/api/status"),
        api("/api/metrics"),
      ]);
      setStatus(nextStatus);
      setMetrics(nextMetrics);
      setConnected(true);
      setUpdated(new Date());
    } catch {
      setConnected(false);
    }
  }
  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("learnops-practice", JSON.stringify(completed));
    } catch {}
  }, [completed]);
  async function probe() {
    setBusy(true);
    try {
      const response = await fetch("/api/probe", {
        method: "POST",
        signal: AbortSignal.timeout(5000),
      });
      const body = await response.json();
      setMessage(
        `${response.status} · ${body.message ?? body.error} · request ${body.requestId.slice(0, 8)}`,
      );
    } catch {
      setMessage("Service unreachable. Check the API process and its logs.");
    } finally {
      await refresh();
      setBusy(false);
    }
  }
  async function drill(degraded) {
    setBusy(true);
    try {
      await api("/api/drills/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ degraded }),
      });
      setMessage(
        degraded
          ? "Readiness drill started. Send a test request and inspect the response."
          : "Readiness restored. Send another test request to confirm recovery.",
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      await refresh();
      setBusy(false);
    }
  }
  function markPracticed() {
    const id = lessons[lesson].id;
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }
  const healthy = connected && status?.ready;
  const count = completed.length;
  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <a
          href="#"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            setView("overview");
          }}
        >
          <span>
            <Icon />
          </span>
          learnops<span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">AHLAM WANI / DEVOPS LAB</div>
        <nav aria-label="Workspace">
          {[
            ["overview", "Overview", "grid"],
            ["practice", "Practice path", "path"],
            ["runbook", "Incident runbook", "book"],
          ].map(([id, label, icon]) => (
            <button
              key={id}
              className={view === id ? "nav-item active" : "nav-item"}
              aria-current={view === id ? "page" : undefined}
              onClick={() => setView(id)}
            >
              <Icon type={icon} />
              {label}
              {id === "practice" && <small>{count}/7</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="learning-note">
            <span className="tiny-square" /> A SPACE TO LEARN
            <p>
              Build the system.
              <br />
              Understand the tradeoffs.
            </p>
          </div>
          <a href={repo} target="_blank" rel="noreferrer">
            View project on GitHub <Icon type="arrow" size={15} />
          </a>
          <div className="profile">
            <span>AW</span>
            <div>
              Ahlam Wani<small>Developer → DevOps</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div>
            WORKSPACE <span>/</span>{" "}
            <strong>
              {view === "overview"
                ? "Release console"
                : view === "practice"
                  ? "Practice path"
                  : "Incident runbook"}
            </strong>
          </div>
          <div className="topbar-right">
            <span className={`connection-dot ${connected ? "on" : ""}`} />
            {connected ? "API connected" : "API offline"}
            <Badge>{status?.environment ?? "local lab"}</Badge>
          </div>
        </header>
        <main id="main">
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                <span /> RELEASE & RELIABILITY LAB
              </p>
              <h1>
                {view === "overview" ? (
                  <>
                    A little closer to <em>production.</em>
                  </>
                ) : view === "practice" ? (
                  <>
                    Learn it by <em>shipping it.</em>
                  </>
                ) : (
                  <>
                    Break it. Trace it. <em>Recover it.</em>
                  </>
                )}
              </h1>
              <p>
                {view === "overview"
                  ? "Your application. Your pipeline. A practical place to learn how software gets delivered and stays healthy."
                  : view === "practice"
                    ? "Seven connected exercises, from a commit to an observable cloud service. Take one small, verifiable step at a time."
                    : "Follow the evidence, make one change, and verify the recovery. These scenarios are practice exercises."}
              </p>
            </div>
            <span className="lab-version">
              LAB 01 <span>↗</span>
            </span>
          </div>
          {view === "overview" ? (
            <>
              <section
                className={`health-banner ${healthy ? "healthy" : "degraded"}`}
                aria-label="Service status"
              >
                <div className="health-icon">
                  <Icon type="pulse" size={25} />
                </div>
                <div>
                  <h2>
                    {!connected
                      ? "Connect your local service"
                      : healthy
                        ? "Ready to take the next request"
                        : "Readiness drill in progress"}
                  </h2>
                  <p>
                    {!connected
                      ? "Run npm run dev to start the API and dashboard."
                      : healthy
                        ? "The process is alive and its readiness check is passing."
                        : "The process is alive. Readiness is failing, so test requests return 503."}
                  </p>
                </div>
                <button className="quiet-button" onClick={refresh}>
                  <Icon type="refresh" size={15} /> Refresh
                </button>
              </section>
              <div className="section-line">
                <h2>Service at a glance</h2>
                <span>
                  {updated
                    ? `${connected ? "Updated" : "Last known"} ${updated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                    : "Waiting for first response"}{" "}
                  · polls every 5s
                </span>
              </div>
              <section className="metric-grid" aria-label="Process metrics">
                <div className="metric">
                  <p>
                    PROCESS UPTIME <Icon type="pulse" size={15} />
                  </p>
                  <strong>{formatUptime(status?.uptimeSeconds)}</strong>
                  <small>Resets when the process restarts</small>
                </div>
                <div className="metric">
                  <p>
                    TEST REQUESTS <span>↗</span>
                  </p>
                  <strong>{metrics?.probeRequests ?? "—"}</strong>
                  <small>
                    {metrics?.probeErrors ?? 0} failed · probes you generate
                  </small>
                </div>
                <div className="metric">
                  <p>
                    P95 RESPONSE <span>◴</span>
                  </p>
                  <strong>
                    {metrics?.p95LatencyMs == null ? "—" : metrics.p95LatencyMs}
                    <span>{metrics?.p95LatencyMs != null ? "ms" : ""}</span>
                  </strong>
                  <small>
                    Last {metrics?.sampleWindow ?? 0} test requests, max 100
                  </small>
                </div>
                <div className="metric">
                  <p>
                    DEPLOYED VERSION <span>⌘</span>
                  </p>
                  <strong className="version-value">
                    {status ? `v${status.version}` : "—"}
                  </strong>
                  <small>
                    Commit {status?.commit?.slice(0, 8) ?? "not connected"}
                  </small>
                </div>
              </section>
              <div className="overview-grid">
                <section className="panel traffic-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="panel-kicker">01 / REQUEST LAB</span>
                      <h2>See the response. Read the signal.</h2>
                    </div>
                    <Badge tone={healthy ? "green" : "amber"}>
                      {healthy ? "Ready" : "Not ready"}
                    </Badge>
                  </div>
                  <div className="endpoint">
                    <span>POST</span>
                    <code>/api/probe</code>
                    <button
                      className="primary-button"
                      disabled={busy || !connected}
                      onClick={probe}
                    >
                      Send request <span>↗</span>
                    </button>
                  </div>
                  <p className="response-message" role="status">
                    {message ||
                      "Send a request to generate real metrics and a structured server log."}
                  </p>
                  <div className="health-checks">
                    <div>
                      <span
                        className={`check-dot ${connected ? "good" : ""}`}
                      />
                      <div>
                        Liveness<code>/health/live</code>
                      </div>
                      <strong>{connected ? "200" : "—"}</strong>
                    </div>
                    <div>
                      <span className={`check-dot ${healthy ? "good" : ""}`} />
                      <div>
                        Readiness<code>/health/ready</code>
                      </div>
                      <strong>
                        {connected ? (healthy ? "200" : "503") : "—"}
                      </strong>
                    </div>
                  </div>
                  <p className="panel-footnote">
                    Metrics describe this Node.js process. They are not AWS or
                    CloudWatch telemetry.
                  </p>
                </section>
                <section className="panel drill-panel">
                  <span className="panel-kicker">
                    02 / A SMALL FAILURE, ON PURPOSE
                  </span>
                  <div className="drill-art" aria-hidden="true">
                    <span />
                    <Icon type="shield" size={38} />
                    <span />
                  </div>
                  <h2>Practice the recovery.</h2>
                  <p>
                    Disable readiness, observe a 503, then bring the service
                    back. Liveness keeps passing.
                  </p>
                  <button
                    className={healthy ? "secondary-button" : "primary-button"}
                    disabled={busy || !connected || !status?.drillsEnabled}
                    onClick={() => drill(Boolean(status?.ready))}
                  >
                    {status?.ready
                      ? "Start readiness drill"
                      : "Restore readiness"}{" "}
                    <span>↗</span>
                  </button>
                  <small>
                    {status?.drillsEnabled
                      ? "Local learning mode · no data is deleted"
                      : "Drills disabled · enabled only in local practice by default"}
                  </small>
                </section>
              </div>
              <section className="pipeline-panel">
                <div className="section-line">
                  <div>
                    <p className="panel-kicker">03 / THE DELIVERY BLUEPRINT</p>
                    <h2>One commit. A connected journey.</h2>
                  </div>
                  <Badge>Architecture · AWS not connected</Badge>
                </div>
                <div className="pipeline">
                  {[
                    ["01", "GitHub", "Source"],
                    ["02", "Actions", "Test & build"],
                    ["03", "ECR", "Image registry"],
                    ["04", "ECS / Fargate", "Run container"],
                    ["05", "CloudWatch", "Observe"],
                  ].map(([n, name, detail], index) => (
                    <React.Fragment key={name}>
                      <div>
                        <span>{n}</span>
                        <strong>{name}</strong>
                        <small>{detail}</small>
                      </div>
                      {index < 4 && <i aria-hidden="true">→</i>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="pipeline-footer">
                  <span>
                    <Icon type="shield" size={14} /> Terraform defines the
                    infrastructure. OIDC connects Actions to AWS.
                  </span>
                  <button onClick={() => setView("practice")}>
                    Explore the practice path <span>↗</span>
                  </button>
                </div>
              </section>
              <div className="bottom-grid">
                <section className="panel event-panel">
                  <div className="section-line">
                    <h2>Process events</h2>
                    <span>{metrics?.events?.length ?? 0} RECENT</span>
                  </div>
                  {metrics?.events?.length ? (
                    <ul>
                      {metrics.events.slice(0, 4).map((event) => (
                        <li key={event.id}>
                          <span
                            className={`event-dot ${event.type === "drill_started" ? "amber" : ""}`}
                          />
                          <div>
                            {event.message}
                            <small>
                              {new Date(event.at).toLocaleTimeString()} ·{" "}
                              {event.type}
                            </small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-note">
                      Events appear when the process starts or you run a drill.
                    </p>
                  )}
                </section>
                <section className="next-panel">
                  <span className="panel-kicker">YOUR NEXT SMALL STEP</span>
                  <h2>
                    {lessons.find((item) => !completed.includes(item.id))
                      ?.title ?? "Write down what you learned."}
                  </h2>
                  <p>
                    {count}/7 exercises marked practiced on this browser. Your
                    checklist is a personal learning record.
                  </p>
                  <button
                    onClick={() => {
                      setLesson(
                        Math.max(
                          0,
                          lessons.findIndex(
                            (item) => !completed.includes(item.id),
                          ),
                        ),
                      );
                      setView("practice");
                    }}
                  >
                    Continue learning <span>↗</span>
                  </button>
                </section>
              </div>
            </>
          ) : view === "practice" ? (
            <section className="practice-layout">
              <div className="lesson-list">
                <div className="learning-progress">
                  <span>YOUR PRACTICE LOG</span>
                  <strong>
                    {count}
                    <small>/7</small>
                  </strong>
                  <div>
                    <span style={{ width: `${(count / 7) * 100}%` }} />
                  </div>
                  <p>Manually marked. Saved in this browser.</p>
                </div>
                {lessons.map((item, index) => (
                  <button
                    key={item.id}
                    className={`lesson-tab ${lesson === index ? "active" : ""}`}
                    aria-pressed={lesson === index}
                    onClick={() => setLesson(index)}
                  >
                    <span>
                      {completed.includes(item.id) ? "✓" : item.number}
                    </span>
                    <div>
                      {item.tool}
                      <small>{item.title}</small>
                    </div>
                    <span>↗</span>
                  </button>
                ))}
              </div>
              <div className="panel lesson-detail" key={lessons[lesson].id}>
                <span className="panel-kicker">
                  EXERCISE {lessons[lesson].number} / 07
                </span>
                <h2>{lessons[lesson].title}</h2>
                <Badge tone="green">{lessons[lesson].tool}</Badge>
                <h3>Your task</h3>
                <p>{lessons[lesson].task}</p>
                <Commands lines={lessons[lesson].commands} />
                <h3>What to capture</h3>
                <p>{lessons[lesson].proof}</p>
                <div className="lesson-note">
                  <Icon type="book" />
                  <p>
                    Commands run from <code>devops-lab/</code>. AWS exercises
                    require the setup in{" "}
                    <a
                      href="https://github.com/Ahlam-bashir/ahlam-wani-portfolio/blob/main/devops-lab/docs/aws-setup.md"
                      target="_blank"
                      rel="noreferrer"
                    >
                      docs/aws-setup.md ↗
                    </a>
                    .
                  </p>
                </div>
                <button className="primary-button" onClick={markPracticed}>
                  {completed.includes(lessons[lesson].id)
                    ? "Marked practiced · undo"
                    : "Mark as practiced"}{" "}
                  <Icon type="check" size={16} />
                </button>
              </div>
            </section>
          ) : (
            <section className="runbook-layout">
              <div className="incident-list">
                {incidents.map((item, index) => (
                  <button
                    key={item.title}
                    className={incident === index ? "active" : ""}
                    aria-pressed={incident === index}
                    onClick={() => setIncident(index)}
                  >
                    <span>0{index + 1}</span>
                    <div>
                      {item.title}
                      <small>{item.subtitle}</small>
                    </div>
                    <span>↗</span>
                  </button>
                ))}
              </div>
              <div className="panel incident-detail">
                <span className="panel-kicker">A GUIDED INVESTIGATION</span>
                <h2>{incidents[incident].title}</h2>
                <p>{incidents[incident].subtitle}</p>
                <ol>
                  {incidents[incident].steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <Commands lines={incidents[incident].commands} />
                <div className="incident-template">
                  <span className="panel-kicker">
                    WRITE YOUR OWN INCIDENT NOTE
                  </span>
                  <p>Symptom → Evidence → Cause → Recovery → Prevention</p>
                  <small>
                    Use docs/incident-template.md to record what actually
                    happened.
                  </small>
                </div>
              </div>
            </section>
          )}
          <footer>
            <span>
              LearnOps <span>·</span> Built to be understood.
            </span>
            <span>
              React + Node.js <span>·</span> Ahlam Wani
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
