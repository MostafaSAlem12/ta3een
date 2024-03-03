const addBtn = document.getElementById("addBtn");
const subBtn = document.getElementById("subBtn");
const fieldList = document.getElementById("fieldList");
const categories = JSON.parse(document.getElementById("categoriesField").value);
window.onload = function () {
  const length = fieldList.getElementsByTagName("li").length;
  if (length > 1) {
    subBtn.disabled = false;
  } else {
    subBtn.disabled = true;
  }
};
// const add = function (itemLength) {
//   itemLength++;
// };
addBtn.addEventListener("click", function () {
  const length = fieldList.getElementsByTagName("li").length;

  const li = document.createElement("li");
  console.log(categories);
  li.innerHTML += `                    <li class="row">
                        <div class="col-sm">
                            <div class="form-group form-floating mb-3">
                                <select class="form-select" name="categoryItems[${length}][name]" id="name" required>
                                    <option value="" hidden>اسم الصنف</option>
                                    ${categoriesLooping()}
                                </select>
                                <label for="name">اسم الصنف</label>
                            </div>
                        </div>
                        <div class="col-sm">
                            <div class="form-group form-floating mb-3">
                                <input type="number" min="0.001" step="0.001" id="amount" class="form-control"
                                    name="categoryItems[${length}][amount]" placeholder="الكمية" required>
                                <label for="amount">الكمية</label>
                            </div>
                        </div>
                    </li>
                    <li class="row mb-5">
                        <div class="form-group col">
                            <label>تاريخ الإنتاج</label>
                            <input type="date" class="form-control" name="categoryItems[${length}][production_date]">
                        </div>
                        <div class="form-group col">
                            <label>تاريخ الإنتهاء</label>
                            <input type="date" class="form-control" name="categoryItems[${length}][expiry_date]">
                        </div>
                                                      <hr style="margin-top: 25px;">
                    </li>
              
                    `;
  li.setAttribute("class", "row g-3");
  fieldList.appendChild(li);
  if (fieldList.getElementsByTagName("li").length > 1) {
    subBtn.disabled = false;
  } else {
    subBtn.disabled = true;
  }
});

subBtn.addEventListener("click", function () {
  const length = fieldList.getElementsByTagName("li").length;

  if (length > 1) {
    fieldList.removeChild(fieldList.lastElementChild);
  }
  if (fieldList.getElementsByTagName("li").length > 1) {
    subBtn.disabled = false;
  } else {
    subBtn.disabled = true;
  }
});

function categoriesLooping() {
  let list = [];
  console.log(categories);
  for (let category of categories) {
    list.push(`<option value="${category.name}">${category.name}</option>`);
  }
  return list;
}
