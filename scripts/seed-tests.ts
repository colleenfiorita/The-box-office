/**
 * Seed script to replace all tests with the correct brand lift / study setup tests
 * from March 1, 2026 onward.
 *
 * Usage: npx tsx scripts/seed-tests.ts [BASE_URL]
 * Default BASE_URL: http://localhost:3000
 */

const BASE_URL = process.argv[2] || "http://localhost:3000";

const correctTests = [
  {
    externalId: "T258070655",
    subject: "[tasks] T258070655: Red Bull Company Ltd : [Brand Lift] : [Study Setup]",
    testType: "Brand Lift",
    status: "Active",
    brand: "Red Bull Company Ltd",
    client: "Red Bull Company Ltd",
    clientEmail: "shiriveeravalli@meta.com",
    firstDate: "Mar 03",
    lastActivity: "Mar 03",
    messageCount: 1,
    snippet: "Brand Lift study for Red Bull Company Ltd",
    gmailLink: "https://www.internalfb.com/tasks/?t=258070655",
  },
  {
    externalId: "T260044077",
    subject: "[tasks] T260044077: Presidio Brands Inc. : [Brand Lift] : [Study Setup]",
    testType: "Brand Lift",
    status: "Active",
    brand: "Presidio Brands Inc.",
    client: "Presidio Brands Inc.",
    clientEmail: "kumarkstephen@meta.com",
    firstDate: "Mar 16",
    lastActivity: "Mar 16",
    messageCount: 1,
    snippet: "Brand Lift study for Presidio Brands Inc.",
    gmailLink: "https://www.internalfb.com/tasks/?t=260044077",
  },
  {
    externalId: "T262146503",
    subject: "[tasks] T262146503: Red Bull North America Inc : [Brand Lift] : [Study Setup]",
    testType: "Brand Lift",
    status: "Completed",
    brand: "Red Bull North America Inc",
    client: "Red Bull North America Inc",
    clientEmail: "bellyumarani@meta.com",
    firstDate: "Mar 30",
    lastActivity: "Mar 30",
    messageCount: 1,
    snippet: "Brand Lift study for Red Bull North America Inc",
    gmailLink: "https://www.internalfb.com/tasks/?t=262146503",
  },
  {
    externalId: "T262701881",
    subject: "[tasks] T262701881: Red Bull North America Inc : [Brand Lift] : [Study Setup]",
    testType: "Brand Lift",
    status: "Active",
    brand: "Red Bull North America Inc",
    client: "Red Bull North America Inc",
    clientEmail: "vanganikith@meta.com",
    firstDate: "Apr 02",
    lastActivity: "Apr 02",
    messageCount: 1,
    snippet: "Brand Lift study for Red Bull North America Inc - Flight 3",
    gmailLink: "https://www.internalfb.com/tasks/?t=262701881",
  },
];

async function seedTests() {
  console.log(`Seeding tests to ${BASE_URL}...`);
  console.log(`Replacing with ${correctTests.length} correct tests`);

  try {
    const response = await fetch(`${BASE_URL}/api/trpc/dashboard.replaceTests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tests: correctTests }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`HTTP ${response.status}: ${text}`);
      process.exit(1);
    }

    const result = await response.json();
    console.log("Seed result:", JSON.stringify(result, null, 2));
    console.log("Tests seeded successfully!");
  } catch (error) {
    console.error("Failed to seed tests:", error);
    process.exit(1);
  }
}

seedTests();
