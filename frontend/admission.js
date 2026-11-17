
const ADMISSION_API_BASE =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "/api";

const ADMISSION_API = `${API_BASE}/admission`;

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  loadMajors();
  setupRegistrationForm();
  setupLookupForm();
});

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

async function loadMajors() {
  const majorSelect = document.getElementById("appMajor");
  const message = document.getElementById("majorLoadMessage");

  if (!majorSelect) return;

  try {
    const response = await fetch(`${ADMISSION_API}/majors`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không tải được danh sách ngành.");
    }

    majorSelect.innerHTML =
      '<option value="">-- Chọn ngành học --</option>';

    result.data.forEach((major) => {
      const option = document.createElement("option");
      option.value = major.code;
      option.textContent = `${major.name} (${major.code})`;
      majorSelect.appendChild(option);
    });

    if (message) {
      message.textContent = `Đã tải ${result.data.length} ngành học từ hệ thống demo.`;
    }
  } catch (error) {
    majorSelect.innerHTML =
      '<option value="">Không tải được danh sách ngành</option>';

    if (message) {
      message.textContent = "Không thể kết nối API. Hãy kiểm tra backend.";
    }

    console.error("Load majors error:", error);
  }
}

function setupRegistrationForm() {
  const form = document.getElementById("admissionForm");
  const button = document.getElementById("applicationSubmit");
  const resultBox = document.getElementById("registrationResult");

  if (!form || !button || !resultBox) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    resultBox.hidden = true;
    resultBox.classList.remove("error");

    const formData = new FormData(form);

    const payload = {
      fullName: formData.get("fullName").trim(),
      phone: formData.get("phone").trim(),
      email: formData.get("email").trim(),
      highSchool: formData.get("highSchool").trim(),
      graduationYear: formData.get("graduationYear") || null,
      admissionMethod: formData.get("admissionMethod"),
      majorCode: formData.get("majorCode"),
      score: formData.get("score") || null
    };

    button.disabled = true;
    button.textContent = "Đang gửi hồ sơ...";

    try {
      const response = await fetch(`${ADMISSION_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Đăng ký không thành công.");
      }

      const data = result.data;

      resultBox.innerHTML = `
        <div class="result-title">
          <i data-lucide="check-circle"></i>
          Đăng ký hồ sơ thành công!
        </div>
        <p>Họ tên: <strong>${escapeHTML(data.fullName)}</strong></p>
        <p>Ngành đăng ký: <strong>${escapeHTML(data.major)}</strong></p>
        <p>Mã hồ sơ của bạn:</p>
        <div class="result-code">${escapeHTML(data.applicationCode)}</div>
        <p>Trạng thái: <strong>${escapeHTML(data.status)}</strong></p>
        <p>Hãy lưu mã hồ sơ để sử dụng chức năng tra cứu.</p>
      `;

      resultBox.hidden = false;

      const lookupInput = document.getElementById("lookupCode");
      if (lookupInput) {
        lookupInput.value = data.applicationCode;
      }
    } catch (error) {
      resultBox.classList.add("error");
      resultBox.innerHTML = `
        <div class="result-title">Không thể đăng ký hồ sơ</div>
        <p>${escapeHTML(error.message)}</p>
      `;
      resultBox.hidden = false;
    } finally {
      button.disabled = false;
      button.innerHTML = '<i data-lucide="send"></i> Gửi hồ sơ mô phỏng';

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  });
}

function setupLookupForm() {
  const form = document.getElementById("lookupForm");
  const button = document.getElementById("lookupSubmit");
  const resultBox = document.getElementById("lookupResult");

  if (!form || !button || !resultBox) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const code = document.getElementById("lookupCode").value.trim();

    if (!code) return;

    resultBox.hidden = true;
    resultBox.classList.remove("error");

    button.disabled = true;
    button.textContent = "Đang tra cứu...";

    try {
      const response = await fetch(
        `${ADMISSION_API}/lookup/${encodeURIComponent(code)}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Không tìm thấy hồ sơ.");
      }

      const data = result.data;

      resultBox.innerHTML = `
        <div class="result-title">
          <i data-lucide="clipboard-check"></i>
          Tra cứu thành công
        </div>
        <dl>
          <div>
            <dt>Mã hồ sơ</dt>
            <dd>${escapeHTML(data.application_code)}</dd>
          </div>
          <div>
            <dt>Họ và tên</dt>
            <dd>${escapeHTML(data.full_name)}</dd>
          </div>
          <div>
            <dt>Ngành đăng ký</dt>
            <dd>${escapeHTML(data.major_name)}</dd>
          </div>
          <div>
            <dt>Phương thức</dt>
            <dd>${escapeHTML(data.admission_method)}</dd>
          </div>
          <div>
            <dt>Điểm xét tuyển</dt>
            <dd>${data.score === null ? "Chưa cập nhật" : escapeHTML(data.score)}</dd>
          </div>
          <div>
            <dt>Trạng thái</dt>
            <dd>${escapeHTML(data.status)}</dd>
          </div>
          <div>
            <dt>Ngày tạo</dt>
            <dd>${escapeHTML(data.created_at)}</dd>
          </div>
        </dl>
      `;

      resultBox.hidden = false;
    } catch (error) {
      resultBox.classList.add("error");
      resultBox.innerHTML = `
        <div class="result-title">Không tìm thấy hồ sơ</div>
        <p>${escapeHTML(error.message)}</p>
        <p>Vui lòng kiểm tra lại mã hồ sơ.</p>
      `;

      resultBox.hidden = false;
    } finally {
      button.disabled = false;
      button.innerHTML = '<i data-lucide="search"></i> Tra cứu hồ sơ';

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  });
}
