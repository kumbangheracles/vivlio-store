import { Image, Space, Tag } from "antd";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import DetailItem, { Label } from "../../components/DetailItem";
import { useEffect, useState } from "react";
import myAxios from "../../helper/myAxios";
import { ErrorHandler } from "../../helper/handleError";
import { styled } from "styled-components";
import DefaultImg from "../../assets/images/default-img.png";
import { ArticleImage, ArticleProperties } from "../../types/article.type";

const ArticleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataArticle, setDataArticle] = useState<ArticleProperties | undefined>(
    undefined
  );
  const fetchArticle = async () => {
    if (!id) return;
    try {
      const res = await myAxios.get(`/articles/${id}`);
      setDataArticle(res.data.result);
      console.log("Data article: ", res.data.result);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const src = dataArticle?.articleImages?.imageUrl || DefaultImg;

  return (
    <>
      {" "}
      <HeaderPage
        icon="back"
        title="Detail Article"
        breadcrumb={`Home / Article / ${
          id?.length! > 20 ? id?.slice(0, 20) + "..." : id
        } / Detail`}
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Edit"
                onClick={() => navigate(`/article/${id}/edit`)}
              />
            </Space>
          </>
        }
      />
      <HeaderSection
        sectionTitle="Article Information"
        sectionSubTitle="this section is for displaying detail information"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div>
            <Label>Images</Label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  overflow: "hidden",
                  border: "2px solid gray",
                }}
              >
                <Image
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  src={src}
                />
              </div>
            </div>
          </div>
          <GridContainer>
            <DetailItem label="Title" value={dataArticle?.title} />

            <DetailItem
              label="Status"
              value={<Tag>{dataArticle?.status}</Tag>}
            />
          </GridContainer>
          <div>
            <Label>Description</Label>
            <div
              className="prose max-w-none prose-h1:text-black prose-h1:text-xl"
              dangerouslySetInnerHTML={{
                __html: dataArticle?.description ?? "",
              }}
            />
          </div>
        </div>
      </HeaderSection>
    </>
  );
};

export default ArticleDetail;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, auto));
  gap: 16px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;
