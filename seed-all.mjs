/**
 * Complete seed script: reads ALL data from dashboardData.ts and pushes to DB.
 * This includes the tickets that were missed in the first seed.
 */

const BASE_URL = "http://localhost:3000";

// ALL remaining tickets not in the first seed
const additionalTickets = [
  { externalId: "1123146713272447", type: "Case", subject: "Facebook Account Disabled - Unable to Accept Red Bull Invitation", issue: "Account Disabled", status: "Open", client: "Harshavardhini Durairaju", clientEmail: "harshavardhini.durairaju@omc.com", clientCompany: "OMC / Red Bull", firstDate: "2026-03-25", lastActivity: "2026-03-26", messageCount: 2, priority: "High", snippet: "Facebook account disabled, unable to accept Red Bull invitation", gmailLink: "https://mail.google.com/mail/u/0/#search/1123146713272447" },
  { externalId: "1981554675759311", type: "Case", subject: "Account Restricted", issue: "Account Restricted", status: "Open", client: "Internal", clientEmail: "", clientCompany: "Internal", firstDate: "2026-03-20", lastActivity: "2026-03-21", messageCount: 1, priority: "Medium", snippet: "Account restriction case, under review", gmailLink: "https://mail.google.com/mail/u/0/#search/1981554675759311" },
  { externalId: "26361802563432873", type: "Case", subject: "Meta access", issue: "Meta Access", status: "Open", client: "Danny Cleary", clientEmail: "danny.cleary@everymanjack.com", clientCompany: "Every Man Jack", firstDate: "2026-03-12", lastActivity: "2026-03-13", messageCount: 5, priority: "Medium", snippet: "Meta access issue, call scheduled with support", gmailLink: "https://mail.google.com/mail/u/0/#search/26361802563432873" },
  { externalId: "1530365311933727", type: "Case", subject: "TSC Mid-Market Support: Monday Swimwear - Catalog", issue: "Catalog Issue", status: "Open", client: "Monday Swimwear", clientEmail: "", clientCompany: "Monday Swimwear", firstDate: "2026-03-10", lastActivity: "2026-03-11", messageCount: 2, priority: "Medium", snippet: "Catalog-related support for Monday Swimwear", gmailLink: "https://mail.google.com/mail/u/0/#search/1530365311933727" },
  { externalId: "932333975862439", type: "Case", subject: "Polly Instagram Notable Blue Badge", issue: "Blue Badge Request", status: "Open", client: "Taryn Dombrowski", clientEmail: "taryn.dombrowski@fisher-price.com", clientCompany: "Fisher-Price", firstDate: "2026-03-08", lastActivity: "2026-03-09", messageCount: 2, priority: "Low", snippet: "Instagram notable blue badge request for Polly brand", gmailLink: "https://mail.google.com/mail/u/0/#search/932333975862439" },
  { externalId: "1078378595350225", type: "Case", subject: "Ad served even though off for days", issue: "Ad Serving Error", status: "Open", client: "Liz Reiss", clientEmail: "liz@hyperbloom.com", clientCompany: "Hyperbloom", firstDate: "2026-03-05", lastActivity: "2026-03-06", messageCount: 3, priority: "High", snippet: "Ad continued serving despite being turned off, billing concern", gmailLink: "https://mail.google.com/mail/u/0/#search/1078378595350225" },
  { externalId: "1981129182440258", type: "Case", subject: "Something else", issue: "General Inquiry", status: "Pending", client: "Internal", clientEmail: "", clientCompany: "Internal", firstDate: "2026-03-12", lastActivity: "2026-03-12", messageCount: 1, priority: "Low", snippet: "Waiting for additional information to assist", gmailLink: "https://mail.google.com/mail/u/0/#search/1981129182440258" },
  { externalId: "828769470257421", type: "Case", subject: "Something else", issue: "General Inquiry", status: "Open", client: "Internal", clientEmail: "", clientCompany: "Internal", firstDate: "2026-03-15", lastActivity: "2026-03-15", messageCount: 1, priority: "Low", snippet: "General support inquiry", gmailLink: "https://mail.google.com/mail/u/0/#search/828769470257421" },
];

// Additional tests from dashboardData.ts
const additionalTests = [
  { externalId: "t-ab-workplace", subject: "A/B Testing Questions & Feedback", testType: "A/B Test", status: "Active", brand: "GMS Platform", client: "Butterfly (Workplace)", clientEmail: "", firstDate: "2026-04-09", lastActivity: "2026-04-09", messageCount: 1, snippet: "Mentioned in A/B Testing Questions & Feedback group, action requested", gmailLink: "https://mail.google.com/mail/u/0/#search/A%2FB+Testing+Questions+Feedback" },
  { externalId: "t-lift-study", subject: "Conversion Lift Study Setup", testType: "Conversion Lift", status: "Active", brand: "Multiple Clients", client: "GMS Measurement", clientEmail: "", firstDate: "2026-04-08", lastActivity: "2026-04-09", messageCount: 3, snippet: "Conversion lift study setup guidance and best practices", gmailLink: "https://mail.google.com/mail/u/0/#search/conversion+lift+study+setup" },
  { externalId: "t-lovepop-voice", subject: "Meta Voice AI $25k Test", testType: "Beta Test", status: "Active", brand: "Lovepop Cards", client: "Cait", clientEmail: "cait@lovepopcards.com", firstDate: "2026-03-05", lastActivity: "2026-04-04", messageCount: 8, snippet: "Meta Voice AI beta test with $25k budget for Lovepop", gmailLink: "https://mail.google.com/mail/u/0/#search/lovepop+voice+ai" },
  { externalId: "t-collars-pltv", subject: "Collars & Co pLTV Model Test", testType: "pLTV Test", status: "Active", brand: "Collars & Co", client: "Justin Baer", clientEmail: "justin@collarsandco.com", firstDate: "2026-04-07", lastActivity: "2026-04-08", messageCount: 4, snippet: "Predicted lifetime value model testing for Collars & Co", gmailLink: "https://mail.google.com/mail/u/0/#search/collars+pltv" },
  { externalId: "t-harrys-incrementality", subject: "Harry's Incrementality Study", testType: "Conversion Lift", status: "Completed", brand: "Harry's", client: "Harry's Analytics", clientEmail: "analytics@harrys.com", firstDate: "2026-02-15", lastActivity: "2026-03-20", messageCount: 10, snippet: "Completed incrementality study showing 12% lift", gmailLink: "https://mail.google.com/mail/u/0/#search/harrys+incrementality" },
  { externalId: "t-dvf-spring", subject: "DVF Spring Collection Beta", testType: "Beta Test", status: "Completed", brand: "DVF", client: "DVF Digital", clientEmail: "digital@dvf.com", firstDate: "2026-02-01", lastActivity: "2026-03-15", messageCount: 7, snippet: "Completed beta test for spring collection launch features", gmailLink: "https://mail.google.com/mail/u/0/#search/dvf+spring+beta" },
  { externalId: "t-lovepop-valentines", subject: "Lovepop Valentine's A/B Results", testType: "A/B Test", status: "Completed", brand: "Lovepop Cards", client: "Caitlin", clientEmail: "caitlin@lovepopcards.com", firstDate: "2026-01-20", lastActivity: "2026-02-28", messageCount: 5, snippet: "Valentine's campaign A/B test results — 23% CTR improvement", gmailLink: "https://mail.google.com/mail/u/0/#search/lovepop+valentines+test" },
  { externalId: "t-mattel-pltv", subject: "Mattel Holiday pLTV Analysis", testType: "pLTV Test", status: "Active", brand: "Mattel", client: "Eileen Bamrick", clientEmail: "Eileen.Bamrick@mattel.com", firstDate: "2026-04-03", lastActivity: "2026-04-05", messageCount: 5, snippet: "Predicted LTV analysis for Mattel holiday campaign planning", gmailLink: "https://mail.google.com/mail/u/0/#search/mattel+pltv" },
  { externalId: "t-shopify-checkout", subject: "Shopify AI Checkout Beta", testType: "Beta Test", status: "Active", brand: "Shopify Partners", client: "Shopify Team", clientEmail: "partners@shopify.com", firstDate: "2026-04-09", lastActivity: "2026-04-09", messageCount: 1, snippet: "Beta testing Shopify AI-powered checkout integration", gmailLink: "https://mail.google.com/mail/u/0/#search/shopify+ai+checkout" },
  { externalId: "t-fallon-ab", subject: "Meta A/B Creative Test - Fallon", testType: "A/B Test", status: "Active", brand: "Fallon Agency", client: "Fallon Team", clientEmail: "", firstDate: "2025-12-01", lastActivity: "2026-01-15", messageCount: 4, snippet: "A/B creative test with Fallon agency", gmailLink: "https://mail.google.com/mail/u/0/#search/Meta+A%2FB+Creative+Test+Fallon" },
  { externalId: "t-baby-jergens", subject: "Baby Jergens | Value Rules Test", testType: "Test", status: "Active", brand: "Baby Jergens", client: "Sabreena Griggs", clientEmail: "sabreena@frontrowgroup.com", firstDate: "2025-04-01", lastActivity: "2025-05-15", messageCount: 4, snippet: "Value Rules test for Baby Jergens brand", gmailLink: "https://mail.google.com/mail/u/0/#search/Baby+Jergens+Value+Rules+Test" },
  { externalId: "t-oribe-upper", subject: "Oribe Upper Funnel Test", testType: "Upper Funnel Test", status: "Active", brand: "Oribe", client: "Alexis Schmeltz", clientEmail: "lexi@bluewheelmedia.com", firstDate: "2025-07-07", lastActivity: "2025-07-08", messageCount: 2, snippet: "Upper funnel testing discussion for Oribe brand", gmailLink: "https://mail.google.com/mail/u/0/#search/Oribe+Upper+Funnel+Test" },
  { externalId: "t-dvf-coupon", subject: "MPA Test Recommendations - Coupon Request - DVF", testType: "Test", status: "Active", brand: "Diane von Furstenberg", client: "DVF Team", clientEmail: "", firstDate: "2025-10-20", lastActivity: "2025-11-10", messageCount: 4, snippet: "MPA test recommendations and coupon request for DVF", gmailLink: "https://mail.google.com/mail/u/0/#search/MPA+Test+Recommendations+Coupon+DVF" },
];

async function seed() {
  console.log("Seeding additional data...");
  
  try {
    const response = await fetch(`${BASE_URL}/api/trpc/dashboard.sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          tickets: additionalTickets,
          tests: additionalTests,
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
    console.log("Additional data seeded successfully!");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
