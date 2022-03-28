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
    name: "Payment to Molly Sanders",
    href: "#",
    amount: "$20,000",
    currency: "USD",
    status: "success",
    date: "July 11, 2020",
    datetime: "2020-07-11",
  });
  transactions.push({
    id: 2,
    name: "Payment to Molly Sanders",
    href: "#",
    amount: "$10,000",
    currency: "USD",
    status: "success",
    date: "July 10, 2020",
    datetime: "2020-07-10",
  });

  // Finally write db.data content to file
  await db.write();
}

export default db;
