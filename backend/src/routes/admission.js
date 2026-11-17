
const express = require("express");
const { randomBytes } = require("crypto");
const { getDatabase, saveDatabase } = require("../database/connection");

const router = express.Router();

const majors = [
    { code: "IT", name: "Công nghệ thông tin", group: "Công nghệ" },
    { code: "CO", name: "Kỹ thuật máy tính", group: "Công nghệ" },
    { code: "BBA", name: "Quản trị kinh doanh", group: "Kinh tế" },
    { code: "EN", name: "Ngôn ngữ Anh", group: "Ngôn ngữ" },
    { code: "TOUR", name: "Du lịch", group: "Du lịch" }
];

// Lấy danh sách ngành
router.get("/majors", (req, res) => {
    res.json({
        success: true,
        demo: true,
        data: majors
    });
});

router.post("/register", async (req, res) => {
    try {
        const {
            fullName,
            phone,
            email,
            highSchool,
            graduationYear,
            admissionMethod,
            majorCode,
            score
        } = req.body;

        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !admissionMethod?.trim() ||
            !majorCode?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập họ tên, số điện thoại, phương thức xét tuyển và ngành học."
            });
        }

        if (!/^[0-9+\s().-]{8,20}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message: "Số điện thoại không hợp lệ."
            });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ."
            });
        }

        const selectedMajor = majors.find(
            (major) => major.code === majorCode
        );

        if (!selectedMajor) {
            return res.status(400).json({
                success: false,
                message: "Ngành học không hợp lệ trong danh sách demo."
            });
        }

        const parsedYear = graduationYear
            ? Number(graduationYear)
            : null;

        if (
            parsedYear !== null &&
            (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Năm tốt nghiệp không hợp lệ."
            });
        }

        const parsedScore = score === "" || score === undefined || score === null
            ? null
            : Number(score);

        if (
            parsedScore !== null &&
            (!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > 30)
        ) {
            return res.status(400).json({
                success: false,
                message: "Điểm xét tuyển phải nằm trong khoảng 0 đến 30."
            });
        }

        const db = await getDatabase();

        const applicationCode =
            "UDA" + Date.now().toString().slice(-8) +
            randomBytes(2).toString("hex").toUpperCase();

        db.run(
            `INSERT INTO applications (
                application_code, full_name, phone, email,
                high_school, graduation_year, admission_method,
                major_code, score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                applicationCode,
                fullName.trim(),
                phone.trim(),
                email?.trim() || null,
                highSchool?.trim() || null,
                parsedYear,
                admissionMethod.trim(),
                majorCode,
                parsedScore
            ]
        );

        saveDatabase();

        return res.status(201).json({
            success: true,
            demo: true,
            message: "Đăng ký hồ sơ thành công.",
            data: {
                applicationCode,
                fullName: fullName.trim(),
                major: selectedMajor.name,
                status: "Đã tiếp nhận"
            }
        });
    } catch (error) {
        console.error("Admission register error:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể lưu hồ sơ lúc này."
        });
    }
});

router.get("/lookup/:code", async (req, res) => {
    try {
        const code = req.params.code.trim().toUpperCase();

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập mã hồ sơ."
            });
        }

        const db = await getDatabase();
        const statement = db.prepare(
            `SELECT application_code, full_name, admission_method,
                    major_code, score, status, created_at
             FROM applications
             WHERE application_code = ?`
        );

        statement.bind([code]);

        let application = null;

        if (statement.step()) {
            application = statement.getAsObject();
        }

        statement.free();

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy hồ sơ với mã đã nhập."
            });
        }

        const major = majors.find(
            (item) => item.code === application.major_code
        );

        return res.json({
            success: true,
            demo: true,
            data: {
                ...application,
                major_name: major?.name || "Không xác định"
            }
        });
    } catch (error) {
        console.error("Admission lookup error:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể tra cứu hồ sơ lúc này."
        });
    }
});

module.exports = router;
