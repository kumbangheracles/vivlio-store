import { LoadingOutlined } from "@ant-design/icons";
import { Statistic, Form, Card, Button, message, Input } from "antd";
import { InputOTP } from "antd-input-otp";

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { styled } from "styled-components";
import myAxios from "../../../helper/myAxios";

const EMAIL_STORAGE_KEY = "email";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const COOLDOWN_MS = 60 * 1000 * 2;
export const USER_CREDIT_KEY = "user";

const getStoredEmail = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_STORAGE_KEY);
};

const ForgotPasswordIndex = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [verifCode, setVerifCode] = useState<string[]>([]);
  const [inputEmail, setInputEmail] = useState<string>("");

  const [deadline, setDeadline] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("otp_deadline");
    if (!saved) return null;
    const parsed = Number(saved);
    return parsed > Date.now() ? parsed : null;
  });
  const [cooldown, setCooldown] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("otp_deadline");
    if (!saved) return false;
    return Number(saved) > Date.now();
  });

  const [searchParams] = useSearchParams();
  const pathname = window.location.pathname;

  const emailParams = searchParams?.get("email");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (!emailParams) {
      setVerifCode([]);
      setCooldown(false);
      setDeadline(null);
    }
  }, [emailParams]);

  const handleResendOtp = async () => {
    const emailToUse = emailParams ? getStoredEmail() : inputEmail;

    if (!emailToUse || emailToUse.trim() === "") {
      message.error("Email are required!");
      return;
    }
    if (!EMAIL_REGEX.test(emailToUse)) {
      message.error("Invalid email address.");
      return;
    }

    try {
      setLoading(true);

      await myAxios.post("/auth/resend-code-verification", {
        email: emailToUse,
        type: "forgotPassword",
      });

      message.success("Verification code sent, please check your email.");

      if (!emailParams) {
        localStorage.setItem(EMAIL_STORAGE_KEY, inputEmail);
        navigate(pathname + "?" + createQueryString("email", inputEmail));
      }

      const newDeadline = Date.now() + COOLDOWN_MS;
      setDeadline(newDeadline);
      setCooldown(true);
      localStorage.setItem("otp_deadline", String(newDeadline));
    } catch (error: any) {
      const backendMsg =
        error?.response?.data?.message ||
        "Resend code failed! Please try again later.";
      message.error(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (data: string[]) => {
    if (data.length === 0) {
      message.error("Verification code is required!");
      return;
    }
    if (data.length < 6) {
      message.error("Invalid verification code!");
      return;
    }

    const storedEmail = getStoredEmail();
    if (!storedEmail) {
      message.error("Session expired. Please start over.");
      navigate(pathname);
      return;
    }

    try {
      setLoading(true);

      const verificationCode = data.join("");
      const res = await myAxios.post("/auth/verify-email", {
        email: storedEmail,
        verificationCode,
        type: "forgotPassword",
      });
      localStorage.setItem(USER_CREDIT_KEY, JSON.stringify(res.data.result));

      message.success("Verification success!");
      localStorage.removeItem(EMAIL_STORAGE_KEY);
      localStorage.removeItem("otp_deadline");

      setTimeout(() => {
        navigate(`/auth/forgot-password/change-password`);
      }, 1000);
    } catch (error: any) {
      const backendMsg =
        error?.response?.data?.message ||
        "Verification failed! Please try again later.";
      message.error(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderResendLabel = () => {
    if (cooldown && deadline) {
      return (
        <div
          className="flex gap-[10px]"
          style={{ fontSize: "20px", color: "gray" }}
        >
          <LoadingOutlined />
          <Statistic.Countdown
            value={deadline}
            format="mm:ss"
            onFinish={() => {
              setCooldown(false);
              setDeadline(null);
              localStorage.removeItem("otp_deadline");
            }}
          />
        </div>
      );
    }
    return loading ? "Sending..." : "Resend code";
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div>
        <>
          {!emailParams ? (
            <>
              <div className="!p-4 w-full sm:min-w-md rounded-xl shadow-xl">
                <div className="flex items-center justify-center gap-2 flex-col">
                  <label>Email</label>
                  <Input
                    variant="filled"
                    placeholder="Enter your email"
                    disabled={loading}
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    onPressEnter={handleResendOtp}
                  />
                </div>
                <Button
                  type="primary"
                  onClick={handleResendOtp}
                  loading={loading}
                  style={{ width: "100%", marginTop: 10 }}
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <>
              <CardVerification
                className="shadow-md"
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
                      disabled={cooldown}
                      style={{ cursor: cooldown ? "not-allowed" : "pointer" }}
                      onClick={handleResendOtp}
                    >
                      {renderResendLabel()}
                    </ButtonModal>

                    <ButtonModal
                      type="primary"
                      loading={loading}
                      onClick={() => handleSubmitOtp(verifCode)}
                    >
                      Ok
                    </ButtonModal>
                  </FooterModalOtp>
                </Form.Item>
              </CardVerification>
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default ForgotPasswordIndex;

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
