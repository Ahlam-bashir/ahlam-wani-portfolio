export const areas = {
  mobile: {
    number: "01",
    label: "DEVELOPMENT EXPERIENCE",
    title: "Useful apps.\nNative experiences.",
    description:
      "Building React Native applications across iOS and Android, with experience in native modules, API integration, payments, subscriptions, and state management.",
    tags: ["React Native", "Redux", "Native modules", "Kotlin"],
    context:
      "Project experience includes NIIT LMS apps through VAYUZ, alongside service booking, fitness tracking, and eCommerce.",
    link: "Explore mobile projects",
    target: "#work",
    filter: "mobile",
  },
  fullstack: {
    number: "02",
    label: "DEVELOPMENT EXPERIENCE",
    title: "Reusable interfaces.\nConnected platforms.",
    description:
      "Building React.js and Next.js applications, admin panels, and backend integrations with Node.js, NestJS, and C#/.NET. Using reusable components, TanStack Query, and REST APIs across web experiences.",
    tags: [
      "React.js / Next.js",
      "TanStack Query",
      "Reusable components",
      "REST APIs",
    ],
    context:
      "NIIT client work through VAYUZ includes LMS web applications and companion admin panels, alongside my mobile development work.",
    link: "Explore web projects",
    target: "#work",
    filter: "web",
  },
  lms: {
    number: "03",
    label: "LMS WEB & MOBILE EXPERIENCE",
    title: "Learning platforms.\nAcross web and mobile.",
    description:
      "Developed matching LMS web applications, admin panels, and mobile learning experiences for NIIT through VAYUZ Technologies.",
    tags: ["Courses & quizzes", "SCORM player", "StackQuotient", "Proctoring"],
    context:
      "Includes real-time tracking, meeting and event scheduling, notifications, and bookmarks.",
    link: "Explore LMS projects",
    target: "#work",
    filter: "learning",
  },
  devops: {
    number: "04",
    label: "TRANSITION & LEARNING",
    title: "A wider view\nof software delivery.",
    description:
      "Building on my development background with knowledge of CI/CD, Docker, Amazon ECS, and CloudWatch. My goal is to move into a junior DevOps or cloud engineering role.",
    tags: ["CI/CD", "Docker", "Amazon ECS", "CloudWatch"],
    context:
      "Learning next: GitHub Actions, ECR, Fargate, and Terraform. These are learning goals, rather than completed project claims.",
    link: "Explore my learning path",
    target: "#devops",
  },
};

export const projects = {
  niit: {
    name: "NIIT LMS Web and Admin Platforms",
    category: "WEB + ADMIN + MOBILE / NIIT CLIENT WORK",
    summary:
      "Built React.js LMS web applications and companion admin panels alongside mobile learning applications for NIIT, a client of VAYUZ Technologies.",
    contributionHeading: "My contributions",
    contributions: [
      "Developed LMS web applications and companion admin panels for NIIT through VAYUZ Technologies, alongside the corresponding mobile applications.",
      "Built reusable React.js components and integrated REST APIs using TanStack Query for data fetching.",
      "Implemented courses, quizzes, and SCORM player integration.",
      "Integrated StackQuotient assessments with proctoring and real-time tracking.",
      "Added meeting and event scheduling, notifications, and bookmarks.",
    ],
    tags: [
      "React.js",
      "TanStack Query",
      "REST APIs",
      "SCORM",
      "StackQuotient",
      "Admin panels",
    ],
    apps: [
      {
        name: "Suzuki STAR",
        summary: "Interactive learning programs and assessments.",
        url: "https://play.google.com/store/apps/details?id=com.niit.nsmc",
      },
      {
        name: "P3 Sales Academy",
        summary: "Course roleplay and learning activities.",
        url: "https://play.google.com/store/apps/details?id=com.niit.sesa",
      },
      {
        name: "Schneider Sales Academy",
        summary: "Scenario-based sales practice and feedback.",
        url: "https://play.google.com/store/apps/details?id=com.schneider.salesacademy",
      },
      {
        name: "Digital Sales Tool",
        summary: "Sales pitch practice through audio, video, and text.",
        url: "https://play.google.com/store/apps/details?id=com.niit.digitalcoach",
      },
    ],
  },
  carwazi: {
    name: "Carwazi",
    category: "MOBILE APP / CAR SERVICES",
    summary:
      "A mobile application for car services, including cleaning, repairs, and bookings.",
    contributions: [
      "Developed online and offline booking features for car services.",
      "Integrated Facebook and Google sign-in, Stripe payments, and real-time chat between customers and service providers.",
      "Implemented multilingual support with SQLite for local storage of translated content.",
    ],
    tags: [
      "Service booking",
      "Authentication",
      "Stripe",
      "SQLite",
      "Real-time chat",
    ],
  },
  fitindian: {
    name: "FitIndian",
    category: "REACT NATIVE / HEALTH & FITNESS",
    summary:
      "A React Native fitness application for health tracking, diet plans, and communication with nutritionists.",
    contributions: [
      "Built BMI, daily water intake, and food intake tracking features.",
      "Implemented diet plan tracking, dashboards, and chat with nutritionists.",
      "Integrated StoreKit subscriptions on iOS and Razorpay subscription flows on Android.",
    ],
    tags: [
      "React Native",
      "Health tracking",
      "StoreKit",
      "Razorpay",
      "Subscriptions",
    ],
  },
  academy: {
    name: "Eureka Forbes Academy",
    category: "WEB + MOBILE / LEARNING & ASSESSMENT",
    summary:
      "An education platform for sales personnel to access courses and assessments across web and mobile.",
    contributions: [
      "Built the web platform using React and connected it to a mobile app through React Native WebView.",
      "Used Redux to manage application state.",
      "Integrated assessment tools and push notifications for course and assessment reminders.",
    ],
    tags: [
      "React",
      "React Native WebView",
      "Redux",
      "Assessments",
      "Push notifications",
    ],
  },
  genai: {
    name: "Gen AI Web App",
    category: "NEXT.JS / AI CONVERSATION PRACTICE",
    summary:
      "A web application for customers and sales personnel to practice client conversations through audio input.",
    contributions: [
      "Developed a Next.js application with AI-generated conversational responses and feedback.",
      "Worked on audio input, conversation analysis, ratings, and performance insights.",
      "Used React and Redux for state management, alongside custom prompts for contextual responses.",
    ],
    tags: ["Next.js", "React", "Redux", "Audio input", "AI integration"],
  },
};

export const steps = {
  github: {
    status: "FOUNDATION & EXPOSURE",
    title: "Start with the source.",
    description:
      "Git-based workflows and GitHub are part of my development background, alongside pull request reviews and collaborative delivery.",
  },
  actions: {
    status: "LEARNING FOCUS",
    title: "Automate the delivery steps.",
    description:
      "My next focus is GitHub Actions: connecting source changes to automated checks, builds, and deployment workflows. My CI/CD knowledge provides a starting point.",
  },
  docker: {
    status: "FOUNDATION & EXPOSURE",
    title: "Understand the container.",
    description:
      "Docker and container concepts are part of my DevOps foundation. I’m continuing to connect that knowledge with repeatable application delivery.",
  },
  ecr: {
    status: "LEARNING FOCUS",
    title: "Give images a home.",
    description:
      "Amazon ECR is on my learning path: understanding how container images are stored and made available to an AWS deployment workflow.",
  },
  ecs: {
    status: "ECS FOUNDATION · FARGATE LEARNING FOCUS",
    title: "Connect containers to the cloud.",
    description:
      "I have knowledge of Amazon ECS. I’m expanding that foundation toward ECS on Fargate and the steps involved in delivering containerized applications.",
  },
  cloudwatch: {
    status: "FOUNDATION & EXPOSURE",
    title: "See how applications behave.",
    description:
      "CloudWatch monitoring and logging are part of my current cloud knowledge, building on my experience troubleshooting application issues and supporting releases.",
  },
  terraform: {
    status: "LEARNING FOCUS",
    title: "Describe the infrastructure.",
    description:
      "Terraform is a future learning focus: understanding infrastructure as code and how version-controlled definitions can support repeatable cloud environments.",
  },
};

export const projectCards = [
  {
    id: "niit",
    categories: ["mobile", "web", "learning"],
    featured: true,
    artClass: "niit-art",
    visualLabel: "WEB + MOBILE / NIIT VIA VAYUZ",
    visualFoot: "Courses · Assessments · Tracking",
    meta: ["WEB + ADMIN + MOBILE", "NIIT · via VAYUZ"],
    displayName: "NIIT LMS web & admin platforms",
    shortSummary:
      "Built React.js LMS web applications and companion admin panels alongside the mobile learning apps for NIIT, a VAYUZ client.",
    cardTags: ["React.js", "TanStack Query", "SCORM", "Admin panels"],
    detailLink: "Explore the platform & my role",
  },
  {
    id: "carwazi",
    categories: ["mobile"],
    featured: false,
    artClass: "carwazi-art",
    visualLabel: "MOBILE / SERVICE BOOKING",
    visualFoot: "Booking · Payments · Connection",
    meta: ["01 / MOBILE APP", "Car services"],
    displayName: "Carwazi",
    shortSummary:
      "Connecting car owners with services, bookings, and in-app communication.",
    cardTags: ["Bookings", "Stripe", "SQLite"],
    detailLink: "Explore project",
  },
  {
    id: "fitindian",
    categories: ["mobile"],
    featured: false,
    artClass: "fit-art",
    visualLabel: "MOBILE / HEALTH & FITNESS",
    visualFoot: "Daily habits. Connected care.",
    meta: ["02 / MOBILE APP", "Health & fitness"],
    displayName: "FitIndian",
    shortSummary:
      "A React Native fitness app for daily health tracking, diet plans, and nutritionist chat.",
    cardTags: ["React Native", "StoreKit", "Razorpay"],
    detailLink: "Explore project",
  },
  {
    id: "academy",
    categories: ["mobile", "web", "learning"],
    featured: false,
    artClass: "academy-art",
    visualLabel: "WEB + MOBILE / LEARNING",
    visualFoot: "Learn. Practice. Keep growing.",
    meta: ["03 / WEB + MOBILE", "Learning & assessment"],
    displayName: "Eureka Forbes Academy",
    shortSummary:
      "A React learning platform connected to mobile through React Native WebView.",
    cardTags: ["React", "WebView", "Redux"],
    detailLink: "Explore project",
  },
  {
    id: "genai",
    categories: ["web"],
    featured: false,
    artClass: "ai-art",
    visualLabel: "WEB / CONVERSATIONAL AI",
    visualFoot: "Conversation, with a feedback loop.",
    meta: ["04 / WEB APP", "AI conversation practice"],
    displayName: "Gen AI Web App",
    shortSummary:
      "Audio-led conversation practice with AI responses, feedback, and performance insights.",
    cardTags: ["Next.js", "React", "Redux"],
    detailLink: "Explore project",
  },
];
