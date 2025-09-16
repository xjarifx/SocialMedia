import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = parseInt(process.env.PORT || "3000", 10);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
