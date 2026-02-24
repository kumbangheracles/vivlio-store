const { Book, UserWishlist, UserPurchases } = require("../models/index");

async function updateBookPopularity(bookId) {
  try {
    const wishlistCount = await UserWishlist.count({
      where: { bookId },
    });
    const userPurchaseCount = await UserPurchases.count({
      where: { bookId },
    });

    console.log("BookId: ", bookId);
    console.log("Wishlistcount: ", wishlistCount);

    const threshold = 5;
    const isPopular = wishlistCount || userPurchaseCount > threshold;

    await Book.update({ isPopular }, { where: { id: bookId } });

    console.log(
      `Book ${bookId} popularity updated → wishlistCount = ${wishlistCount}, isPopular = ${isPopular}`,
    );
  } catch (error) {
    console.error("Error updating book popularity:", error);
  }
}
async function updateBookPopularityWithTransaction(bookId, transaction) {
  try {
    const wishlistCount = await UserWishlist.count({
      where: { bookId },
    });
    const userPurchaseCount = await UserPurchases.count({
      where: { bookId },
    });

    console.log("BookId: ", bookId);
    console.log("Wishlistcount: ", wishlistCount);

    const threshold = 5;
    const isPopular = wishlistCount || userPurchaseCount > threshold;

    await Book.update(
      { isPopular },
      {
        where: { id: bookId },
        transaction,
      },
    );

    console.log(
      `Book ${bookId} popularity updated → wishlistCount = ${wishlistCount}, isPopular = ${isPopular}`,
    );
  } catch (error) {
    console.error("Error updating book popularity:", error);
  }
}

module.exports = { updateBookPopularity, updateBookPopularityWithTransaction };
