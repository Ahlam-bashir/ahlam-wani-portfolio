export default function SkillsSection() {
  return (
    <section
      className="section wrap skills"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">03 / MY TOOLKIT</p>
          <h2 id="skills-title">
            Tools behind
            <br />
            <span className="serif">the thinking.</span>
          </h2>
        </div>
        <p className="section-intro">
          A foundation in building applications, with a growing focus on how
          they’re delivered and supported.
        </p>
      </div>
      <div className="skills-grid">
        <div className="skill-group">
          <span className="skill-no">01</span>
          <h3>Web &amp; mobile</h3>
          <p>Reusable interfaces and application experiences</p>
          <div className="skill-tags">
            <span>React.js</span>
            <span>React Native</span>
            <span>Next.js</span>
            <span>JavaScript</span>
            <span>TanStack Query</span>
            <span>Redux / Redux Toolkit</span>
            <span>Reusable components</span>
            <span>HTML &amp; CSS</span>
            <span>Tailwind CSS</span>
            <span>Kotlin</span>
          </div>
        </div>
        <div className="skill-group">
          <span className="skill-no">02</span>
          <h3>Backend &amp; data</h3>
          <p>Services, integrations, and persistence</p>
          <div className="skill-tags">
            <span>Node.js</span>
            <span>NestJS</span>
            <span>Express</span>
            <span>C# / .NET</span>
            <span>REST APIs</span>
            <span>MongoDB</span>
            <span>SQLite</span>
            <span>SQL</span>
          </div>
        </div>
        <div className="skill-group">
          <span className="skill-no">03</span>
          <h3>LMS &amp; learning</h3>
          <p>Courses, assessments, and learning workflows</p>
          <div className="skill-tags">
            <span>Admin panels</span>
            <span>Courses &amp; quizzes</span>
            <span>SCORM player</span>
            <span>StackQuotient</span>
            <span>Proctoring</span>
            <span>Real-time tracking</span>
            <span>Event scheduling</span>
            <span>Notifications</span>
            <span>Bookmarks</span>
          </div>
        </div>
        <div className="skill-group">
          <span className="skill-no">04</span>
          <h3>Delivery &amp; cloud</h3>
          <p>Working knowledge &amp; DevOps exposure</p>
          <div className="skill-tags">
            <span>Git &amp; GitHub</span>
            <span>CI/CD</span>
            <span>Docker</span>
            <span>Amazon ECS</span>
            <span>CloudWatch</span>
          </div>
          <div className="skill-foot">
            Alongside production troubleshooting, code reviews, and release
            support.
          </div>
        </div>
      </div>
    </section>
  );
}
