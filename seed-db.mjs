/**
 * Seed script: reads the existing hardcoded dashboard data and pushes it
 * into the database via the tRPC sync endpoint.
 * 
 * Usage: node seed-db.mjs
 */

const BASE_URL = "http://localhost:3000";

// The existing data from dashboardData.ts, extracted here for seeding
const ticketsData = [
  { externalId: "aazrsx42jg4zyt", type: "Case", subject: "Your Ads Inquiry - Spend Limit Increase", issue: "Spend Limit Increase", status: "Open", client: "Meta Payments Support", clientEmail: "", clientCompany: "Internal / RiskOps", firstDate: "2026-04-10", lastActivity: "2026-04-10", messageCount: 1, priority: "Medium", snippet: "Spend limit increase approved — doubled current amount per RiskOps policy.", gmailLink: "https://mail.google.com/mail/u/0/#inbox/19d783dce9054c85" },
  { externalId: "782580541104314", type: "Case", subject: "Escalations desk: logging in access issue", issue: "Login Access Issue", status: "Open", client: "Nora Carter", clientEmail: "nora.carter@mattel.com", clientCompany: "Mattel", firstDate: "2026-04-09", lastActivity: "2026-04-09", messageCount: 4, priority: "High", snippet: "Experiencing login issues on Facebook account, 2FA escalated to internal team", gmailLink: "https://mail.google.com/mail/u/0/#search/782580541104314" },
  { externalId: "1505820577950967", type: "Case", subject: "Escalations desk: IG Shops Discount Codes", issue: "IG Shops Discount Codes", status: "Open", client: "Kalyna Dziadiw", clientEmail: "k.dziadiw@dvf.com", clientCompany: "DVF", firstDate: "2026-04-09", lastActivity: "2026-04-09", messageCount: 3, priority: "Medium", snippet: "Detailed response regarding IG Shops discount code issue", gmailLink: "https://mail.google.com/mail/u/0/#search/1505820577950967" },
  { externalId: "1273484327485280", type: "Ticket", subject: "Ticket 1273484327485280", issue: "Support Ticket", status: "Open", client: "Eileen Bamrick", clientEmail: "Eileen.Bamrick@mattel.com", clientCompany: "Mattel / Fisher-Price", firstDate: "2026-04-07", lastActivity: "2026-04-07", messageCount: 4, priority: "Medium", snippet: "Ongoing support ticket with Fisher-Price team", gmailLink: "https://mail.google.com/mail/u/0/#search/1273484327485280" },
  { externalId: "663009", type: "Case", subject: "Ads Creation & Editing Issues", issue: "Ads Creation & Editing", status: "Open", client: "Harry's Team", clientEmail: "team@harrys.com", clientCompany: "Harry's", firstDate: "2026-04-06", lastActivity: "2026-04-06", messageCount: 3, priority: "Medium", snippet: "Issues with ads creation and editing workflow", gmailLink: "https://mail.google.com/mail/u/0/#search/663009" },
  { externalId: "691781", type: "Case", subject: "Unauthorized Overspend", issue: "Unauthorized Overspend", status: "Resolved", client: "Cait", clientEmail: "cait@lovepopcards.com", clientCompany: "Lovepop Cards", firstDate: "2026-04-06", lastActivity: "2026-04-06", messageCount: 2, priority: "Critical", snippet: "Unauthorized overspend issue on ad account", gmailLink: "https://mail.google.com/mail/u/0/#search/691781" },
  { externalId: "347807", type: "Case", subject: "General Support", issue: "General Support", status: "Resolved", client: "Caitlin", clientEmail: "caitlin@lovepopcards.com", clientCompany: "Lovepop Cards", firstDate: "2026-04-05", lastActivity: "2026-04-05", messageCount: 1, priority: "Low", snippet: "General support inquiry", gmailLink: "https://mail.google.com/mail/u/0/#search/347807" },
  { externalId: "923163", type: "Case", subject: "Fraudulent Account Activity", issue: "Fraudulent Account Activity", status: "Open", client: "Internal", clientEmail: "", clientCompany: "Meta (Internal)", firstDate: "2026-04-02", lastActivity: "2026-04-02", messageCount: 3, priority: "Critical", snippet: "Fraudulent activity detected on managed account", gmailLink: "https://mail.google.com/mail/u/0/#search/923163" },
  { externalId: "1418603", type: "Case", subject: "Account Recovery Request", issue: "Account Recovery", status: "Resolved", client: "Internal", clientEmail: "", clientCompany: "Meta (Internal)", firstDate: "2026-04-02", lastActivity: "2026-04-02", messageCount: 2, priority: "High", snippet: "Account recovery process completed", gmailLink: "https://mail.google.com/mail/u/0/#search/1418603" },
  { externalId: "923349", type: "Case", subject: "Overspend Resolution", issue: "Overspend Resolution", status: "Open", client: "Cait", clientEmail: "cait@lovepopcards.com", clientCompany: "Lovepop Cards", firstDate: "2026-04-01", lastActivity: "2026-04-06", messageCount: 5, priority: "High", snippet: "Ongoing overspend resolution with multiple follow-ups", gmailLink: "https://mail.google.com/mail/u/0/#search/923349" },
  { externalId: "BM-001", type: "Ticket", subject: "Business Manager Access", issue: "BM Access", status: "Open", client: "Sarah Kim", clientEmail: "sarah.kim@sparkfoundryww.com", clientCompany: "Spark Foundry", firstDate: "2026-03-28", lastActivity: "2026-04-03", messageCount: 6, priority: "Medium", snippet: "Business Manager access request and permissions setup", gmailLink: "https://mail.google.com/mail/u/0/#search/business+manager+spark+foundry" },
  { externalId: "PIX-002", type: "Ticket", subject: "Pixel Implementation Support", issue: "Pixel Setup", status: "Open", client: "Dev Team", clientEmail: "dev@collarsandco.com", clientCompany: "Collars & Co", firstDate: "2026-03-25", lastActivity: "2026-04-01", messageCount: 4, priority: "Medium", snippet: "Pixel implementation and event tracking setup", gmailLink: "https://mail.google.com/mail/u/0/#search/pixel+collars" },
  { externalId: "CAT-003", type: "Ticket", subject: "Product Catalog Sync Issues", issue: "Catalog Sync", status: "Pending", client: "E-commerce Team", clientEmail: "ecom@ofrfrancis.com", clientCompany: "OFR Francis", firstDate: "2026-03-20", lastActivity: "2026-03-30", messageCount: 3, priority: "Medium", snippet: "Product catalog sync failing intermittently", gmailLink: "https://mail.google.com/mail/u/0/#search/catalog+sync+ofr" },
  { externalId: "API-004", type: "Ticket", subject: "Conversions API Setup", issue: "CAPI Setup", status: "Open", client: "Marketing Ops", clientEmail: "ops@rhone.com", clientCompany: "Rhone", firstDate: "2026-03-18", lastActivity: "2026-03-28", messageCount: 5, priority: "High", snippet: "Conversions API integration and server-side tracking", gmailLink: "https://mail.google.com/mail/u/0/#search/conversions+api+rhone" },
  { externalId: "AUD-005", type: "Ticket", subject: "Custom Audience Issues", issue: "Audience Building", status: "Pending", client: "Media Team", clientEmail: "media@ofrfrancis.com", clientCompany: "OFR Francis", firstDate: "2026-03-15", lastActivity: "2026-03-25", messageCount: 2, priority: "Low", snippet: "Custom audience creation and matching rate issues", gmailLink: "https://mail.google.com/mail/u/0/#search/custom+audience+ofr" },
  { externalId: "REP-006", type: "Ticket", subject: "Reporting Discrepancies", issue: "Reporting Issues", status: "Open", client: "Analytics Team", clientEmail: "analytics@mattel.com", clientCompany: "Mattel", firstDate: "2026-03-12", lastActivity: "2026-03-22", messageCount: 7, priority: "High", snippet: "Discrepancies between Ads Manager and GA4 reporting", gmailLink: "https://mail.google.com/mail/u/0/#search/reporting+discrepancies+mattel" },
  { externalId: "POL-007", type: "Ticket", subject: "Ad Policy Review Request", issue: "Policy Review", status: "Open", client: "Creative Team", clientEmail: "creative@dvf.com", clientCompany: "DVF", firstDate: "2026-03-10", lastActivity: "2026-03-20", messageCount: 3, priority: "Medium", snippet: "Ad disapprovals and policy review escalation", gmailLink: "https://mail.google.com/mail/u/0/#search/policy+review+dvf" },
  { externalId: "BIL-008", type: "Ticket", subject: "Billing Threshold Adjustment", issue: "Billing Adjustment", status: "Open", client: "Finance", clientEmail: "finance@harrys.com", clientCompany: "Harry's", firstDate: "2026-03-08", lastActivity: "2026-03-18", messageCount: 2, priority: "Low", snippet: "Request to adjust billing threshold on ad account", gmailLink: "https://mail.google.com/mail/u/0/#search/billing+threshold+harrys" },
];

const testsData = [
  { externalId: "TEST-001", subject: "Momofuku Conversion Lift Study", testType: "Conversion Lift", status: "Active", brand: "Momofuku", client: "Marguerite Mariscal", clientEmail: "marguerite@momofuku.com", firstDate: "2026-04-09", lastActivity: "2026-04-09", messageCount: 2, snippet: "Conversion lift study for Momofuku DTC campaigns", gmailLink: "https://mail.google.com/mail/u/0/#search/momofuku+lift+study" },
  { externalId: "TEST-002", subject: "Oribe A/B Creative Test", testType: "A/B Test", status: "Active", brand: "Oribe", client: "Oribe Team", clientEmail: "marketing@oribe.com", firstDate: "2026-04-08", lastActivity: "2026-04-09", messageCount: 3, snippet: "A/B testing new creative formats for Oribe hair care", gmailLink: "https://mail.google.com/mail/u/0/#search/oribe+ab+test" },
  { externalId: "TEST-003", subject: "Shopify AI Checkout Beta", testType: "Beta Test", status: "Active", brand: "Shopify Partners", client: "Shopify Team", clientEmail: "partners@shopify.com", firstDate: "2026-04-09", lastActivity: "2026-04-09", messageCount: 1, snippet: "Beta testing Shopify AI-powered checkout integration", gmailLink: "https://mail.google.com/mail/u/0/#search/shopify+ai+checkout" },
  { externalId: "TEST-004", subject: "Collars & Co pLTV Model Test", testType: "pLTV Test", status: "Active", brand: "Collars & Co", client: "Justin Baer", clientEmail: "justin@collarsandco.com", firstDate: "2026-04-07", lastActivity: "2026-04-08", messageCount: 4, snippet: "Predicted lifetime value model testing for Collars & Co", gmailLink: "https://mail.google.com/mail/u/0/#search/collars+pltv" },
  { externalId: "TEST-005", subject: "Harry's Brand Lift Study", testType: "Brand Lift", status: "Active", brand: "Harry's", client: "Harry's Marketing", clientEmail: "marketing@harrys.com", firstDate: "2026-04-05", lastActivity: "2026-04-07", messageCount: 3, snippet: "Brand lift measurement for Harry's awareness campaigns", gmailLink: "https://mail.google.com/mail/u/0/#search/harrys+brand+lift" },
  { externalId: "TEST-006", subject: "DVF Reels A/B Test", testType: "A/B Test", status: "Active", brand: "DVF", client: "Kalyna Dziadiw", clientEmail: "k.dziadiw@dvf.com", firstDate: "2026-04-04", lastActivity: "2026-04-06", messageCount: 2, snippet: "Testing Reels vs. Stories format for DVF spring collection", gmailLink: "https://mail.google.com/mail/u/0/#search/dvf+reels+test" },
  { externalId: "TEST-007", subject: "Mattel Holiday pLTV Analysis", testType: "pLTV Test", status: "Active", brand: "Mattel", client: "Eileen Bamrick", clientEmail: "Eileen.Bamrick@mattel.com", firstDate: "2026-04-03", lastActivity: "2026-04-05", messageCount: 5, snippet: "Predicted LTV analysis for Mattel holiday campaign planning", gmailLink: "https://mail.google.com/mail/u/0/#search/mattel+pltv" },
  { externalId: "TEST-008", subject: "Lovepop Cards Voice AI $25k Test", testType: "Beta Test", status: "Active", brand: "Lovepop Cards", client: "Cait", clientEmail: "cait@lovepopcards.com", firstDate: "2026-03-05", lastActivity: "2026-04-04", messageCount: 8, snippet: "Meta Voice AI beta test with $25k budget for Lovepop", gmailLink: "https://mail.google.com/mail/u/0/#search/lovepop+voice+ai" },
  { externalId: "TEST-009", subject: "Rhone Advantage+ Shopping Test", testType: "A/B Test", status: "Active", brand: "Rhone", client: "Rhone Marketing", clientEmail: "marketing@rhone.com", firstDate: "2026-03-28", lastActivity: "2026-04-03", messageCount: 3, snippet: "Advantage+ Shopping campaigns vs manual setup for Rhone", gmailLink: "https://mail.google.com/mail/u/0/#search/rhone+advantage+shopping" },
  { externalId: "TEST-010", subject: "Spark Foundry Multi-Cell Lift", testType: "Conversion Lift", status: "Active", brand: "Spark Foundry", client: "Sarah Kim", clientEmail: "sarah.kim@sparkfoundryww.com", firstDate: "2026-03-25", lastActivity: "2026-04-01", messageCount: 4, snippet: "Multi-cell conversion lift study across Spark Foundry clients", gmailLink: "https://mail.google.com/mail/u/0/#search/spark+foundry+lift" },
  { externalId: "TEST-011", subject: "OFR Francis Catalog Sales Test", testType: "A/B Test", status: "Active", brand: "OFR Francis", client: "E-commerce Team", clientEmail: "ecom@ofrfrancis.com", firstDate: "2026-03-20", lastActivity: "2026-03-30", messageCount: 2, snippet: "Testing catalog sales optimization for OFR Francis", gmailLink: "https://mail.google.com/mail/u/0/#search/ofr+catalog+test" },
  { externalId: "TEST-012", subject: "Mattel Fisher-Price Audience Test", testType: "pLTV Test", status: "Active", brand: "Mattel / Fisher-Price", client: "Nora Carter", clientEmail: "nora.carter@mattel.com", firstDate: "2026-03-15", lastActivity: "2026-03-28", messageCount: 6, snippet: "pLTV audience segmentation test for Fisher-Price", gmailLink: "https://mail.google.com/mail/u/0/#search/fisher+price+audience" },
  { externalId: "TEST-013", subject: "Harry's Incrementality Study", testType: "Conversion Lift", status: "Completed", brand: "Harry's", client: "Harry's Analytics", clientEmail: "analytics@harrys.com", firstDate: "2026-02-15", lastActivity: "2026-03-20", messageCount: 10, snippet: "Completed incrementality study showing 12% lift", gmailLink: "https://mail.google.com/mail/u/0/#search/harrys+incrementality" },
  { externalId: "TEST-014", subject: "DVF Spring Collection Beta", testType: "Beta Test", status: "Completed", brand: "DVF", client: "DVF Digital", clientEmail: "digital@dvf.com", firstDate: "2026-02-01", lastActivity: "2026-03-15", messageCount: 7, snippet: "Completed beta test for spring collection launch features", gmailLink: "https://mail.google.com/mail/u/0/#search/dvf+spring+beta" },
  { externalId: "TEST-015", subject: "Lovepop Valentine's A/B Results", testType: "A/B Test", status: "Completed", brand: "Lovepop Cards", client: "Caitlin", clientEmail: "caitlin@lovepopcards.com", firstDate: "2026-01-20", lastActivity: "2026-02-28", messageCount: 5, snippet: "Valentine's campaign A/B test results — 23% CTR improvement", gmailLink: "https://mail.google.com/mail/u/0/#search/lovepop+valentines+test" },
  { externalId: "TEST-016", subject: "Collars & Co Broad Targeting Test", testType: "A/B Test", status: "Active", brand: "Collars & Co", client: "Justin Baer", clientEmail: "justin@collarsandco.com", firstDate: "2026-03-10", lastActivity: "2026-03-25", messageCount: 3, snippet: "Testing broad vs interest-based targeting for Collars & Co", gmailLink: "https://mail.google.com/mail/u/0/#search/collars+broad+targeting" },
  { externalId: "TEST-017", subject: "Rhone Advantage+ Creative Test", testType: "Beta Test", status: "Active", brand: "Rhone", client: "Rhone Creative", clientEmail: "creative@rhone.com", firstDate: "2026-03-05", lastActivity: "2026-03-22", messageCount: 2, snippet: "Beta testing Advantage+ creative optimization for Rhone", gmailLink: "https://mail.google.com/mail/u/0/#search/rhone+advantage+creative" },
];

const tasksData = [
  { taskNumber: "T263453022", title: "Mid Quarter Request - Guidance on CRM data tagging issues", owner: "Colleen Fiorita", ownerEmail: "colleenfiorita@meta.com", progress: "In Progress", priority: "Medium", creationDate: "2026-04-06", tags: ["CDS Enablement", "MQOT", "DMO regional_query"], taskLink: "https://tasks.example.com/T263453022" },
  { taskNumber: "T251422328", title: "Executive Services: Customer Support Ops Access Escalation", owner: "Unassigned", ownerEmail: "", progress: "No Progress", priority: "High", creationDate: "2026-04-03", tags: ["oncall", "escalate", "access-unmanaged", "exec-services"], taskLink: "https://tasks.example.com/T251422328" },
  { taskNumber: "T236849343", title: "SMBG MarSci - Consultation Request - Test Design", owner: "Adam Doherty", ownerEmail: "adamdoherty@meta.com", progress: "No Progress", priority: "Medium", creationDate: "2026-03-28", tags: ["Strategic", "Test Design", "measurement SME"], taskLink: "https://tasks.example.com/T236849343" },
];

async function seed() {
  console.log("Seeding database with existing dashboard data...");
  
  try {
    const response = await fetch(`${BASE_URL}/api/trpc/dashboard.sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          tickets: ticketsData,
          tests: testsData,
          tasks: tasksData,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Seed failed:", response.status, text);
      process.exit(1);
    }

    const result = await response.json();
    console.log("Seed result:", JSON.stringify(result, null, 2));
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
