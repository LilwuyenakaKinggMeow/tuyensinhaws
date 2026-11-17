
const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

// Lưu database tại backend/database/
const DB_DIR = path.join(__dirname, "../../database");
const DB_PATH = path.join(DB_DIR, "uda-admission.db");

let database = null;
let initPromise = null;

async function getDatabase() {
    if (database) return database;
    if (initPromise) return initPromise;

    initPromise = (async () => {
        fs.mkdirSync(DB_DIR, { recursive: true });

        const SQL = await initSqlJs({
            locateFile: (file) =>
                path.join(path.dirname(require.resolve("sql.js")), file)
        });

        if (fs.existsSync(DB_PATH)) {
            const fileBuffer = fs.readFileSync(DB_PATH);
            database = new SQL.Database(fileBuffer);
        } else {
            database = new SQL.Database();
        }

        database.run(`
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                application_code TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                high_school TEXT,
                graduation_year INTEGER,
                admission_method TEXT NOT NULL,
                major_code TEXT NOT NULL,
                score REAL,
                status TEXT NOT NULL DEFAULT 'Đã tiếp nhận',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        saveDatabase();
        return database;
    })();

    try {
        return await initPromise;
    } catch (error) {
        initPromise = null;
        throw error;
    }
}

function saveDatabase() {
    if (!database) {
        throw new Error("Database chưa được khởi tạo.");
    }

    const data = database.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = {
    getDatabase,
    saveDatabase
};
