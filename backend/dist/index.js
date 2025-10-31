import app from "./app.js";
import "dotenv/config";
import { connectToDatabase } from "./db/connection.js";
const port = process.env.PORT || 5000;
// Handle case: port already in use
process.on("uncaughtException", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log(`⚠️  Port ${port} already in use. Exiting old process...`);
        process.exit(1); // let nodemon restart it cleanly
    }
    else {
        console.error("❌ Uncaught Exception:", err);
    }
});
// connections and listeners
connectToDatabase()
    .then(() => {
    app.listen(port, () => console.log("✅ Server Open & connected To Database on port", port));
})
    .catch((err) => console.log("❌ DB Connection Error:", err));
//# sourceMappingURL=index.js.map