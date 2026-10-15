const functionSelect = document.getElementById("functionSelect");
const inputFields = document.getElementById("inputFields");
const calculatorForm = document.getElementById("calculatorForm");
const result = document.getElementById("result");

const fieldConfigs = {
  1: [
    { name: "a", label: "Cạnh a", placeholder: "Nhập cạnh a", min: "0", step: "any" },
    { name: "b", label: "Cạnh b", placeholder: "Nhập cạnh b", min: "0", step: "any" },
    { name: "c", label: "Cạnh c", placeholder: "Nhập cạnh c", min: "0", step: "any" }
  ],
  2: [{ name: "x", label: "Số nguyên x", placeholder: "Nhập một số nguyên", step: "1" }],
  3: [{ name: "n", label: "Số nguyên n", placeholder: "Nhập n", step: "1" }],
  4: [{ name: "n", label: "Số nguyên n", placeholder: "Nhập n", step: "1" }],
  5: [
    { name: "thang", label: "Tháng", placeholder: "1–12", min: "1", max: "12", step: "1" },
    { name: "nam", label: "Năm", placeholder: "Ví dụ: 2026", min: "1", step: "1" }
  ],
  6: [
    { name: "x", label: "Số x", placeholder: "Nhập số nguyên x", step: "1" },
    { name: "y", label: "Số y", placeholder: "Nhập số nguyên y", step: "1" }
  ],
  7: [
    { name: "a", label: "Số nguyên a", placeholder: "Nhập a", step: "1" },
    { name: "b", label: "Số nguyên b", placeholder: "Nhập b", step: "1" }
  ]
};

function renderFields() {
  const config = fieldConfigs[functionSelect.value];
  inputFields.innerHTML = config.map(field => `
    <div class="field">
      <label for="${field.name}">${field.label}</label>
      <input
        id="${field.name}"
        name="${field.name}"
        type="number"
        ${field.min !== undefined ? `min="${field.min}"` : ""}
        ${field.max !== undefined ? `max="${field.max}"` : ""}
        step="${field.step || "1"}"
        placeholder="${field.placeholder}"
        required
      >
    </div>
  `).join("");
  showResult("Chọn chức năng và nhập dữ liệu để bắt đầu.");
}

function showResult(message, isError = false) {
  result.classList.toggle("error", isError);
  result.innerHTML = `<span class="result-label">${isError ? "CẦN KIỂM TRA" : "KẾT QUẢ"}</span><p>${message}</p>`;
}

function getNumber(data, name) {
  return Number(data.get(name));
}

function isInteger(value) {
  return Number.isInteger(value);
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

function isPerfectSquare(n) {
  if (n < 0) return false;
  const root = Math.floor(Math.sqrt(n));
  return root * root === n;
}

function calculate(event) {
  event.preventDefault();
  const data = new FormData(calculatorForm);
  const choice = functionSelect.value;
  const v = Object.fromEntries([...data.entries()].map(([key, value]) => [key, Number(value)]));

  if (Object.values(v).some(value => !Number.isFinite(value))) {
    showResult("Vui lòng nhập dữ liệu hợp lệ.", true);
    return;
  }

  if (["2", "3", "4", "5", "6", "7"].includes(choice) &&
      Object.values(v).some(value => !isInteger(value))) {
    showResult("Chức năng này yêu cầu nhập số nguyên.", true);
    return;
  }

  switch (choice) {
    case "1": {
      const { a, b, c } = v;
      if (a <= 0 || b <= 0 || c <= 0 || a + b <= c || a + c <= b || b + c <= a) {
        showResult("Ba cạnh phải dương và thỏa mãn điều kiện tạo thành tam giác.", true);
        return;
      }
      const p = (a + b + c) / 2;
      const area = Math.sqrt(p * (p - a) * (p - b) * (p - c));
      showResult(`Diện tích tam giác là <strong>${area.toLocaleString("vi-VN", { maximumFractionDigits: 4 })}</strong> (đơn vị diện tích).`);
      break;
    }
    case "2": {
      const { x } = v;
      showResult(isPerfectSquare(x)
        ? `${x} là số chính phương.`
        : `${x} không phải là số chính phương.`);
      break;
    }
    case "3": {
      const { n } = v;
      if (n < 0) {
        showResult("Vui lòng nhập n không âm.", true);
        return;
      }
      // Đếm các số chính phương không âm nhỏ hơn n, giống vòng lặp từ 0 đến n - 1.
      const count = n <= 1 ? 0 : Math.ceil(Math.sqrt(n));
      showResult(`Có <strong>${count}</strong> số chính phương nhỏ hơn ${n}.`);
      break;
    }
    case "4": {
      const { n } = v;
      if (n <= 0) {
        showResult("Vui lòng nhập n là số nguyên dương.", true);
        return;
      }
      let sum = 0;
      for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          sum += i;
          if (i !== n / i) sum += n / i;
        }
      }
      showResult(`Tổng các ước dương của ${n} là <strong>${sum}</strong>.`);
      break;
    }
    case "5": {
      const { thang, nam } = v;
      if (thang < 1 || thang > 12 || nam < 1) {
        showResult("Tháng phải từ 1 đến 12 và năm phải lớn hơn 0.", true);
        return;
      }
      const leap = (nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0;
      const days = thang === 2 ? (leap ? 29 : 28) :
        ([4, 6, 9, 11].includes(thang) ? 30 : 31);
      showResult(`Tháng ${thang} năm ${nam} có <strong>${days} ngày</strong>.`);
      break;
    }
    case "6": {
      const { x, y } = v;
      showResult(`Sau khi đổi chỗ: <strong>x = ${y}, y = ${x}</strong>.`);
      break;
    }
    case "7": {
      const { a, b } = v;
      if (a === 0 && b === 0) {
        showResult("Không xác định UCLN và BCNN của hai số đều bằng 0 theo quy ước thông thường.", true);
        return;
      }
      const u = gcd(a, b);
      const l = u === 0 ? 0 : Math.abs((a / u) * b);
      showResult(`UCLN(${a}, ${b}) = <strong>${u}</strong><br>BCNN(${a}, ${b}) = <strong>${l}</strong>.`);
      break;
    }
  }
}

functionSelect.addEventListener("change", renderFields);
calculatorForm.addEventListener("submit", calculate);
renderFields();
