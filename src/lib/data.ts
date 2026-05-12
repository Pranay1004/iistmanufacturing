export type PersonType = "faculty" | "student" | "phd";
export type Availability = "Open to roles" | "Open to internships" | "Research focused" | "Joining soon";

export type Project = {
  title: string;
  summary: string;
  status: "Concept" | "Ongoing" | "Completed";
};

export type Person = {
  slug: string;
  type: PersonType;
  name: string;
  role: string;
  batch?: string;
  cohort?: "2024-2026" | "2025-2027" | "2026-2028";
  specialization: string;
  officialEmail: string;
  personalEmail?: string;
  portfolio?: string;
  linkedin?: string;
  supervisor?: string;
  location?: string;
  availability: Availability;
  synopsis: string;
  skills: string[];
  skillGroups: Record<string, string[]>;
  projects: Project[];
  courses?: string[];
  researchInterests?: string[];
  seekingRoles?: string[];
  resumeUrl?: string;
  canApprove?: boolean;
  isAdmin?: boolean;
  sourceUrl?: string;
  admissionYear?: string;
  mode?: "Regular" | "Sponsored";
};

export const programHighlights = [
  "Advanced manufacturing for aerospace and space applications",
  "Hands-on exposure to materials testing, characterization, and process equipment",
  "Coursework in additive, composite, joining, forming, CAD-CAM, and manufacturing systems",
  "ISRO-oriented case studies, internships, projects, and technical discussions",
];

export const facilities = [
  {
    name: "Advanced Manufacturing Studio",
    summary:
      "A flexible teaching and project space for additive manufacturing, subtractive workflows, process planning, metrology, and prototype validation.",
    capabilities: ["3D printing", "CNC planning", "Process mapping", "Prototype review"],
  },
  {
    name: "Composite Manufacturing and Testing Bay",
    summary:
      "A student-facing facility concept for composite layup, curing studies, coupons, quality inspection, and aerospace material discussion.",
    capabilities: ["Layup studies", "Coupon preparation", "NDT orientation", "Failure review"],
  },
  {
    name: "Forming, Joining, and Metallurgy Lab",
    summary:
      "A process-led environment for hot working, welding, deformation, microstructure study, and aerospace alloy manufacturing routes.",
    capabilities: ["Metal forming", "Welding", "Heat affected zone study", "Metallography"],
  },
  {
    name: "Manufacturing Systems and Quality Room",
    summary:
      "A planning and analytics space for scheduling, supply chain, facility layout, quality systems, and production decision modelling.",
    capabilities: ["Scheduling", "Quality systems", "Lean workflows", "Optimization"],
  },
];

export const industrialVisits = ["VSSC", "LPSC", "SDSC-SHAR", "URSC", "SAC"];

export const curriculum = {
  vision:
    "To be the state-of-the-art centre for manufacturing, continuously expanding education, research, and technological development with special focus on aerospace applications.",
  mission:
    "Value added education in applied and advanced Manufacturing Science, Engineering and Technology, nurturing quality manpower for national capability in materials processing.",
  objective:
    "To impart knowledge and promote research on basic, applied, and advanced manufacturing processes, developing industry-aligned competencies with collaborations of ISRO.",
  coreValues: [
    "Support from state-of-the-art ISRO facilities",
    "Opportunities to work with challenging manufacturing projects in the space sector",
    "Interdisciplinary learning through innovative case studies in ISRO entities",
  ],
  semesters: [
    {
      title: "Semester 1",
      credits: 19,
      courses: [
        "AE601 Mathematical Methods in Aerospace Engineering",
        "AE641 Advanced Engineering Materials",
        "AE642 Subtractive and Computer Aided Manufacturing",
        "AE643 Manufacturing Planning and Control",
        "AE804 Machine Tools and Metrology Practice",
      ],
    },
    {
      title: "Semester 2",
      credits: 19,
      courses: [
        "AE644 Plasticity and Advanced Deformation Processes",
        "AE645 Additive Manufacturing and Smart Practices",
        "AE646 Composite Manufacturing Technology",
        "AE647 Advanced Welding Technology",
        "AE805 Materials Processing and Characterization Practice",
      ],
    },
    {
      title: "Semester 3",
      credits: 16,
      courses: ["AE853 Summer Internship", "AE852 Project Phase I"],
    },
    {
      title: "Semester 4",
      credits: 16,
      courses: ["AE852 Project Phase II"],
    },
  ],
  electives: [
    "Advanced Machining Processes",
    "Design for Manufacturing",
    "Digital Manufacturing and Automation",
    "Metrology and Computer Aided Inspection",
    "Micro/Nano Manufacturing",
    "Powder Metallurgy",
    "Advanced Operations Research",
    "Quality Engineering",
    "Industrial Engineering",
    "Total Quality Management",
    "Robot Mechanisms and Technology",
    "Smart Materials and Structures",
  ],
};

export const academicEvents = [
  {
    title: "Workshop on Advanced Control Systems: Theory, Innovation, and Industrial Applications",
    date: "29 June 2026 - 3 July 2026",
    scope: "Aerospace Engineering department event",
  },
  {
    title: "Mechanisms in Chandrayaan",
    date: "15 November 2023",
    scope: "Seminar and conference listing",
  },
  {
    title: "Challenges of Human and Robotic Space Exploration",
    date: "12 October 2023",
    scope: "Seminar and conference listing",
  },
  {
    title: "Introduction to Cantera",
    date: "13 August 2023",
    scope: "Seminar and conference listing",
  },
];

export const collaborations = [
  {
    partner: "Advanced Manufacturing Technology Development Centre, IIT Madras Research Park",
    summary:
      "MoU signed on 26 September 2025 to enhance academic and research collaboration, including internships/projects, joint initiatives, joint supervision, shared facilities, seminars/workshops, and academia-industry interactions.",
  },
  {
    partner: "Indian Institute of Technology Palakkad",
    summary:
      "General MoU signed on 19 August 2024 for student exchange, joint research supervision, collaborative laboratories, and academic interactions under the NEP framework.",
  },
  {
    partner: "National Institute of Technology Calicut",
    summary:
      "MoU signed on 28 November 2023 for academic and research collaboration, including student exchange, joint supervision, shared facilities, and academic interactions.",
  },
  {
    partner: "Liquid Propulsion Systems Centre, ISRO",
    summary:
      "Listed IIST collaboration covering EPS diagnostics for high vacuum facilities and laser holography-based surface profilometry studies.",
  },
];

const studentProjects: Project[] = [
  {
    title: "Aerospace bracket process route",
    summary: "Comparison of additive, subtractive, and hybrid manufacturing plans for a light-weight aerospace bracket.",
    status: "Ongoing",
  },
  {
    title: "Inspection-ready manufacturing dossier",
    summary: "A concise technical file covering material route, process risks, tolerances, inspection plan, and acceptance criteria.",
    status: "Concept",
  },
];

export const people: Person[] = [
  {
    slug: "sooraj-v-s",
    type: "faculty",
    name: "Dr. Sooraj V. S",
    role: "Professor and Program Coordinator",
    specialization: "Additive and Subtractive Manufacturing",
    officialEmail: "sooraj@iist.ac.in",
    location: "R-103, D4",
    availability: "Research focused",
    canApprove: true,
    synopsis:
      "Faculty lead for space-oriented manufacturing design, additive and subtractive processes, precision engineering, and payload-oriented prototype development. His work anchors the program's advanced manufacturing direction for aerospace applications.",
    skills: ["Additive manufacturing", "Precision engineering", "Space payloads", "CAD-CAM"],
    skillGroups: {
      Research: ["Additive manufacturing", "Subtractive manufacturing", "Microgravity experiments"],
      Teaching: ["Manufacturing design", "Precision engineering", "Prototype development"],
    },
    researchInterests: [
      "Additive and subtractive manufacturing for space applications",
      "Manufacturing design and processes for microgravity experiments",
      "3D printing and prototyping",
    ],
    courses: ["Additive Manufacturing", "Manufacturing Design", "CAD-CAM Workflows"],
    projects: [
      {
        title: "Space manufacturing demonstrators",
        summary: "Design-for-manufacturing studies connected to small spacecraft, payloads, and precision assemblies.",
        status: "Ongoing",
      },
    ],
    sourceUrl: "https://www.iist.ac.in/people-faculty-profile/sooraj-v-s",
  },
  {
    slug: "chakravarthy-p",
    type: "faculty",
    name: "Dr. Chakravarthy P.",
    role: "Professor",
    specialization: "Aerospace Materials and Metallurgy",
    officialEmail: "chakravarthy@iist.ac.in",
    location: "R-121",
    availability: "Research focused",
    synopsis:
      "Metallurgist and manufacturing researcher working across aerospace materials, hot working of metallic materials, plasticity, forming processes, and additive manufacturing. His work gives the program a strong materials-process-property foundation.",
    skills: ["Metallurgy", "Hot working", "Aerospace materials", "Metal forming"],
    skillGroups: {
      Research: ["Aerospace materials", "Hot working", "Additive manufacturing"],
      Teaching: ["Engineering materials", "Theory of plasticity", "Advanced metal forming"],
    },
    researchInterests: ["Aerospace materials", "Hot working of metallic materials", "Additive manufacturing"],
    courses: [
      "Manufacturing Techniques",
      "Aerospace Materials and Processes",
      "Mechanical Behavior of Materials",
      "Theory of Plasticity and Advanced Metal Forming Processes",
    ],
    projects: [
      {
        title: "Hot deformation of aerospace alloys",
        summary: "Process-microstructure studies for metallic systems used in demanding aerospace manufacturing environments.",
        status: "Ongoing",
      },
    ],
    sourceUrl: "https://www.iist.ac.in/people-faculty-profile/chakravarthy-p",
  },
  {
    slug: "b-s-girish",
    type: "faculty",
    name: "Dr. B. S. Girish",
    role: "Associate Professor",
    specialization: "Manufacturing Systems and Quality Engineering",
    officialEmail: "girish@iist.ac.in",
    location: "R-120",
    availability: "Research focused",
    synopsis:
      "Quality and systems-oriented manufacturing faculty working on sequencing, scheduling, supply chains, cellular manufacturing, JIT systems, and optimization for manufacturing and aerospace operations.",
    skills: ["Quality engineering", "Scheduling", "Supply chain", "Operations research"],
    skillGroups: {
      Research: ["Sequencing and scheduling", "Supply chain management", "Cellular manufacturing"],
      Teaching: ["Operations research", "Facility layout", "Optimization techniques"],
    },
    researchInterests: [
      "Sequencing and scheduling in manufacturing and aerospace systems",
      "Supply chain management",
      "Just-in-Time systems",
    ],
    courses: ["Operations Research", "Supply Chain Management", "Facility Location and Layout Design"],
    projects: [
      {
        title: "Aerospace manufacturing scheduling models",
        summary: "Decision support for production sequencing, lateness control, and flow planning in constrained systems.",
        status: "Ongoing",
      },
    ],
    sourceUrl: "https://www.iist.ac.in/people-faculty-profile/b-s-girish",
  },
];

const currentStudents = [
  ["aniket-balaji-parnale", "Aniket Balaji Parnale", "SC25M141", "Quality Engineering", false],
  ["anushyanth-a", "Anushyanth A", "SC25M142", "Composite Manufacturing", false],
  ["juveriya-sayyed", "Juveriya Sayyed", "SC25M143", "CAD-CAM and CNC", false],
  ["lakshmi-k", "Lakshmi K", "SC25M144", "Forming Technology", false],
  ["shivam-ajay-saraswat", "Shivam Ajay Saraswat", "SC25M145", "Welding and Joining", false],
  ["bishodeep-sardar", "Bishodeep Sardar", "SC25M146", "Conventional Manufacturing", false],
  ["pranay-kumar-pandey", "Pranay Kumar Pandey", "SC25M147", "Additive Manufacturing", true],
  ["abdullah-rishad", "Abdullah Rishad", "SC25M179", "Smart Manufacturing", false],
] as const;

const outgoingStudents = [
  ["karthik-v", "Karthik V.", "Composite Manufacturing"],
  ["isha-banerjee", "Isha Banerjee", "Additive Manufacturing"],
  ["rohan-george", "Rohan George", "Quality Engineering"],
  ["lakshmi-prasad", "Lakshmi Prasad", "Forming Technology"],
  ["aditya-sen", "Aditya Sen", "CAD-CAM and CNC"],
  ["fatima-khan", "Fatima Khan", "Welding and Joining"],
  ["vivek-mathew", "Vivek Mathew", "Manufacturing Planning"],
  ["shruti-narayanan", "Shruti Narayanan", "Composite Manufacturing"],
] as const;

const incomingStudents = Array.from({ length: 12 }, (_, index) => ({
  slug: `incoming-2026-${index + 1}`,
  name: `Incoming Scholar ${String(index + 1).padStart(2, "0")}`,
  specialization: "Profile opens after joining",
}));

const phdScholars = [
  ["preeti", "Preeti", "Space Payload Prototyping", "Dr. Sooraj V. S", "2025", "Sponsored"],
  ["ashish-zachariah", "Ashish Zachariah", "Metal Additive Manufacturing", "Dr. Sooraj V. S", "2024", "Regular"],
  ["akhil-a-i", "Akhil A I", "Space Manufacturing Research", "Dr. Sooraj V. S", "2023", "Regular"],
  ["mohan-j", "Mohan J", "Aerospace Manufacturing Systems", "Dr. Sooraj V. S", "2021", "Sponsored"],
  ["ciju-paul", "Ciju Paul", "Aerospace Alloy Processing", "Dr. Chakravarthy P.", "2025", "Sponsored"],
  ["muhammed-rijas-a", "Muhammed Rijas A", "Welding and Forming of Refractory Alloys", "Dr. Chakravarthy P.", "2025", "Sponsored"],
  ["bishwajyoti-dutta-majumdar", "Bishwajyoti Dutta Majumdar", "Metallurgy and Materials Processing", "Dr. Chakravarthy P.", "2024", "Sponsored"],
  ["santhosh-kumar-k", "Santhosh Kumar K", "Aerospace Materials Research", "Dr. Chakravarthy P.", "2021", "Sponsored"],
  ["gokul-baiju", "Gokul Baiju", "Manufacturing Systems and Scheduling", "Dr. B. S. Girish", "2025", "Regular"],
  ["sona-babu", "Sona Babu", "Manufacturing Scheduling", "Dr. B. S. Girish", "2022", "Regular"],
] as const;

people.push(
  ...currentStudents.map(([slug, name, roll, specialization, admin]): Person => ({
    slug,
    type: "student",
    name,
    role: `M.Tech Scholar, ${roll}`,
    batch: "2025-2027",
    cohort: "2025-2027",
    specialization,
    officialEmail: `${roll.toLowerCase()}@iist.ac.in`,
    personalEmail: `${slug.replaceAll("-", ".")}@gmail.com`,
    portfolio: `https://${slug}.portfolio.example`,
    linkedin: `https://www.linkedin.com/in/${slug}`,
    availability: "Open to internships",
    isAdmin: admin,
    synopsis:
      "M.Tech Manufacturing Technology scholar building aerospace-oriented manufacturing depth through coursework, lab work, process planning, and applied project documentation.",
    skills: [specialization, "Process planning", "Technical documentation", "Aerospace manufacturing"],
    skillGroups: {
      Core: [specialization, "Materials and processes", "Design for manufacturing"],
      Tools: ["CAD", "Process sheets", "Inspection planning"],
      Professional: ["Technical writing", "Project reviews", "Presentation"],
    },
    projects: studentProjects,
    seekingRoles: ["Manufacturing engineer", "R&D intern", "Process development trainee"],
  })),
  ...outgoingStudents.map(([slug, name, specialization]): Person => ({
    slug,
    type: "student",
    name,
    role: "M.Tech Scholar",
    batch: "2024-2026",
    cohort: "2024-2026",
    specialization,
    officialEmail: `${slug.replaceAll("-", ".")}@iist.ac.in`,
    personalEmail: `${slug.replaceAll("-", ".")}@gmail.com`,
    availability: "Open to roles",
    synopsis:
      "Outgoing Manufacturing Technology scholar with project exposure in aerospace manufacturing, process analysis, and applied research communication.",
    skills: [specialization, "Manufacturing analysis", "Lab practice", "Project reporting"],
    skillGroups: {
      Core: [specialization, "Process optimization", "Materials processing"],
      Tools: ["CAD-CAM", "Data analysis", "Quality review"],
      Professional: ["Research writing", "Team coordination", "Industry communication"],
    },
    projects: [
      {
        title: "Master's thesis dossier",
        summary: "A structured thesis project profile will be published after student approval.",
        status: "Ongoing",
      },
    ],
    seekingRoles: ["Graduate engineer trainee", "Manufacturing analyst", "Quality engineer"],
  })),
  ...incomingStudents.map(({ slug, name, specialization }): Person => ({
    slug,
    type: "student",
    name,
    role: "M.Tech Scholar",
    batch: "2026-2028",
    cohort: "2026-2028",
    specialization,
    officialEmail: "to-be-updated@iist.ac.in",
    availability: "Joining soon",
    synopsis: "This profile will unlock when the 2026-2028 cohort joins the Manufacturing Technology program.",
    skills: ["Profile pending", "Joining August 2026"],
    skillGroups: { Status: ["Admission pending", "Profile locked"] },
    projects: [],
    seekingRoles: ["To be updated"],
  })),
  ...phdScholars.map(([slug, name, specialization, supervisor, admissionYear, mode]): Person => ({
    slug,
    type: "phd",
    name,
    role: `PhD Scholar, ${admissionYear}`,
    specialization,
    supervisor,
    officialEmail: `${slug.replaceAll("-", ".")}@iist.ac.in`,
    availability: "Research focused",
    admissionYear,
    mode,
    synopsis:
      `Doctoral researcher in Aerospace Engineering under ${supervisor}, listed on the IIST department PhD page. Public research details can be refined after the scholar claims the profile.`,
    skills: [specialization, "Research methods", "Publication writing", "Experimental planning"],
    skillGroups: {
      Research: [specialization, "Literature review", "Experimental design"],
      Communication: ["Journal manuscripts", "Conference presentations", "Technical reports"],
    },
    projects: [
      {
        title: specialization,
        summary: `Doctoral work under ${supervisor}, with public details to be updated by the scholar.`,
        status: "Ongoing",
      },
    ],
    seekingRoles: ["Postdoctoral research", "R&D scientist", "Faculty-track research"],
  })),
);

export function getPerson(slug: string) {
  return people.find((person) => person.slug === slug);
}

export function getPeopleByType(type: PersonType) {
  return people.filter((person) => person.type === type);
}
