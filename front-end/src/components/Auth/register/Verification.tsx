"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form, message, Modal, Statistic } from "antd";
import { InputOTP } from "antd-input-otp";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { styled } from "styled-components";
import dayjs from "dayjs";
import AOS from "aos";
import { useRouter } from "next/navigation";
import myAxios from "@/libs/myAxios";
const Verification: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [verifCode, setVerifCode] = useState<string[]>([]);
  const navigate = useRouter();
  const email = localStorage.getItem("email");
  const deadline = dayjs().add(1, "minutes").valueOf();
  console.log("current email: ", email);
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await myAxios.post("/auth/resend-code-verification", {
        email: email,
      });
      message.success("Resend code success");
      console.log("Code Otp: ", res.data);
    } catch (error: any) {
      console.log(error);
      const backendMsg =
        error?.response?.data?.message ||
        "Resend code failed! Please try again later";
      console.log("Error from backend:", backendMsg);
      message.error(backendMsg);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   setLoading(true);
  // }, []);

  const handleSubmitOtp = async (data: string[]) => {
    if (data.length === 0) {
      message.error("Verification code are required!!");
      return;
    }
    if (data.length < 6) {
      message.error("Invalid verification code!");
      return;
    }
    try {
      setLoading(true);

      const verificationCode = data.join("");
      console.log("Verification Code: ", verificationCode);
      const res = await myAxios.post("/auth/verify-email", {
        email: email,
        verificationCode: verificationCode,
      });
      console.log("Code sended:", res.data);
      message.success("Verification Success!!");
      if (res) {
        setTimeout(() => {
          navigate.push("/login");
        }, 1000);
      }
      localStorage.removeItem("email");
    } catch (error: any) {
      console.log(error);
      const backendMsg =
        error?.response?.data?.message ||
        "Verification Failed! Please try again later";
      console.log("Error from backend:", backendMsg);
      message.error(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init();
  });
  return (
    <>
      <CardVerification
        className="shadow-md"
        data-aos="fade-up"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <Form.Item>
          <h1
            style={{
              fontWeight: "600",
              textAlign: "center",
              padding: "12px",
              fontSize: "20px",
              letterSpacing: "1px",
            }}
          >
            Input verification code
          </h1>
          <InputOTP
            inputType="numeric"
            wrapperStyle={{}}
            value={verifCode}
            inputStyle={{ padding: "1rem" }}
            onChange={(value) => {
              setVerifCode(value);
            }}
          />

          <FooterModalOtp>
            <ButtonModal
              style={{ cursor: loading ? "waite" : "pointer " }}
              onClick={() => handleResendOtp()}
            >
              {" "}
              {loading ? (
                <>
                  <div
                    className="flex gap-[10px]"
                    style={{ fontSize: "20px", color: "gray" }}
                  >
                    <LoadingOutlined />
                    <Statistic.Countdown
                      value={deadline}
                      format="mm:ss"
                      onFinish={() => {
                        console.log("Waktu habis!");
                      }}
                    />
                  </div>
                </>
              ) : (
                "Resend code"
              )}
            </ButtonModal>

            <ButtonModal
              type="primary"
              onClick={() => handleSubmitOtp(verifCode!)}
            >
              Ok
            </ButtonModal>
          </FooterModalOtp>
        </Form.Item>
        {/* </Modal> */}
      </CardVerification>
    </>
  );
};

export default Verification;

const CardVerification = styled(Card)`
  max-width: 400px;
  margin-inline: auto;
  margin-block: 180px;
`;

const ButtonModal = styled(Button)`
  letter-spacing: 1px;
  width: 100%;
`;

const FooterModalOtp = styled.div`
  margin-top: 20px;
  display: flex;
  width: 100%;
  gap: 10px;
  letter-spacing: 1px;
  justify-content: center;
`;
