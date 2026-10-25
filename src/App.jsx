import { useRef, useState } from "react";
import { useMotion, useReveal, useScrollState } from "./hooks.js";
import Navigation from "./components/Navigation.jsx";
import Hero from "./components/Hero.jsx";
import DisciplineStrip from "./components/DisciplineStrip.jsx";
import ExperienceExplorer from "./components/ExperienceExplorer.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import ProjectDialog from "./components/ProjectDialog.jsx";
import SkillsSection from "./components/SkillsSection.jsx";
import DevOpsJourney from "./components/DevOpsJourney.jsx";
import AboutSection from "./components/AboutSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [area, setArea] = useState("mobile");
  const [filter, setFilter] = useState("all");
  const [project, setProject] = useState(null);
  const projectTrigger = useRef(null);
  const motion = useMotion();
  const scroll = useScrollState();
  useReveal(motion.enabled, filter);
  function openProject(id, trigger) {
    projectTrigger.current = trigger;
    setProject(id);
  }
  function exploreArea(id) {
    setArea(id);
    document.getElementById("experience-panel")?.focus({ preventScroll: true });
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation {...scroll} />
      <main id="main">
        <Hero onExplore={exploreArea} />
        <DisciplineStrip />
        <ExperienceExplorer
          active={area}
          onChange={setArea}
          onFilter={setFilter}
        />
        <ProjectsSection
          filter={filter}
          onFilter={setFilter}
          onOpen={openProject}
        />
        <SkillsSection />
        <DevOpsJourney />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer motion={motion} />
      <a
        className="floating-top"
        href="#home"
        aria-label="Back to top"
        hidden={!scroll.showTop}
      >
        <span aria-hidden="true">↑</span>
      </a>
      <ProjectDialog
        projectId={project}
        onClose={() => setProject(null)}
        triggerRef={projectTrigger}
      />
    </>
  );
}
