import { Card, Row, Space, Tag, Image } from "antd";
import category from ".";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import DetailItem from "../../components/DetailItem";
import { useEffect, useState } from "react";
import DefaultImg from "../../assets/images/default-img.png";
import { CategoryProps } from "../../types/category.types";
import myAxios from "../../helper/myAxios";
import { ErrorHandler } from "../../helper/handleError";
import { UserProperties } from "../../types/user.type";
import { FaEyeSlash, FaEye } from "react-icons/fa6";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<UserProperties | undefined>(
    undefined
  );
  const [role, setRole] = useState("");

  const fetchGenre = async () => {
    if (!id) return;
    try {
      const res = await myAxios.get(`users/${id}`);
      setDataUser(res.data.result);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const fetchRole = async () => {
    if (!dataUser?.roleId) return;

    try {
      const res = await myAxios.get(`roles/${dataUser?.roleId}`);
      const data = res.data.result;

      console.log("Data role: ", data);
      setDataUser({
        ...dataUser,
        roleName: data?.name,
      });
    } catch (error) {
      console.log("Error get role: ", error);
    }
  };

  const passLength = dataUser?.password?.length || 0;
  const star = "*".repeat(passLength);

  useEffect(() => {
    fetchGenre();
  }, [id]);
  useEffect(() => {
    fetchRole();
  }, [dataUser]);
  return (
    <>
      {" "}
      <HeaderPage
        icon="back"
        title="User Detail"
        breadcrumb={`Home / User / ${
          id?.length! > 20 ? id?.slice(0, 20) + "..." : id
        } / Detail`}
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Edit"
                onClick={() => navigate(`/user/${id}/edit`)}
              />
            </Space>
          </>
        }
      />
      <HeaderSection
        sectionTitle="User Information"
        sectionSubTitle="this section is for displaying detail information"
      >
        <Row justify={"center"}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              width: "200px",
              borderRadius: "50%",
              border: "2px solid gray",
              overflow: "hidden",
            }}
          >
            <Image src={dataUser?.profileImage?.imageUrl || DefaultImg} />
          </div>
        </Row>
        <Row justify={"space-around"} style={{ marginTop: 20 }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "30px" }}
          >
            <DetailItem label="Full Name" value={dataUser?.fullName} />
            <DetailItem label="Username" value={dataUser?.username} />
            <DetailItem
              label="Status"
              value={<Tag>{dataUser?.isActive ? "Active" : "Inactive"}</Tag>}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "30px" }}
          >
            <DetailItem label="Email" value={dataUser?.email} />
            <DetailItem label="Role" value={<Tag>{dataUser?.roleName}</Tag>} />
            <DetailItem
              label="Password"
              value={
                <>
                  <div className="flex gap-2 items-center">
                    <p>{isVisible ? dataUser?.password : star}</p>

                    <div
                      className="cursor-pointer"
                      onClick={() => setIsVisible((prev) => !prev)}
                    >
                      {isVisible ? <FaEye /> : <FaEyeSlash />}
                    </div>
                  </div>
                </>
              }
            />
          </div>
        </Row>
      </HeaderSection>
    </>
  );
};

export default UserDetail;
