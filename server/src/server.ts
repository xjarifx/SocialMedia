import "./config/env.config.js";
import app from "./app.js";
import { env } from "./config/env.config.js";

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

