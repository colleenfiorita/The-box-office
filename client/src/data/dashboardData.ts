/*
 * Mission Control Dashboard Data
 * Sourced from Gmail (colleenfiorita@meta.com) and internal task systems
 * Last synced: April 9, 2026
 */

export interface Ticket {
  id: string;
  type: "Case" | "Ticket";
  subject: string;
  issue: string;
  status: "Open" | "Pending" | "Resolved" | "Escalated";
  client: string;
  clientEmail: string;
  clientCompany: string;
  firstDate: string;
  lastActivity: string;
  messageCount: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  snippet: string;
  gmailLink: string;
}

export interface Test {
  id: string;
  subject: string;
  testType: string;
  status: "Active" | "Completed" | "Pending Setup" | "In Review";
  brand: string;
  client: string;
  clientEmail: string;
  firstDate: string;
  lastActivity: string;
  messageCount: number;
  snippet: string;
  gmailLink: string;
}

export interface Task {
  taskNumber: string;
  title: string;
  owner: string;
  ownerEmail: string;
  progress: string;
  priority: string;
  creationDate: string;
  tags: string[];
  taskLink: string;
}

export const tickets: Ticket[] = [
  {
    id: "782580541104314",
    type: "Case",
    subject: "Escalations desk: logging in access issue",
    issue: "Login Access Issue",
    status: "Open",
    client: "Nora Carter",
    clientEmail: "nora.carter@mattel.com",
    clientCompany: "Mattel",
    firstDate: "2026-04-09",
    lastActivity: "2026-04-09",
    messageCount: 4,
    priority: "High",
    snippet: "Experiencing login issues on Facebook account, 2FA escalated to internal team",
    gmailLink: "https://mail.google.com/mail/u/0/#search/782580541104314"
  },
  {
    id: "1505820577950967",
    type: "Case",
    subject: "Escalations desk: IG Shops Discount Codes",
    issue: "IG Shops Discount Codes",
    status: "Open",
    client: "Kalyna Dziadiw",
    clientEmail: "k.dziadiw@dvf.com",
    clientCompany: "DVF",
    firstDate: "2026-04-09",
    lastActivity: "2026-04-09",
    messageCount: 3,
    priority: "Medium",
    snippet: "Detailed response regarding IG Shops discount code issue, partnership acknowledgment",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1505820577950967"
  },
  {
    id: "1273484327485280",
    type: "Ticket",
    subject: "Ticket 1273484327485280",
    issue: "Support Ticket",
    status: "Open",
    client: "Eileen Bamrick",
    clientEmail: "Eileen.Bamrick@mattel.com",
    clientCompany: "Mattel / Fisher-Price",
    firstDate: "2026-04-07",
    lastActivity: "2026-04-07",
    messageCount: 4,
    priority: "Medium",
    snippet: "Ongoing support ticket with Fisher-Price team",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1273484327485280"
  },
  {
    id: "725370610663009",
    type: "Case",
    subject: "TSC Mid-Market Support: Harry's - Ads Creation and Editing",
    issue: "Ads Creation & Editing",
    status: "Open",
    client: "Harry's Team",
    clientEmail: "",
    clientCompany: "Harry's",
    firstDate: "2026-04-06",
    lastActivity: "2026-04-06",
    messageCount: 3,
    priority: "Medium",
    snippet: "TSC Mid-Market support form for Harry's regarding ads creation and editing issues",
    gmailLink: "https://mail.google.com/mail/u/0/#search/725370610663009"
  },
  {
    id: "923349626691781",
    type: "Case",
    subject: "Escalations desk: severe unauthorized overspend",
    issue: "Unauthorized Overspend",
    status: "Resolved",
    client: "Cait",
    clientEmail: "cait@lovepopcards.com",
    clientCompany: "Lovepop Cards",
    firstDate: "2026-04-05",
    lastActivity: "2026-04-06",
    messageCount: 2,
    priority: "Critical",
    snippet: "Severe unauthorized overspend issue, escalated and resolved",
    gmailLink: "https://mail.google.com/mail/u/0/#search/923349626691781"
  },
  {
    id: "928083323347807",
    type: "Case",
    subject: "Need More Help?",
    issue: "General Support",
    status: "Resolved",
    client: "Caitlin",
    clientEmail: "Cait@lovepopcards.com",
    clientCompany: "Lovepop Cards",
    firstDate: "2026-04-05",
    lastActivity: "2026-04-05",
    messageCount: 1,
    priority: "Low",
    snippet: "Follow-up support case, resolved",
    gmailLink: "https://mail.google.com/mail/u/0/#search/928083323347807"
  },
  {
    id: "1418603982922161",
    type: "Case",
    subject: "Escalations desk: Fraudulent account",
    issue: "Fraudulent Account",
    status: "Open",
    client: "Internal",
    clientEmail: "",
    clientCompany: "Internal",
    firstDate: "2026-03-30",
    lastActivity: "2026-04-02",
    messageCount: 3,
    priority: "Critical",
    snippet: "Business Manager 454804858603592 recovered and secured, checking ad account 1437498831257462 restriction",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1418603982922161"
  },
  {
    id: "1184957456938914",
    type: "Case",
    subject: "Escalations desk: User Account Restricted",
    issue: "Account Restricted",
    status: "Pending",
    client: "Izzy Kircher",
    clientEmail: "ikircher@booyah.com",
    clientCompany: "Booyah",
    firstDate: "2026-03-29",
    lastActivity: "2026-03-30",
    messageCount: 2,
    priority: "High",
    snippet: "User account restricted, awaiting additional information from support",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1184957456938914"
  },
  {
    id: "1995874717946390",
    type: "Case",
    subject: "MI Support: Invoice incorrectly billed to client",
    issue: "Incorrect Invoice",
    status: "Open",
    client: "AR Team",
    clientEmail: "ar@meta.com",
    clientCompany: "Internal / Client",
    firstDate: "2026-03-31",
    lastActivity: "2026-04-01",
    messageCount: 2,
    priority: "High",
    snippet: "Invoice revocation request, next steps needed ASAP",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1995874717946390"
  },
  {
    id: "1256279939984412",
    type: "Case",
    subject: "Escalations desk: Hacked asset",
    issue: "Hacked Asset",
    status: "Resolved",
    client: "Internal",
    clientEmail: "",
    clientCompany: "Internal",
    firstDate: "2026-03-28",
    lastActivity: "2026-03-29",
    messageCount: 2,
    priority: "Critical",
    snippet: "Hacked asset case, successfully resolved",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1256279939984412"
  },
  {
    id: "1123146713272447",
    type: "Case",
    subject: "Facebook Account Disabled - Unable to Accept Red Bull Invitation",
    issue: "Account Disabled",
    status: "Open",
    client: "Harshavardhini Durairaju",
    clientEmail: "harshavardhini.durairaju@omc.com",
    clientCompany: "OMC / Red Bull",
    firstDate: "2026-03-25",
    lastActivity: "2026-03-26",
    messageCount: 2,
    priority: "High",
    snippet: "Facebook account disabled, unable to accept Red Bull invitation",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1123146713272447"
  },
  {
    id: "1981554675759311",
    type: "Case",
    subject: "Account Restricted",
    issue: "Account Restricted",
    status: "Open",
    client: "Internal",
    clientEmail: "",
    clientCompany: "Internal",
    firstDate: "2026-03-20",
    lastActivity: "2026-03-21",
    messageCount: 1,
    priority: "Medium",
    snippet: "Account restriction case, under review",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1981554675759311"
  },
  {
    id: "26361802563432873",
    type: "Case",
    subject: "Meta access",
    issue: "Meta Access",
    status: "Open",
    client: "Danny Cleary",
    clientEmail: "danny.cleary@everymanjack.com",
    clientCompany: "Every Man Jack",
    firstDate: "2026-03-12",
    lastActivity: "2026-03-13",
    messageCount: 5,
    priority: "Medium",
    snippet: "Meta access issue, call scheduled with support",
    gmailLink: "https://mail.google.com/mail/u/0/#search/26361802563432873"
  },
  {
    id: "1530365311933727",
    type: "Case",
    subject: "TSC Mid-Market Support: Monday Swimwear - Catalog",
    issue: "Catalog Issue",
    status: "Open",
    client: "Monday Swimwear",
    clientEmail: "",
    clientCompany: "Monday Swimwear",
    firstDate: "2026-03-10",
    lastActivity: "2026-03-11",
    messageCount: 2,
    priority: "Medium",
    snippet: "Catalog-related support for Monday Swimwear",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1530365311933727"
  },
  {
    id: "932333975862439",
    type: "Case",
    subject: "Polly Instagram Notable Blue Badge",
    issue: "Blue Badge Request",
    status: "Open",
    client: "Taryn Dombrowski",
    clientEmail: "taryn.dombrowski@fisher-price.com",
    clientCompany: "Fisher-Price",
    firstDate: "2026-03-08",
    lastActivity: "2026-03-09",
    messageCount: 2,
    priority: "Low",
    snippet: "Instagram notable blue badge request for Polly brand",
    gmailLink: "https://mail.google.com/mail/u/0/#search/932333975862439"
  },
  {
    id: "1078378595350225",
    type: "Case",
    subject: "Ad served even though off for days",
    issue: "Ad Serving Error",
    status: "Open",
    client: "Liz Reiss",
    clientEmail: "liz@hyperbloom.com",
    clientCompany: "Hyperbloom",
    firstDate: "2026-03-05",
    lastActivity: "2026-03-06",
    messageCount: 3,
    priority: "High",
    snippet: "Ad continued serving despite being turned off, billing concern",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1078378595350225"
  },
  {
    id: "1981129182440258",
    type: "Case",
    subject: "Something else",
    issue: "General Inquiry",
    status: "Pending",
    client: "Internal",
    clientEmail: "",
    clientCompany: "Internal",
    firstDate: "2026-03-12",
    lastActivity: "2026-03-12",
    messageCount: 1,
    priority: "Low",
    snippet: "Waiting for additional information to assist",
    gmailLink: "https://mail.google.com/mail/u/0/#search/1981129182440258"
  },
  {
    id: "828769470257421",
    type: "Case",
    subject: "Something else",
    issue: "General Inquiry",
    status: "Open",
    client: "Internal",
    clientEmail: "",
    clientCompany: "Internal",
    firstDate: "2026-03-15",
    lastActivity: "2026-03-15",
    messageCount: 1,
    priority: "Low",
    snippet: "General support inquiry",
    gmailLink: "https://mail.google.com/mail/u/0/#search/828769470257421"
  }
];

export const tests: Test[] = [
  {
    id: "t-ab-workplace",
    subject: "A/B Testing Questions & Feedback",
    testType: "A/B Test",
    status: "Active",
    brand: "GMS Platform",
    client: "Butterfly (Workplace)",
    clientEmail: "",
    firstDate: "2026-04-09",
    lastActivity: "2026-04-09",
    messageCount: 1,
    snippet: "Mentioned in A/B Testing Questions & Feedback group, action requested",
    gmailLink: "https://mail.google.com/mail/u/0/#search/A%2FB+Testing+Questions+Feedback"
  },
  {
    id: "t-shopify-beta",
    subject: "Shopify Outreach for AI Checkout Beta Test",
    testType: "Beta Test",
    status: "Active",
    brand: "AI Checkout / Shopify",
    client: "Margaret Liu (PMM)",
    clientEmail: "margliu@meta.com",
    firstDate: "2026-04-09",
    lastActivity: "2026-04-09",
    messageCount: 1,
    snippet: "Shopify beta expansion, reaching out to advertisers for AI Checkout recruitment",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Shopify+AI+Checkout+Beta+Test"
  },
  {
    id: "t-awareness-momofuku",
    subject: "Awareness Test Recommendations",
    testType: "Test",
    status: "Completed",
    brand: "Momofuku",
    client: "Kyle Seebohm",
    clientEmail: "kseebohm@momofuku.com",
    firstDate: "2026-03-15",
    lastActivity: "2026-03-20",
    messageCount: 4,
    snippet: "Awareness test recommendations for Momofuku, results delivered",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Awareness+Test+Recommendations+Momofuku"
  },
  {
    id: "t-shops-beta-booyah",
    subject: "Invitation to Participate in Meta's Shops Ads + App Beta Test",
    testType: "Beta Test",
    status: "Active",
    brand: "Shops Ads + App",
    client: "Izzy Kircher",
    clientEmail: "ikircher@booyah.com",
    firstDate: "2026-02-20",
    lastActivity: "2026-03-10",
    messageCount: 4,
    snippet: "Booyah invited to participate in Shops Ads + App beta test",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Shops+Ads+App+Beta+Test+Booyah"
  },
  {
    id: "t-pltv-blackcrow",
    subject: "META pLTV Beta Test Update",
    testType: "pLTV Test",
    status: "Completed",
    brand: "Collars & Co / BlackCrow",
    client: "Victoria Norris",
    clientEmail: "victoria@thexroadz.com",
    firstDate: "2025-10-01",
    lastActivity: "2025-11-15",
    messageCount: 4,
    snippet: "pLTV beta test update, results concluded",
    gmailLink: "https://mail.google.com/mail/u/0/#search/pLTV+Beta+Test+Update+BlackCrow"
  },
  {
    id: "t-meta-overspend",
    subject: "Meta Test Overspending",
    testType: "Test",
    status: "Active",
    brand: "Harry's",
    client: "Brandon Bonilla",
    clientEmail: "brandon.bonilla@harrys.com",
    firstDate: "2026-03-01",
    lastActivity: "2026-03-15",
    messageCount: 4,
    snippet: "Investigating test overspending issue for Harry's",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Meta+Test+Overspending+Harry%27s"
  },
  {
    id: "t-voice-ai-lovepop",
    subject: "Fully Funded $25k Test - Meta Voice AI on Ads",
    testType: "Test",
    status: "Active",
    brand: "Meta Voice AI",
    client: "Caitlin Perry",
    clientEmail: "cait@lovepopcards.com",
    firstDate: "2026-02-15",
    lastActivity: "2026-03-05",
    messageCount: 3,
    snippet: "Fully funded $25k test for Meta Voice AI on Ads with Lovepop Cards",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Meta+Voice+AI+Ads+Lovepop"
  },
  {
    id: "t-pltv-collars",
    subject: "pLTV Optimization Test - Collars & Co (BlackCrow)",
    testType: "pLTV Test",
    status: "Active",
    brand: "Collars & Co",
    client: "BlackCrow AI",
    clientEmail: "",
    firstDate: "2025-09-01",
    lastActivity: "2026-01-15",
    messageCount: 3,
    snippet: "pLTV optimization test advertiser eligibility screening",
    gmailLink: "https://mail.google.com/mail/u/0/#search/pLTV+Optimization+Collars+Co+BlackCrow"
  },
  {
    id: "t-sticker-ads",
    subject: "Sticker Ads Test",
    testType: "Test",
    status: "Active",
    brand: "Sticker Ads",
    client: "Lisee Pullara",
    clientEmail: "lisee.pullara@sparkfoundryww.com",
    firstDate: "2026-01-10",
    lastActivity: "2026-02-20",
    messageCount: 4,
    snippet: "Sticker Ads test with Spark Foundry",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Sticker+Ads+Test+Spark+Foundry"
  },
  {
    id: "t-q3-opportunity",
    subject: "Q3 Test Opportunity",
    testType: "Test",
    status: "Active",
    brand: "Fallon",
    client: "Megan Kirschner",
    clientEmail: "megan.kirschner@fallon.com",
    firstDate: "2025-08-01",
    lastActivity: "2025-09-15",
    messageCount: 4,
    snippet: "Q3 test opportunity discussion with Fallon",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Q3+Test+Opportunity+Fallon"
  },
  {
    id: "t-reels-trending",
    subject: "Reels Trending Ads Beta Test",
    testType: "Beta Test",
    status: "Active",
    brand: "Reels Trending Ads",
    client: "Danny Shimanovsky",
    clientEmail: "danny.shimanovsky@omc.com",
    firstDate: "2025-07-15",
    lastActivity: "2025-08-30",
    messageCount: 4,
    snippet: "Reels Trending Ads beta test with Hearts & Science",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Reels+Trending+Ads+Beta+Hearts+Science"
  },
  {
    id: "t-reels-trending-spark",
    subject: "Reels Trending Ads Beta Test (Spark Foundry)",
    testType: "Beta Test",
    status: "Active",
    brand: "Reels Trending Ads",
    client: "Kathryn Quart",
    clientEmail: "kathryn.quart@sparkfoundryww.com",
    firstDate: "2025-07-15",
    lastActivity: "2025-08-25",
    messageCount: 4,
    snippet: "Reels Trending Ads beta test with Spark Foundry",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Reels+Trending+Ads+Beta+Spark+Foundry"
  },
  {
    id: "t-heavy-up",
    subject: "Heavy Up Test - Control vs Test Markets",
    testType: "Test",
    status: "Active",
    brand: "Heavy Up",
    client: "Rebecca LaDoe",
    clientEmail: "rebecca.ladoe@sparkfoundryww.com",
    firstDate: "2025-06-01",
    lastActivity: "2025-07-15",
    messageCount: 4,
    snippet: "Heavy Up test comparing control vs test markets",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Heavy+Up+Test+Control+Test+Markets"
  },
  {
    id: "t-ab-creative",
    subject: "Meta A/B Creative Test",
    testType: "A/B Test",
    status: "Active",
    brand: "Fallon",
    client: "Megan Kirschner",
    clientEmail: "megan.kirschner@fallon.com",
    firstDate: "2025-05-01",
    lastActivity: "2025-06-15",
    messageCount: 4,
    snippet: "A/B creative test with Fallon agency",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Meta+A%2FB+Creative+Test+Fallon"
  },
  {
    id: "t-baby-jergens",
    subject: "Baby Jergens | Value Rules Test",
    testType: "Test",
    status: "Active",
    brand: "Baby Jergens",
    client: "Sabreena Griggs",
    clientEmail: "sabreena@frontrowgroup.com",
    firstDate: "2025-04-01",
    lastActivity: "2025-05-15",
    messageCount: 4,
    snippet: "Value Rules test for Baby Jergens brand",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Baby+Jergens+Value+Rules+Test"
  },
  {
    id: "t-oribe-upper",
    subject: "Oribe Upper Funnel Test",
    testType: "Upper Funnel Test",
    status: "Active",
    brand: "Oribe",
    client: "Alexis Schmeltz",
    clientEmail: "lexi@bluewheelmedia.com",
    firstDate: "2025-07-07",
    lastActivity: "2025-07-08",
    messageCount: 2,
    snippet: "Upper funnel testing discussion for Oribe brand",
    gmailLink: "https://mail.google.com/mail/u/0/#search/Oribe+Upper+Funnel+Test"
  },
  {
    id: "t-dvf-coupon",
    subject: "MPA Test Recommendations - Coupon Request - DVF",
    testType: "Test",
    status: "Active",
    brand: "Diane von Furstenberg",
    client: "DVF Team",
    clientEmail: "",
    firstDate: "2025-10-20",
    lastActivity: "2025-11-10",
    messageCount: 4,
    snippet: "MPA test recommendations and coupon request for DVF",
    gmailLink: "https://mail.google.com/mail/u/0/#search/MPA+Test+Recommendations+Coupon+DVF"
  }
];

export const tasks: Task[] = [
  {
    taskNumber: "T263453022",
    title: "Mid Quarter Request - Guidance on CRM data tagging issues",
    owner: "Colleen Fiorita",
    ownerEmail: "colleenfiorita@meta.com",
    progress: "In Progress",
    priority: "Medium",
    creationDate: "2026-04-06",
    tags: ["CDS Enablement", "MQDT", "DMO regional query"],
    taskLink: "https://www.internalfb.com/tasks/?t=263453022"
  },
  {
    taskNumber: "T251422328",
    title: "Executive Services: Customer Support Ops Access Escalation",
    owner: "Unassigned",
    ownerEmail: "",
    progress: "No Progress",
    priority: "High",
    creationDate: "2026-01-13",
    tags: ["oncall", "escalate", "access-unmanaged", "executiveservices"],
    taskLink: "https://www.internalfb.com/tasks/?t=251422328"
  },
  {
    taskNumber: "T236849343",
    title: "SMBG MarSci - Consultation Request - Test Design",
    owner: "Adam Doherty",
    ownerEmail: "adamdoherty@meta.com",
    progress: "No Progress",
    priority: "Medium",
    creationDate: "2025-09-03",
    tags: ["Strategic", "Test Design", "measurement SME"],
    taskLink: "https://www.internalfb.com/tasks/?t=236849343"
  }
];

// Summary statistics
export const getSummaryStats = () => {
  const openTickets = tickets.filter(t => t.status === "Open").length;
  const pendingTickets = tickets.filter(t => t.status === "Pending").length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolved").length;
  const criticalTickets = tickets.filter(t => t.priority === "Critical" && t.status !== "Resolved").length;
  
  const activeTests = tests.filter(t => t.status === "Active").length;
  const completedTests = tests.filter(t => t.status === "Completed").length;
  
  const openTasks = tasks.filter(t => t.progress !== "Closed").length;
  
  return {
    tickets: {
      total: tickets.length,
      open: openTickets,
      pending: pendingTickets,
      resolved: resolvedTickets,
      critical: criticalTickets
    },
    tests: {
      total: tests.length,
      active: activeTests,
      completed: completedTests
    },
    tasks: {
      total: tasks.length,
      open: openTasks
    }
  };
};
