import { Card, Image, Space, Tag } from "antd";
import category from ".";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";
import { data, useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import DetailItem, { Label } from "../../components/DetailItem";
import { useEffect, useState } from "react";
import { CategoryProps } from "../../types/category.types";
import myAxios from "../../helper/myAxios";
import { ErrorHandler } from "../../helper/handleError";
import { BookImage, BookProps } from "../../types/books.type";
import { styled } from "styled-components";
import { GenreProperties } from "../../types/genre.type";

const BookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataBook, setDataBook] = useState<BookProps | undefined>(undefined);
  const [dataCat, setDataCat] = useState<CategoryProps | undefined>(undefined);
  const fetchBook = async () => {
    if (!id) return;
    try {
      const res = await myAxios.get(`/books/${id}`);
      setDataBook(res.data.result);
      console.log("Data book: ", res.data.result);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchCat = async () => {
    if (!dataBook?.categoryId) return;
    try {
      const resCat = await myAxios.get(
        `/book-category/${dataBook?.categoryId}`
      );
      setDataCat(resCat.data);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchCat();
  }, [dataBook?.categoryId]);
  return (
    <>
      {" "}
      <HeaderPage
        icon="back"
        title="Detail Book"
        breadcrumb={`Home / Book / ${
          id?.length! > 20 ? id?.slice(0, 20) + "..." : id
        } / Detail`}
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Edit"
                onClick={() => navigate(`/book/${id}/edit`)}
              />
            </Space>
          </>
        }
      />
      <HeaderSection
        sectionTitle="Book Information"
        sectionSubTitle="this section is for displaying detail information"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div>
            <Label>Images</Label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {dataBook?.images?.map((item: BookImage) => (
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    overflow: "hidden",
                    border: "2px solid gray",
                  }}
                  key={item.bookId}
                >
                  <Image
                    style={{
                      objectFit: "cover",
                      width: "300px",
                      height: "300px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    src={item.imageUrl}
                  />
                </div>
              ))}
            </div>
          </div>
          <GridContainer>
            <DetailItem label="Title" value={dataBook?.title} />
            <DetailItem label="Author" value={dataBook?.author} />
            <DetailItem
              label="Price"
              value={`Rp ${Number(dataBook?.price).toLocaleString("id-ID")}`}
            />
            <DetailItem
              label="Book Type"
              value={<Tag>{dataBook?.book_type.toUpperCase()} </Tag>}
            />
            <DetailItem
              label="Book Category"
              value={<Tag>{dataCat?.name} </Tag>}
            />
            <DetailItem
              label="Genre"
              value={
                <div>
                  {Array.isArray(dataBook?.genres) ? (
                    <>
                      {dataBook.genres.map((item: any, index: any) => (
                        <Tag key={index}>{item.genre_title}</Tag>
                      ))}
                    </>
                  ) : (
                    <Tag>No Content</Tag>
                  )}
                </div>
              }
            />
            <DetailItem label="Status" value={<Tag>{dataBook?.status}</Tag>} />
          </GridContainer>
          <div>
            <Label>Description</Label>
            <div
              className="prose max-w-none prose-h1:text-black prose-h1:text-xl"
              dangerouslySetInnerHTML={{
                __html: dataBook?.description!,
              }}
            />
          </div>
        </div>
      </HeaderSection>
    </>
  );
};

export default BookDetail;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, auto));
  gap: 16px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;
