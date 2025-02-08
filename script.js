document.getElementById("demo1").addEventListener("click", () => {
  const urlInput = document.getElementById("demo2");
  const url = urlInput.value.trim();
  try {
    const validUrl = new URL(url);
    const bookmarkItem = document.createElement("div");
    bookmarkItem.className = "bookmark-item";
    bookmarkItem.innerHTML = `
            <a href="${validUrl.href}" target="_blank">${validUrl.href}</a>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          `;
    // Add delete functionality
    bookmarkItem.querySelector(".delete").addEventListener("click", () => {
      bookmarkItem.remove();
    });
    // Add edit functionality
    bookmarkItem.querySelector(".edit").addEventListener("click", () => {
      const link = bookmarkItem.querySelector("a");
      const newUrl = prompt("Edit URL:", link.href);

      if (newUrl) {
        try {
          const updatedUrl = new URL(newUrl);
          link.href = updatedUrl.href;
          link.textContent = updatedUrl.href;
        } catch (error) {
          alert("Please enter a valid URL (http:// or https://)");
        }
      }
    });
    document.getElementById("demo3").appendChild(bookmarkItem);
    urlInput.value = "";
  } catch (error) {
    alert("Please enter a valid URL starting with http:// or https://");
  }
});
// Delete All functionality
document.getElementById("demo4").addEventListener("click", () => {
  document.getElementById("demo3").innerHTML = "";
});
