import fetchBookReviews from "@/app/actions/fetchBookReviews";
import BookReviewsMobile from "@/components/Account/mobile/BookReviewsMobile";
const BookReviewsMobilePage = async () => {
  const dataBookReviews = await fetchBookReviews();
  return (
    <>
      <BookReviewsMobile bookReviews={dataBookReviews} />
    </>
  );
};

export default BookReviewsMobilePage;
