export const profileData = {
  name: "Putra Prassiesa Abimanyu",
  jobTitle: "Fullstack Developer",
  tagline: "Building digital gardens",
  bio: "Fullstack developer focused on resilient backends, thoughtful interfaces, and quietly fast experiences for the web.",
  tackStack: [
    "Golang",
    "Node.JS",
    "Javascript",
    "Typescript",
    "React",
    "Next.JS",
    "Nest.JS",
    "PortgreSQL",
    "MySQL",
    "SQLServer",
    "MonggoDB",
    "Redis",
    "Kafka",
    "Docker",
    "Kubernetes",
    "React Native",
  ],
  profileUrl: "https://avatars.githubusercontent.com/u/71804682?v=4",
  linkedIn: "https://www.linkedin.com/in/ppabimanyu/",
  github: "https://github.com/ppabimanyu",
  email: "ppabimanyu@gmail.com",
  location: "Jember, East Java, Indonesia",
};

export const projects = [
  {
    name: "Garden Notes",
    year: "2024",
    studyCase: "Personal project",
    description:
      "A personal knowlage garden with backlinks, daily notes, and simple search tunned for thinking in public.",
    content:
      "A digital garden is a collection of evolving notes, thoughts, and ideas, cultivated over time like a garden. Unlike a traditional blog where posts are static and chronological, a digital garden is interconnected, non-linear, and constantly growing. This project implements a personal knowledge management system inspired by Obsidian and Roam Research.\n\nIt features:\n- **Bi-directional linking**: Connect related ideas effortlessly.\n- **Daily notes**: Capture fleeting thoughts and tasks.\n- **Graph view**: Visualize the connections between your notes.\n- **Markdown support**: Write in a familiar and portable format.",
    stack: [
      "Next.JS",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn UI",
      "Prisma",
      "PostgreSQL",
    ],
    thumbnail: "/projects/garden-notes.png",
    links: {
      live: "https://garden-notes.vercel.app/",
      github: "https://github.com/ppabimanyu/garden-notes",
    },
  },
  {
    name: "TaskFlow Pro",
    year: "2023",
    studyCase: "SaaS",
    description:
      "A minimalist project management tool for small teams focusing on clarity and velocity.",
    content:
      "TaskFlow Pro simplifies project management by removing the clutter found in enterprise tools. It focuses on what matters: tasks, assignees, and deadlines. With a clean interface and real-time updates, teams can stay aligned without getting lost in complex configurations.\n\nKey features include:\n- **Kanban Boards**: Visualize workflow stages easily.\n- **Real-time Collaboration**: See updates instantly via WebSockets.\n- **Automated Reports**: Weekly summaries delivered to your inbox.",
    stack: ["React", "Redux", "Node.js", "Express", "MongoDB", "Socket.io"],
    thumbnail: "/projects/taskflow-pro.png",
    links: {
      live: "https://taskflow-pro.demo.app/",
      github: "https://github.com/ppabimanyu/taskflow-pro",
    },
  },
  {
    name: "DevDash",
    year: "2023",
    studyCase: "SaaS",
    description:
      "A customizable dashboard for developers to track GitHub issues, PRs, and deployment status.",
    content:
      "DevDash aggregates critical information from various developer tools into a single, customizable screen. Stop tab-switching between GitHub, Jira, and Jenkins. Configure widgets to show exactly what you need to see to start your day.\n\nHighlights:\n- **Widget System**: Drag and drop widgets for GitHub, GitLab, and CI/CD pipelines.\n- **Dark Mode**: First-class support for dark themes.\n- **OAuth Integration**: Securely connect to your third-party accounts.",
    stack: ["Vue.js", "Nuxt", "Firebase", "Tailwind CSS"],
    thumbnail: "/projects/devdash.png",
    links: {
      live: "https://devdash.vercel.app/",
      github: "https://github.com/ppabimanyu/devdash",
    },
  },
  {
    name: "EcoMarket",
    year: "2022",
    studyCase: "SaaS",
    description:
      "An e-commerce platform dedicated to sustainable and eco-friendly products.",
    content:
      "EcoMarket connects conscious consumers with small businesses selling sustainable goods. The platform features a robust product catalog, secure checkout, and a vendor portal for sellers to manage their inventory.\n\nFeatures:\n- **Vendor Dashboard**: Tools for sellers to track sales and analytics.\n- **Carbon Footprint Calculator**: Estimates the environmental impact of shipping.\n- **Stripe Integration**: Secure payment processing.",
    stack: ["Next.JS", "TypeScript", "PostgreSQL", "Prisma", "Stripe"],
    thumbnail: "/projects/ecomarket.png",
    links: {
      live: "https://ecomarket-demo.com/",
      github: "https://github.com/ppabimanyu/ecomarket",
    },
  },
  {
    name: "CodeSnippet CLI",
    year: "2022",
    studyCase: "SaaS",
    description:
      "A command-line tool to save, search, and paste code snippets directly from your terminal.",
    content:
      "For developers who live in the terminal, CodeSnippet CLI offers a fast way to manage reusable code blocks. Written in Go for performance, it allows you to sync snippets via Gist and access them with simple commands.\n\nCapabilities:\n- **Syntax Highlighting**: Beautiful terminal output.\n- **Fuzzy Search**: Find snippets even if you don't remember the exact name.\n- **Gist Sync**: Backup your snippets to GitHub Gists automatically.",
    stack: ["Golang", "Cobra", "SQLite"],
    thumbnail: "/projects/codesnippet-cli.png",
    links: {
      live: "https://crates.io/crates/codesnippet-cli",
      github: "https://github.com/ppabimanyu/codesnippet-cli",
    },
  },
  {
    name: "HealthTrack",
    year: "2021",
    studyCase: "Client work",
    description:
      "A mobile-first application for tracking workout routines and nutrition intake.",
    content:
      "HealthTrack helps users build healthy habits by logging their exercises and meals. It provides visualizations of progress over time and suggests workout adjustments based on performance.\n\nCore functionality:\n- **Exercise Library**: Over 500 exercises with instructions.\n- **Calorie Counter**: extensive database of foods.\n- **Progress Charts**: Visual graphs for weight, reps, and nutritional goals.",
    stack: ["React Native", "Expo", "Redux Toolkit", "Firebase"],
    thumbnail: "/projects/healthtrack.png",
    links: {
      live: "https://play.google.com/store/apps/details?id=com.healthtrack",
      github: "https://github.com/ppabimanyu/healthtrack",
    },
  },
];
