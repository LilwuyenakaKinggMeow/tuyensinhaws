
const faq = require("./src/data/faq.json");
const categories = require("./src/data/categories.json");

const categoryIds = new Set(
    categories.map(category => category.id)
);

const ids = new Set();

let hasError = false;

console.log("================================");
console.log("UDA SMART ASSISTANT");
console.log("KNOWLEDGE BASE VALIDATION");
console.log("================================");

for (const item of faq) {
    const errors = [];

    if (!item.id) {
        errors.push("Thiếu ID");
    } else if (ids.has(item.id)) {
        errors.push("ID bị trùng");
    } else {
        ids.add(item.id);
    }

    if (!item.category) {
        errors.push("Thiếu category");
    } else if (!categoryIds.has(item.category)) {
        errors.push("Category không tồn tại");
    }

    if (!Array.isArray(item.keywords) || item.keywords.length === 0) {
        errors.push("Keywords không hợp lệ");
    }

    if (!item.content || !item.content.trim()) {
        errors.push("Thiếu content");
    }

    if (!item.source) {
        errors.push("Thiếu source");
    }

    if (!item.updatedAt || !/^\d{4}-\d{2}-\d{2}$/.test(item.updatedAt)) {
        errors.push("updatedAt không đúng định dạng YYYY-MM-DD");
    }

    if (errors.length > 0) {
        hasError = true;
        console.log(`\n[ERROR] ${item.id || "UNKNOWN"}`);

        errors.forEach(error => {
            console.log(" - " + error);
        });
    } else {
        console.log(`[OK] ${item.id} | ${item.category}`);
    }
}

console.log("\n================================");

if (hasError) {
    console.log("VALIDATION FAILED");
    process.exit(1);
} else {
    console.log(`VALIDATION PASSED: ${faq.length} records`);
}
