document.getElementById("advancedSearch").addEventListener("click", () => {
  document.getElementById("dates").innerHTML = `
        <div class="input-group col-sm-6">
                    <p class="col-sm-6">من</p>
                     <input type="date" class="form-control rounded" placeholder="بحث عن صنف محدد" aria-label="بحث" id="startDate"
                    aria-describedby="search-addon" name="start" value="<%= start ? (start !== '2023-01-01' ? start : '') : '' %>"/>
                        </div>
        <div class="input-group col-sm-6">
            <p class="col-sm-6">إلي</p>
            <input type="date" class="form-control rounded" placeholder="بحث عن صنف محدد" aria-label="بحث" id="endDate"
                aria-describedby="search-addon" name="end" value="<%= end ? (end !== '2023-01-01' ? end : '') : '' %>" />
                <button type="submit" class="btn btn-primary mx-1 rounded"> <i class="bi bi-search"></i> </button>
        </div>
    `;
});
