import fetchBookReviews from "@/app/actions/fetchBookReviews";
import BookReviewsMobile from "@/components/Account/mobile/BookReviewsMobile";
import { BookReviewStatus } from "@/types/bookreview.type";
export const dynamic = "force-dynamic";
export const revalidate = 0;
interface Params {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

const BookReviewsMobilePage = async ({ searchParams }: Params) => {
  const params = await searchParams;

  console.log("Params: ", params);

  const status = params?.status ?? "";
  const page = Number(params?.page ?? 1);
  const dataBookReviews = await fetchBookReviews({
    page,
    status: status as BookReviewStatus,
  });
  console.log("Status extracted:", status);
  console.log("Page extracted:", page);
  return (
    <>
      <BookReviewsMobile
        bookReviews={dataBookReviews}
        // fetchBookReviews={fetchBookReviews as VoidFunction}
        initialStatus={status}
        initialPage={page}
      />
    </>
  );
};

export default BookReviewsMobilePage;
