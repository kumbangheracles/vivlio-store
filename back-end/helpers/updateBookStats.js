const { Book, BookStats } = require("../models/index");
async function updateBookStats(bookId, type, action = "add") {
  const stats = await BookStats.findOne({ where: { bookId } });

  if (!stats) {
    throw new Error("Invalid book Id");
  }

  if (type === "purchase") {
    if (action === "add") stats.purchaseCount += 1;
    else if (action === "remove" && stats.purchaseCount > 0) {
      stats.purchaseCount -= 1;
    }
  }

  if (type === "wishlist") {
    if (action === "add") stats.wishlistCount += 1;
    else if (action === "remove" && stats.wishlistCount > 0) {
      stats.wishlistCount -= 1;
    }
  }

  stats.popularityScore = stats.purchaseCount * 2 + stats.wishlistCount;
  await stats.save();

  const threshold = 50;
  await Book.update(
    { isPopular: stats.popularityScore >= threshold },
    { where: { id: bookId } }
  );

  return stats;
}

module.exports = { updateBookStats };
