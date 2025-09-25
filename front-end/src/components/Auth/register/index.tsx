"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Input,
  Divider,
  Menu,
  Select,
  Flex,
  message,
  InputNumber,
} from "antd";
import styled from "styled-components";
import { InputOTP } from "antd-input-otp";
import { initialUser, type UserProperties } from "../../../types/user.type";
import {
  FacebookFilled,
  GoogleCircleFilled,
  InstagramFilled,
  LoadingOutlined,
  TwitterCircleFilled,
} from "@ant-design/icons";
import AOS from "aos";
interface OptionProps {
  id: number;
  label: string;
}
import { EUserRole } from "../../../types/user.type";

import { RoleProperties } from "../../../types/role.type";
import { useRouter } from "next/navigation";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
const RegisterForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<EUserRole | null>(null);
  const [user, setUser] = useState<UserProperties>(initialUser);
  const [dataRole, setDataRole] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isEmpty = (val?: string) =>
    !val || val.trim() === "" || val === undefined;
  const isEmptyRole = (val: number | string) => !val;
  const navigate = useRouter();

  const fetchRole = async () => {
    try {
      const res = await myAxios.get("/roles");
      const data = res.data.results;
      console.log("data roles: ", data);
      setDataRole(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchRole();
  }, []);
  const roleOptions = Array.isArray(dataRole)
    ? dataRole.map((role: RoleProperties) => ({
        label: role.name,
        value: role.id,
      }))
    : [];

  const handleSubmit = async (userData: UserProperties) => {
    try {
      setLoading(true);
      const body: UserProperties = {
        // id: ,
        fullName: userData.fullName,
        username: userData.username,
        password: userData.password,
        email: userData.email,
        confirmPassword: userData.confirmPassword,
        roleId: userData.roleId,
      };
      console.log("BOdy:", body);
      localStorage.setItem("email", body.email!);
      const res = await myAxios.post("auth/register", body);
      if (res) {
        navigate.push("/register/verification-code");
      }
      console.log("Data terkirim: ", res.data);

      // setUser(res.data);

      message.success(
        "Success Registration! Please check your email for verification code."
      );
    } catch (error) {
      console.log(error);
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const submitted = (data: UserProperties) => {
    if (
      isEmpty(data.fullName) ||
      isEmpty(data.username) ||
      isEmpty(data.email) ||
      isEmptyRole(data.roleId!) ||
      isEmpty(data.password) ||
      isEmpty(data.confirmPassword)
    ) {
      message.error("All fields are required");
      console.log("All fields are required");
      return;
    }

    if (data.password!.length < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }

    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!regex.test(data.password!)) {
      message.error("Password must include alphabet and numeric");
      return;
    }

    if (data.password !== data.confirmPassword) {
      message.error("Passwords not match");
      return;
    }
    handleSubmit(data);
  };

  useEffect(() => {
    AOS.init();
  });
  return (
    <>
      <Container data-aos="fade-up">
        <CardRegister className="shadow-md">
          <WrapperHeader>
            <TitleRegister>Sign up</TitleRegister>
            <WrapperDeviderTop>
              <Divider
                style={{ marginBlock: "1rem", border: "1px solid gray" }}
              />
              <p>WITH EMAIL</p>
            </WrapperDeviderTop>
          </WrapperHeader>
          <Form
            layout="vertical"
            style={{ letterSpacing: 1 }}
            onFinish={() => submitted(user!)}
          >
            <Form.Item
              style={{ marginBlock: "10px" }}
              required={true}
              label="Full Name"
              name={"fullName"}
            >
              <Input
                variant="filled"
                required={true}
                onChange={(e) => {
                  setUser({
                    ...user,
                    fullName: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBlock: "10px" }}
              required={true}
              label="Username"
              name={"username"}
            >
              <Input
                variant="filled"
                required={true}
                onChange={(e) => {
                  setUser({
                    ...user,
                    username: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Flex style={{ display: "flex" }} gap={20}>
              <Form.Item
                required={true}
                label="Email"
                name={"email"}
                style={{ width: "100%" }}
                rules={[
                  { required: true, message: "Email is required " },
                  { type: "email", message: "invalid format" },
                ]}
              >
                <Input
                  variant="filled"
                  type="email"
                  required={true}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      email: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                required={true}
                label="Role"
                style={{ width: "60%", letterSpacing: 1 }}
                name={"roleId"}
              >
                <Select
                  variant="filled"
                  value={selectedRole}
                  onChange={(value) => {
                    setSelectedRole(value);
                    setUser({
                      ...user,
                      roleId: value,
                    });
                  }}
                  options={roleOptions}
                  placeholder="Select role"
                />
              </Form.Item>
            </Flex>

            <Form.Item
              style={{ marginBottom: "5px", marginTop: "-5px" }}
              required={true}
              label="Password"
              name={"password"}
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "6 character are needed" },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                  message: "Password must include alphabet and numeric",
                },
              ]}
            >
              <Input.Password
                variant="filled"
                type="password"
                required={true}
                onChange={(e) => {
                  setUser({
                    ...user,
                    password: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBlock: "10px" }}
              required={true}
              label="Confirm Password"
              name={"confirmPassword"}
              rules={[
                { required: true, message: "Confirm password is required" },
                { min: 6, message: "6 character are needed" },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                  message: "Password must include alphabet and numeric",
                },
              ]}
            >
              <Input.Password
                variant="filled"
                type="password"
                required={true}
                onChange={(e) => {
                  setUser({
                    ...user,
                    confirmPassword: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Button
              style={{
                width: "100%",
                backgroundColor: "#7badff",
                fontWeight: "700",
                color: "white",
                padding: 20,
                marginTop: "10px",
              }}
              onClick={() => {
                handleSubmit(user!);
                // setOpenModalVerif(true);
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingOutlined />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Form>
          <div>
            <WrapperDeviderBot>
              <Divider
                style={{ marginBlock: "1rem", border: "1px solid gray" }}
              />
              <p>OR</p>
            </WrapperDeviderBot>
            <ListIcon>
              <ButtonIcon>
                <FacebookFilled style={{ fontSize: "25px" }} />
              </ButtonIcon>
              <ButtonIcon>
                <GoogleCircleFilled style={{ fontSize: "25px" }} />
              </ButtonIcon>
              <ButtonIcon>
                <TwitterCircleFilled style={{ fontSize: "25px" }} />
              </ButtonIcon>
            </ListIcon>
          </div>

          <WrapperSignIn>
            <p>Already have account?</p>
            <p
              style={{ color: "#7badff", cursor: "pointer" }}
              onClick={() => navigate.push("/auth/login")}
            >
              Sign In
            </p>
          </WrapperSignIn>
        </CardRegister>
      </Container>
    </>
  );
};

export default RegisterForm;

const TitleRegister = styled.h1`
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 1px;
  text-align: center;
`;

const FooterModalOtp = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  letter-spacing: 1px;
  justify-content: center;
`;

const ButtonIcon = styled(Button)`
  padding: 16px;
  width: 100%;
  color: grey;
`;

const ButtonModal = styled(Button)`
  letter-spacing: 1px;
  width: 100%;
`;

const ListIcon = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 5px;

  justify-content: center;
`;
const CardRegister = styled(Card)`
  width: 450px;
  margin: 1rem;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

const WrapperDeviderTop = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  p {
    letter-spacing: 1px;
    font-weight: 700;
    font-size: 12px;
    color: grey;
    position: absolute;
    left: 38%;
    padding: 10px;
    bottom: -2px;
    background-color: white;
  }
`;
const WrapperDeviderBot = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  margin-top: 10px;

  p {
    letter-spacing: 1px;
    font-weight: 700;
    font-size: 12px;
    color: grey;
    position: absolute;
    left: 45%;
    padding: 10px;
    bottom: -2px;
    background-color: white;
  }
`;

const WrapperSignIn = styled.div`
  display: flex;
  letter-spacing: 1px;
  padding: 10px;
  justify-content: center;
  gap: 10px;
`;

const WrapperHeader = styled.div``;
