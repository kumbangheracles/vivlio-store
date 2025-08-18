"use client";
import { Button, Card, Divider, Form, Input, Modal } from "antd";
import HeaderPage from "../HeaderPage";
import Image from "next/image";
import styled from "styled-components";
import DefaultImage from "../../assets/images/profile-default.jpg";
import AppButton from "../AppButton";
import DetailItem from "../DetailItem";
import { useEffect, useState } from "react";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { UserProperties } from "@/types/user.type";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";

type FieldKey = "fullName" | "username" | "email" | "password" | "";

interface PropsType {
  dataUser?: UserProperties;
}

const Account = ({ dataUser }: PropsType) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<FieldKey>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [dataUser, setDataUser] = useState<UserProperties>();

  // const fetchUser = async () => {
  //   if (!auth.session) return;

  //   try {
  //     setLoading(true);
  //     const res = await myAxios.get(`/users/${auth.user?.id}`);
  //     // console.log("Data user: ", res.data.result);

  //     setDataUser(res.data.result);
  //   } catch (error) {
  //     ErrorHandler(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchUser();
  // }, [auth.user?.id]);

  const handleModalOpen = (key: FieldKey) => {
    setModalOpen(true);
    setActiveKey(key);
    console.log("Key: ", key);
  };

  const fieldMap: Record<FieldKey, { label: string; name: string }> = {
    fullName: { label: "Full Name", name: "fullName" },
    username: { label: "Username", name: "username" },
    email: { label: "Email", name: "email" },
    password: { label: "Password", name: "password" },
    "": {
      label: "",
      name: "",
    },
  };
  return (
    <Card className="shadow-md">
      <TitleTab>Account Setting</TitleTab>
      <CardStyled>
        <PictureSide>
          <ImageWrapper>
            <Image
              src={DefaultImage}
              width={100}
              height={100}
              alt="default-image"
            />
          </ImageWrapper>

          <AppButton label="Change Profile Photo" />
        </PictureSide>

        <DataSide>
          {/* <h1 className="setting-title">Account Settings</h1> */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center w-full justify-between">
              <DetailItem label="Full Name" value={dataUser?.fullName} />
              <EditOutlined onClick={() => handleModalOpen("fullName")} />
            </div>
            <div className="flex items-center w-full justify-between">
              <DetailItem label="Username" value={dataUser?.username} />
              <EditOutlined onClick={() => handleModalOpen("username")} />
            </div>
            <div className="flex items-center w-full justify-between">
              <DetailItem label="Email" value={dataUser?.email} />
              <EditOutlined onClick={() => handleModalOpen("email")} />
            </div>
            <div className="flex items-center w-full justify-between">
              <DetailItem label="Password" value="**********" />
              <EditOutlined onClick={() => handleModalOpen("password")} />
            </div>
          </div>
        </DataSide>
      </CardStyled>

      <Modal
        key={activeKey}
        onCancel={() => setModalOpen(false)}
        open={modalOpen}
        footer={
          <div className="w-full">
            <AppButton
              className="w-full"
              style={{ height: 40 }}
              label="Save"
              customColor="primary"
            />
          </div>
        }
      >
        <Form layout="vertical">
          {activeKey === "password" && (
            <Form.Item
              label="Old Password"
              name={"oldPassword"}
              required={true}
            >
              <Input.Password
                variant="filled"
                style={{ height: "50px" }}
                placeholder="Input Old Password . . ."
              />
            </Form.Item>
          )}
          <Form.Item
            label={fieldMap[activeKey]?.label}
            name={fieldMap[activeKey]?.name}
            required={true}
          >
            {activeKey === "password" ? (
              <Input.Password
                variant="filled"
                style={{ height: "50px" }}
                placeholder={`Input New ${fieldMap[activeKey]?.label} . . .`}
              />
            ) : (
              <Input
                variant="filled"
                style={{ height: "50px" }}
                placeholder={`Input New ${fieldMap[activeKey]?.label} . . .`}
              />
            )}
          </Form.Item>

          {activeKey === "password" && (
            <Form.Item
              label="Confirm Password"
              name={"confirmPassword"}
              required={true}
            >
              <Input.Password
                variant="filled"
                style={{ height: "50px" }}
                placeholder="Confirm New Password . . ."
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default Account;

const PictureSide = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  width: 50%;
`;

const CardStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  /* border: 1px solid black; */
`;

const TitleTab = styled.h1`
  font-weight: 500;
  font-size: 20px;
`;

const ImageWrapper = styled.div`
  border-radius: 50%;
  width: 130px;
  height: 130px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
`;

const DataSide = styled.div`
  padding: 1rem;
  width: 50%;

  .setting-title {
    padding: 1rem;
    font-weight: 500;
    font-size: 19px;
  }
`;
