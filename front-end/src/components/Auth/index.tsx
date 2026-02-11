"use client";
import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form, Input, Divider, message, Button, Card } from "antd";
import {
  LoadingOutlined,
  FacebookFilled,
  GoogleCircleFilled,
  TwitterCircleFilled,
} from "@ant-design/icons";
import styled from "styled-components";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";

interface LoginFormState {
  identifier: string;
  password: string;
  error: string;
}

interface LoginFormValues {
  identifier: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { handleReplaceRoute, handlePushRoute } = useGlobalLoadingBar();

  const [formState, setFormState] = useState<LoginFormState>({
    identifier: "herkalsuper@admin.com",
    password: "superadmin123",
    error: "",
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setFormState((prev) => ({ ...prev, error: "" }));

    try {
      console.log("Attempting login with:", { identifier: values.identifier });

      const result = await signIn("credentials", {
        identifier: values.identifier,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setFormState((prev) => ({
          ...prev,
          error: "Login failed. Please check your credentials.",
        }));
        message.error("Login failed. Please check your credentials.");
      } else if (result?.ok) {
        const session = await getSession();
        console.log("Login successful:", session);
        message.success("Login Success, Welcome to ViviBook!!.");
        handleReplaceRoute("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormState((prev) => ({
        ...prev,
        error: "An error occurred during login",
      }));
      message.error("An error occurred during login");
    } finally {
      setLoading(false);
      navigate.refresh();
    }
  };

  const handleSubmitFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill in all required fields correctly");
  };

  return (
    <>
      <Container>
        <CardRegister className="shadow-md">
          <WrapperHeader>
            <TitleRegister>Sign in</TitleRegister>
            <WrapperDeviderTop>
              <Divider
                style={{ marginBlock: "1rem", border: "1px solid gray" }}
              />
              <p>WITH EMAIL OR USERNAME</p>
            </WrapperDeviderTop>
          </WrapperHeader>

          {formState.error && (
            <div
              style={{
                color: "red",
                marginBottom: "16px",
                padding: "8px",
                backgroundColor: "#ffe6e6",
                borderRadius: "4px",
              }}
            >
              {formState.error}
            </div>
          )}

          <Form
            form={form}
            layout="vertical"
            style={{ letterSpacing: 1 }}
            onFinish={handleSubmit}
            onFinishFailed={handleSubmitFailed}
            initialValues={{
              identifier: formState.identifier,
              password: formState.password,
            }}
          >
            <Form.Item
              style={{ marginBlock: "10px" }}
              label="Email or Username"
              name="identifier"
              rules={[
                { required: true, message: "Email or Username is required" },
              ]}
            >
              <Input
                variant="filled"
                placeholder="Enter your email or username"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "5px", marginTop: "-5px" }}
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "6 characters are needed" },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                  message: "Password must include alphabet and numeric",
                },
              ]}
            >
              <Input.Password
                variant="filled"
                placeholder="Enter your password"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: "10px" }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: loading ? "#ccc" : "#7badff",
                  fontWeight: "700",
                  color: "white",
                  padding: 20,
                  borderRadius: 5,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingOutlined style={{ marginRight: 8 }} />
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </Form.Item>
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
            <p>Don't have account?</p>
            <p
              style={{ color: "#7badff", cursor: "pointer" }}
              onClick={() => handlePushRoute("/auth/register")}
            >
              Sign Up
            </p>
          </WrapperSignIn>
        </CardRegister>
      </Container>
    </>
  );
};

export default LoginForm;

const TitleRegister = styled.h1`
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 1px;
  text-align: center;
  @media (min-width: 720px) {
    font-size: 24px;
  }
`;

const ButtonIcon = styled(Button)`
  padding: 16px;
  width: 100%;
  color: grey;
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
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  padding: 10px;
  @media (min-width: 720px) {
    padding: 0;
  }
`;

const WrapperDeviderTop = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  p {
    letter-spacing: 1px;
    font-weight: 700;
    font-size: 10px;
    color: grey;
    position: absolute;
    left: 20%;
    padding: 10px;
    bottom: -2px;
    background-color: white;

    @media (min-width: 720px) {
      font-size: 12px;
      left: 27%;
    }
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
    font-size: 10px;
    color: grey;
    position: absolute;
    left: 45%;
    padding: 10px;
    bottom: -2px;
    background-color: white;
  }

  @media (min-width: 720px) {
    font-size: 12px;
  }
`;

const WrapperSignIn = styled.div`
  display: flex;
  letter-spacing: 1px;
  padding: 10px;
  justify-content: center;
  gap: 10px;
  font-size: 12px;

  @media (min-width: 720px) {
    font-size: 14px;
  }
`;

const WrapperHeader = styled.div``;
