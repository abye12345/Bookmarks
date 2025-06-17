// DOM Elements
const urlInput = document.getElementById("urlInput");
const addBookmarkBtn = document.getElementById("addBookmark");
const deleteAllBtn = document.getElementById("deleteAll");
const bookmarksContainer = document.getElementById("bookmarksContainer");

// Load bookmarks from localStorage
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

// Save bookmarks to localStorage
function saveBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// Create bookmark element
function createBookmarkElement(bookmark) {
  const bookmarkItem = document.createElement("div");
  bookmarkItem.className = "bookmark-item";
  bookmarkItem.innerHTML = `
    <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer">${
    bookmark.title || bookmark.url
  }</a>
    <div class="bookmark-actions">
      <button class="edit" title="Edit bookmark">Edit</button>
      <button class="delete" title="Delete bookmark">Delete</button>
    </div>
  `;

  // Add delete functionality
  bookmarkItem.querySelector(".delete").addEventListener("click", () => {
    bookmarks = bookmarks.filter((b) => b.url !== bookmark.url);
    saveBookmarks();
    bookmarkItem.remove();
    showNotification("Bookmark deleted successfully!");
  });

  // Add edit functionality
  bookmarkItem.querySelector(".edit").addEventListener("click", () => {
    const newUrl = prompt("Edit URL:", bookmark.url);
    if (newUrl) {
      try {
        const updatedUrl = new URL(newUrl);
        const newTitle = prompt("Edit title (optional):", bookmark.title || "");

        const index = bookmarks.findIndex((b) => b.url === bookmark.url);
        if (index !== -1) {
          bookmarks[index] = {
            url: updatedUrl.href,
            title: newTitle || updatedUrl.href,
          };
          saveBookmarks();

          const link = bookmarkItem.querySelector("a");
          link.href = updatedUrl.href;
          link.textContent = newTitle || updatedUrl.href;

          showNotification("Bookmark updated successfully!");
        }
      } catch (error) {
        showNotification(
          "Please enter a valid URL (http:// or https://)",
          "error"
        );
      }
    }
  });

  return bookmarkItem;
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => notification.classList.add("show"), 100);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add new bookmark
function addBookmark() {
  const url = urlInput.value.trim();

  if (!url) {
    showNotification("Please enter a URL", "error");
    return;
  }

  try {
    const validUrl = new URL(url);

    // Check if bookmark already exists
    if (bookmarks.some((b) => b.url === validUrl.href)) {
      showNotification("This bookmark already exists!", "error");
      return;
    }

    // Create new bookmark
    const bookmark = {
      url: validUrl.href,
      title: validUrl.hostname,
    };

    bookmarks.push(bookmark);
    saveBookmarks();

    const bookmarkElement = createBookmarkElement(bookmark);
    bookmarksContainer.appendChild(bookmarkElement);

    urlInput.value = "";
    showNotification("Bookmark added successfully!");
  } catch (error) {
    showNotification("Please enter a valid URL (http:// or https://)", "error");
  }
}

// Delete all bookmarks
function deleteAllBookmarks() {
  if (bookmarks.length === 0) {
    showNotification("No bookmarks to delete!", "error");
    return;
  }

  if (confirm("Are you sure you want to delete all bookmarks?")) {
    bookmarks = [];
    saveBookmarks();
    bookmarksContainer.innerHTML = "";
    showNotification("All bookmarks deleted successfully!");
  }
}

// Event Listeners
addBookmarkBtn.addEventListener("click", addBookmark);
urlInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addBookmark();
  }
});
deleteAllBtn.addEventListener("click", deleteAllBookmarks);

// Load existing bookmarks
bookmarks.forEach((bookmark) => {
  const bookmarkElement = createBookmarkElement(bookmark);
  bookmarksContainer.appendChild(bookmarkElement);
});
