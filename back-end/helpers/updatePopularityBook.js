const { Book, UserWishlist } = require("../models/index");

async function updateBookPopularity(bookId) {
  try {
    const wishlistCount = await UserWishlist.count({
      where: { bookId },
    });

    console.log("BookId: ", bookId);
    console.log("Wishlistcount: ", wishlistCount);

    const threshold = 0;
    const isPopular = wishlistCount > threshold;

    // Update ke tabel Book
    await Book.update({ isPopular }, { where: { id: bookId } });

    console.log(
      `Book ${bookId} popularity updated → wishlistCount = ${wishlistCount}, isPopular = ${isPopular}`
    );
  } catch (error) {
    console.error("Error updating book popularity:", error);
  }
}

module.exports = { updateBookPopularity };
