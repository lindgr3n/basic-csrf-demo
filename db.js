import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
// db.data = db.data || { posts: [] } // Node < v15.x
if (!db.data) {
  db.data = { transactions: [] };
  const { transactions } = db.data;
  transactions.push({
    id: 1,
    name: "Payment from Maria Lindgren",
    href: "#",
    amount: "80000",
    currency: "USD",
    status: "success",
    date: "July 11, 2020",
    datetime: "2022-03-28",
    type: "deposition",
  });
  transactions.push({
    id: 2,
    name: "Payment to Joel Baudin",
    href: "#",
    amount: "5000",
    currency: "USD",
    status: "success",
    date: "July 10, 2020",
    datetime: "2022-03-29",
  });

  // Finally write db.data content to file
  await db.write();
}

export default db;
