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

const CategoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataCategory, setDataCategory] = useState<CategoryProps | undefined>(
    undefined
  );

  const fetchCategory = async () => {
    if (!id) return;
    try {
      const res = await myAxios.get(`book-category/${id}`);
      setDataCategory(res.data);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);
  return (
    <>
      {" "}
      <HeaderPage
        icon="back"
        title="Create New Category"
        breadcrumb={`Home / Category / ${
          id?.length! > 20 ? id?.slice(0, 20) + "..." : id
        } / Detail`}
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Edit"
                onClick={() => navigate(`/category/${id}/edit`)}
              />
            </Space>
          </>
        }
      />
      <HeaderSection
        sectionTitle="Category Information"
        sectionSubTitle="this section is for displaying detail information"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <DetailItem label="Name" value={dataCategory?.name || "No Content"} />
          <DetailItem
            label="Status"
            value={<Tag>{dataCategory?.status ? "Active" : "Inactive"}</Tag>}
          />
          <DetailItem
            label="Description"
            value={dataCategory?.description || "No Content"}
          />
        </div>
      </HeaderSection>
    </>
  );
};

export default CategoryDetail;
