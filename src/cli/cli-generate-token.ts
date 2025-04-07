import { generateToken } from "../utils/generate-token";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide a JSON payload as an argument.");
  process.exit(1);
}

try {
  const payload = JSON.parse(args[0]);
  const token = generateToken(payload);
  console.log(token);
} catch (err) {
  console.error("Invalid JSON payload:", err);
  process.exit(1);
}
