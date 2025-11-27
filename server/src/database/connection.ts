import { createDatabasePool } from "../config/database.config.js";

const connectionPool = createDatabasePool();

export default connectionPool;
