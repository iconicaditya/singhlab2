import { storage } from "./storage";

const initialProjects = [
  {
    title: "Urban Waste Management Dashboard",
    category: "Technology",
    description: "Building a web-based tool to visualize waste flow in real-time.",
    fullDescription: "We are developing an interactive dashboard to help municipalities track and optimize their waste collection routes.",
    tags: ["Web App", "Open Data"],
    image: "/images/sustainable_urban_city_planning.png",
    status: "Active",
    date: "2024",
    impact: "Helping local governments reduce collection costs by 15%."
  },
  {
    title: "Microplastic Monitoring Network",
    category: "Research",
    description: "Deploying low-cost sensors to measure microplastic concentrations in local waters.",
    fullDescription: "Through partnerships with local schools, we have deployed 20+ monitoring stations across coastal areas.",
    tags: ["Citizen Science", "Marine"],
    image: "/images/marine_plastic_pollution_artistic_concept.png",
    status: "Active",
    date: "2023–2025",
    impact: "Generating open datasets used by researchers and policymakers."
  }
];

const initialTeam = [
  {
    name: "Dr. RK Singh",
    role: "Principal Investigator",
    image: "/images/professional_portrait_of_an_indian_professor.png",
    bio: "Professor at Kobe City University of Foreign Studies. Expert in environmental policy and sustainability.",
    social: { linkedin: "#", twitter: "#", email: "mailto:singh@lab.edu" }
  },
  {
    name: "Dr. Yuki Tanaka",
    role: "Lead Researcher",
    image: "/images/professional_portrait_of_a_female_researcher.png",
    bio: "Specializing in marine plastics and community engagement strategies.",
    social: { linkedin: "#", twitter: "#", email: "mailto:yuki@lab.edu" }
  }
];

const initialPublications = [
  {
    title: "Community perceptions of marine plastic pollution in Japan",
    journal: "Marine Policy",
    year: "2024",
    authors: ["Singh, R.K.", "et al."],
    type: "Journal Article",
    tags: ["Marine Pollution", "Policy"],
    abstract: "This study examines the perception of local communities regarding marine plastic pollution...",
    doi: "10.1016/j.marpol.2023.105821"
  },
  {
    title: "Barriers to effective waste management in urban areas",
    journal: "Journal of Cleaner Production",
    year: "2023",
    authors: ["Singh, R.K.", "Tanaka, Y."],
    type: "Journal Article",
    tags: ["Waste Management", "Urban"],
    abstract: "Analyzing the structural and behavioral barriers to implementing effective waste sorting systems...",
    doi: "10.1016/j.jclepro.2023.136829"
  }
];

const initialGallery = [
  { src: "/images/modern_environmental_research_lab_with_scientists.png", category: "Lab", title: "Lab Analysis" },
  { src: "/images/fieldwork_research_in_wetlands.png", category: "Fieldwork", title: "Wetlands Survey" },
  { src: "/images/community_workshop_indoors.png", category: "Community", title: "Workshop 2024" }
];

const initialMessages = [
  {
    sender: "Alice Smith",
    email: "alice@example.com",
    subject: "Collaboration Inquiry",
    message: "Dear Dr. Singh,\n\nI am writing to express my interest in collaborating with your lab on the upcoming marine plastics project.",
    date: "2024-03-20",
    status: "Unread",
    category: "Research"
  }
];

const initialResearch = [
  {
    title: "Plastic lifecycle impacts",
    category: "Waste Management",
    image: "/images/marine_plastic_pollution_artistic_concept.png",
    description: "Analyzing the cradle-to-grave environmental impact of plastic products.",
    fullDescription: "This research project conducts a comprehensive Life Cycle Assessment (LCA) of common plastic products.",
    authors: [
      { name: "Dr. Sarah Jenkins", image: "/images/professional_portrait_of_a_female_researcher.png" },
      { name: "Michael Chen", image: "" }
    ],
    doi: "10.1016/j.jclepro.2024.105234",
    journal: "Journal of Cleaner Production",
    date: "2024",
    sections: [
      { id: "intro", title: "Introduction", content: "Detailed introduction for Plastic lifecycle impacts..." }
    ],
    relatedPublicationIds: [],
    references: ["Smith, J., & Doe, A. (2023). Plastic waste. Journal of Waste, 15(4)."]
  }
];

async function seed() {
  console.log("Seeding database...");
  
  try {
    // Check if data already exists
    const existingProjects = await storage.getAllProjects();
    if (existingProjects.length > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    // Seed projects
    for (const project of initialProjects) {
      await storage.createProject(project);
    }
    console.log("✓ Seeded projects");

    // Seed team
    for (const member of initialTeam) {
      await storage.createTeamMember(member);
    }
    console.log("✓ Seeded team members");

    // Seed publications
    for (const publication of initialPublications) {
      await storage.createPublication(publication);
    }
    console.log("✓ Seeded publications");

    // Seed gallery
    for (const item of initialGallery) {
      await storage.createGalleryItem(item);
    }
    console.log("✓ Seeded gallery items");

    // Seed messages
    for (const message of initialMessages) {
      await storage.createMessage(message);
    }
    console.log("✓ Seeded messages");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
