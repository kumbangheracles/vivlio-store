import { Card, Space, Tag } from "antd";
import category from ".";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import DetailItem from "../../components/DetailItem";
import { useEffect, useState } from "react";
import { CategoryProps } from "../../types/category.types";
import myAxios from "../../helper/myAxios";
import { ErrorHandler } from "../../helper/handleError";
import { GenreProperties } from "../../types/genre.type";

const GenreDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataGenre, setDataGenre] = useState<GenreProperties | undefined>(
    undefined
  );

  const fetchGenre = async () => {
    if (!id) return;
    try {
      const res = await myAxios.get(`genres/${id}`);
      setDataGenre(res.data.result);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchGenre();
  }, [id]);
  return (
    <>
      {" "}
      <HeaderPage
        icon="back"
        title="Genre Detail"
        breadcrumb={`Home / Genre / ${
          id?.length! > 20 ? id?.slice(0, 20) + "..." : id
        } / Detail`}
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Edit"
                onClick={() => navigate(`/genre/${id}/edit`)}
              />
            </Space>
          </>
        }
      />
      <HeaderSection
        sectionTitle="Genre Information"
        sectionSubTitle="this section is for displaying detail information"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <DetailItem label="Title" value={dataGenre?.genre_title} />
          <DetailItem
            label="Status"
            value={<Tag>{dataGenre?.status ? "Active" : "Inactive"}</Tag>}
          />
          <DetailItem label="Description" value={dataGenre?.description} />
        </div>
      </HeaderSection>
    </>
  );
};

export default GenreDetail;
