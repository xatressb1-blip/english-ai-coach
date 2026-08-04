export interface JobRoleProfile {
  id: string;
  title: string;
  department: string;
  level: string;
  summary: string;
  skills: string[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  values: string[];
  emoji: string;
  gradient: string;
  roles: JobRoleProfile[];
}

export const companies: CompanyProfile[] = [
  {
    id: "technova",
    name: "TechNova Solutions",
    industry: "Information Technology",
    tagline: "Reliable technology for growing businesses",
    description: "A technology services company delivering IT support, networking, cloud, and business-system solutions.",
    values: ["Continuous learning", "Customer focus", "Practical innovation"],
    emoji: "💻",
    gradient: "from-blue-500 to-indigo-700",
    roles: [
      {
        id: "junior-it-support",
        title: "Junior IT Support Technician",
        department: "IT Operations",
        level: "Fresh Graduate",
        summary: "Support users, troubleshoot hardware and software, and maintain reliable day-to-day IT services.",
        skills: ["Problem solving", "Communication", "Windows and networking"],
      },
      {
        id: "junior-network-technician",
        title: "Junior Network Technician",
        department: "Network Infrastructure",
        level: "Fresh Graduate",
        summary: "Assist with network installation, monitoring, troubleshooting, and technical documentation.",
        skills: ["Networking fundamentals", "Troubleshooting", "Teamwork"],
      },
    ],
  },
  {
    id: "greenfield",
    name: "GreenField AgriTech",
    industry: "Agricultural Technology",
    tagline: "Smarter systems for modern agriculture",
    description: "An agricultural technology company combining field operations, automation, data, and equipment support.",
    values: ["Sustainability", "Safety", "Continuous improvement"],
    emoji: "🌱",
    gradient: "from-emerald-500 to-teal-700",
    roles: [
      {
        id: "technical-support-assistant",
        title: "Technical Support Assistant",
        department: "Field Technology",
        level: "Fresh Graduate",
        summary: "Help staff use digital tools and equipment systems while documenting and resolving technical issues.",
        skills: ["Technical support", "Clear communication", "Adaptability"],
      },
      {
        id: "data-reporting-assistant",
        title: "Data & Reporting Assistant",
        department: "Business Operations",
        level: "Fresh Graduate",
        summary: "Prepare operational reports, clean data, and support teams with Excel, dashboards, and process improvements.",
        skills: ["Excel", "Data accuracy", "Analytical thinking"],
      },
    ],
  },
  {
    id: "brightpath",
    name: "BrightPath Services",
    industry: "Business Services",
    tagline: "People, service, and measurable improvement",
    description: "A growing service organization focused on customer support, efficient operations, and employee development.",
    values: ["Teamwork", "Professional service", "Employee growth"],
    emoji: "🏢",
    gradient: "from-violet-500 to-fuchsia-700",
    roles: [
      {
        id: "customer-service-trainee",
        title: "Customer Service Trainee",
        department: "Customer Experience",
        level: "Fresh Graduate",
        summary: "Communicate with customers, solve service issues, and support a positive customer experience.",
        skills: ["English communication", "Active listening", "Problem solving"],
      },
      {
        id: "operations-assistant",
        title: "Operations Assistant",
        department: "Operations",
        level: "Fresh Graduate",
        summary: "Coordinate daily tasks, maintain records, and help teams improve operational processes.",
        skills: ["Organization", "Teamwork", "Attention to detail"],
      },
    ],
  },
];

export const defaultCompany = companies[0];
export const defaultJobRole = defaultCompany.roles[0];

export function getCompanyById(id: string): CompanyProfile {
  return companies.find((company) => company.id === id) ?? defaultCompany;
}

export function getJobRoleById(company: CompanyProfile, id: string): JobRoleProfile {
  return company.roles.find((role) => role.id === id) ?? company.roles[0];
}
