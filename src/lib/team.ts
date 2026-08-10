export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** one-line positioning statement */
  tagline: string;
  /** initials used by the avatar fallback */
  initials: string;
  /**
   * Path to a headshot under `public/` (e.g. "/team/jehnsen-enrique.jpg").
   * Omit it and the gradient monogram renders instead.
   */
  photo?: string;
  accent: string;
  /** short label pairs shown under the name */
  facts: { label: string; value: string }[];
  /** paragraphs of biography */
  bio: string[];
  /** what this person is accountable for day to day */
  focus: string[];
  expertise: string[];
  /**
   * Optional links. Left empty until real profiles are supplied — an empty
   * array simply renders nothing.
   */
  links: { label: string; href: string }[];
};

export const team: TeamMember[] = [
  {
    slug: "michael-manabat",
    name: "Michael Manabat",
    role: "Chief Executive Officer",
    tagline:
      "Decades of business analysis and project management in banking — translating operations into systems that hold up under scrutiny.",
    initials: "MM",
    photo: "/team/mc_manabat.jpg",
    accent: "var(--color-loop-500)",
    facts: [
      { label: "Role", value: "CEO" },
      { label: "Background", value: "Banking" },
      { label: "Discipline", value: "BA & project management" },
    ],
    bio: [
      "Michael has spent decades as a business analyst and project manager in the banking industry — an environment where a vague requirement or a missed dependency is not a bug ticket but a regulatory problem. That work is fundamentally about listening to how a business actually runs, separating what people say they do from what they do, and turning it into something a delivery team can build against.",
      "He leads 3rdLoop's discovery and consultancy work: mapping workflows, pinning down the one metric an engagement has to move, and writing the target-state architecture and roadmap clients take away at the end of week two. Banking taught him to be sceptical of scope that hasn't been interrogated, which is why our engagements start with a fixed-price discovery rather than a proposal.",
      "It also means the commercial conversation stays honest. Michael is the one who will tell a client that a feature they've budgeted for won't pay off, or that the timeline they want isn't the timeline they'll get.",
    ],
    focus: [
      "Client discovery and stakeholder interviews",
      "Operating model and workflow design",
      "Roadmaps, estimates and risk registers",
      "Commercial scope and engagement structure",
    ],
    expertise: [
      "Business analysis",
      "Project management",
      "Requirements engineering",
      "Banking & financial services",
      "Process mapping",
      "Stakeholder management",
    ],
    links: [],
  },
  {
    slug: "jehnsen-enrique",
    name: "Jehnsen Enrique",
    role: "Chief Technology Officer",
    tagline:
      "15+ years building software and API integrations, 2+ years in applied AI — the architecture and codebase behind every system we ship.",
    initials: "JE",
    photo: "/team/jehnsen-enrique.jpg",
    accent: "var(--color-flux-500)",
    facts: [
      { label: "Role", value: "CTO" },
      { label: "Engineering", value: "15+ years" },
      { label: "Applied AI", value: "2+ years" },
    ],
    bio: [
      "Jehnsen has been writing software professionally for over fifteen years, with a long specialism in API integration — the unglamorous work of making systems that were never designed to talk to each other exchange data reliably. That background shapes how 3rdLoop approaches automation: most of the value isn't in a new interface, it's in the plumbing underneath it that has to not fail at 2am.",
      "For the past two years he has worked as an applied AI engineer, building retrieval-augmented assistants and document-processing pipelines. His position on AI is deliberately unfashionable: it belongs in a system only where it beats a deterministic alternative, and it needs an evaluation harness before it goes near a customer. Several of our engagements have ended with us recommending a plain pipeline instead of a model.",
      "He owns the technical side end to end — architecture design, the codebase, code review, infrastructure and the engineering standards the team builds to. Every product in our catalogue runs on architecture he designed.",
    ],
    focus: [
      "System architecture and technical design",
      "Codebase ownership and code review",
      "API integration and data pipelines",
      "Applied AI: RAG, evaluation, guardrails",
      "Infrastructure, CI/CD and deployment",
    ],
    expertise: [
      "TypeScript",
      "React & Next.js",
      "Node.js",
      "Python",
      "API Integration",
      "Event-Driven Architecture",
      "Serverless Architecture",
      "Retrieval-Augmented Generation (RAG)",
      "Vector Embeddings",
      "LLM Evaluation &Guardrails",
      "API Governance & Security",
      "RDBMS & NoSQL",
      "Cloud Infrastructure",
    ],
    links: [],
  },
  {
    slug: "rosario-leido",
    name: "Rosario Leido",
    role: "Managing Partner",
    tagline:
      "Business Analyst/Product Manager/Business Strategy Lead",
    initials: "RL",
    photo: "/team/rose-leido.jpg",
    accent: "var(--color-loop-500)",
    facts: [
      { label: "Role", value: "Managing Partner" },
      { label: "Background", value: "Financial Business Operations, Commercial and Retail Banking Digital Transformation, Product Management" },
      { label: "Discipline", value: "Business Analyst/Product Manager/Business Strategy Lead" },
    ],
    bio: [
      `
      With over a decade of experience in Financial Business Operation, Commercial and Retail Banking Digital Transformation and product management.  Proven expertise in requirements analysis, system integration, regulatory compliance, and stakeholder collaboration across global financial institutions. 
      Specialized in translating complex business needs into technical solutions, driving digital products delivery, and ensuring seamless integration with core banking, risk, and reporting systems.
      `
    ],
    focus: [
      "Product Management",
      "Business Strategy and Analysis",
    ],
    expertise: [
      "Business Requirements Analysis",
      "Regulatory Compliance",
      "Stakeholder Collaboration",
      "System Integration",
      "Digital Transformation",
      "Product Delivery",
      "Core Banking Systems",
      "Risk and Reporting Systems",

    ],
    links: [],
  },
];

export function getTeamMember(slug: string) {
  return team.find((member) => member.slug === slug);
}

/** How we work as a pair — shown below the member cards. */
export const teamPrinciples = [
  {
    title: "Two people, no handoff gap",
    body: "The person who runs discovery and the person who designs the architecture are in the same conversation from week one. Nothing gets lost being translated between an advisory firm and a delivery shop.",
  },
  {
    title: "Senior people on the actual work",
    body: "You are not pitched by principals and then handed to juniors. The people you meet are the people who do the work — that's the direct consequence of staying small.",
  },
  {
    title: "Deliberately limited concurrency",
    body: "We cap how many engagements run at once. It costs us revenue and it's the reason we can say what our timelines actually are instead of what you want to hear.",
  },
];
