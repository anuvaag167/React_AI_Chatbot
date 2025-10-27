import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
//connections and listeners
const port = process.env.PORT || 5000;
connectToDatabase()
    .then(() => {
    app.listen(port, () => console.log("Server Open & connected To Databse"));
})
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map