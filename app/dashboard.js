document.getElementById("planBtn").addEventListener("click", () => {
  const input = document.getElementById("taskInput").value;

  if (!input) {
    alert("Enter something first");
    return;
  }

  document.getElementById("confirmCard").style.display = "block";

  // Later this will call Gemini API
});
