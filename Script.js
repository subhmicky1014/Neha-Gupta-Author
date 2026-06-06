const defaultReviews = [
  {
    name: "A Kindle Reader",
    rating: 5,
    text: "A heartfelt read with emotion, dreams, and a memorable voice."
  },
  {
    name: "Book Lover",
    rating: 5,
    text: "Neha Gupta writes with sincerity. I am waiting for the next books."
  }
];

const reviewsKey = "neha-gupta-book-reviews";
const reviewsList = document.getElementById("reviewsList");
const reviewForm = document.getElementById("reviewForm");
const coverUpload = document.getElementById("coverUpload");
const authorUpload = document.getElementById("authorUpload");
const coverPreview = document.getElementById("coverPreview");
const authorPreview = document.getElementById("authorPreview");

document.getElementById("year").textContent = new Date().getFullYear();

function getReviews() {
  const saved = localStorage.getItem(reviewsKey);
  return saved ? JSON.parse(saved) : defaultReviews;
}

function saveReviews(reviews) {
  localStorage.setItem(reviewsKey, JSON.stringify(reviews));
}

function renderReviews() {
  reviewsList.innerHTML = "";
  getReviews().forEach((review) => {
    const card = document.createElement("article");
    card.className = "review-card";
    card.innerHTML = `
      <div class="review-top">
        <strong>${escapeHtml(review.name)}</strong>
        <span class="stars" aria-label="${review.rating} star rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
      </div>
      <p>${escapeHtml(review.text)}</p>
    `;
    reviewsList.appendChild(card);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function previewImage(input, target) {
  const file = input.files && input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    target.innerHTML = `<img src="${reader.result}" alt="">`;
  });
  reader.readAsDataURL(file);
}

reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nextReview = {
    name: document.getElementById("reviewName").value.trim(),
    rating: Number(document.getElementById("reviewRating").value),
    text: document.getElementById("reviewText").value.trim()
  };

  if (!nextReview.name || !nextReview.text) return;

  const reviews = [nextReview, ...getReviews()];
  saveReviews(reviews);
  renderReviews();
  reviewForm.reset();
});

coverUpload.addEventListener("change", () => previewImage(coverUpload, coverPreview));
authorUpload.addEventListener("change", () => previewImage(authorUpload, authorPreview));

renderReviews();
