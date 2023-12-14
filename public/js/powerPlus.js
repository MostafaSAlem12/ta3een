document.addEventListener("DOMContentLoaded", () => {
  console.log("asdgjasgd");
  const power = document.getElementById("power");
  const plus = document.getElementById("plus");

  power.addEventListener("input", () => {
    const plusValue = parseInt(Math.round(power.value * 0.1));
    plus.value = plusValue;
    document.getElementById("total").value = plusValue + parseInt(power.value);
  });
});
