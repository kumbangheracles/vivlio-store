import {
  LoadingOutlined,
  FacebookFilled,
  GoogleCircleFilled,
  TwitterCircleFilled,
} from "@ant-design/icons";
import {
  Divider,
  Input,
  Flex,
  Select,
  Button,
  Form,
  Card,
  message,
  Modal,
} from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { initialLogin, type LoginProps } from "../../../types/user.type";
import { isEmpty } from "../../../helper/validation";
import myAxios from "../../../helper/myAxios";
import { ErrorHandler } from "../../../helper/handleError";
import { UserContext } from "../../../context/UserContext";
// import useSignIn from "react-auth-kit/hooks/useSignIn";
const LoginForm: React.FC = () => {
  const { setUser } = useContext(UserContext)!;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Boolean>(false);
  const [dataLogin, setDataLogin] = useState<LoginProps>(initialLogin);
  // const signIn = useSignIn();
  const handleSubmit = async (data: LoginProps) => {
    if (isEmpty(data.identifier)) {
      message.error("Username or Email are required!!");
      return;
    }
    if (isEmpty(data.password)) {
      message.error("Password are required!!");
      return;
    }
    try {
      setLoading(true);
      const body: LoginProps = {
        identifier: data.identifier,
        password: data.password,
      };

      const res = await myAxios.post("/auth/login", body);
      const user = res.data.results;
      // signIn({
      //   auth: {
      //     token: user.token,
      //     type: "Bearer",
      //   },
      //   refresh: user.token,

      //   userState: { email: body.identifier },
      // });

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      console.log("Login results: ", res.data);
      message.success("Login Success");
      navigate("/");
    } catch (error: any) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Container data-aos="fade-up">
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
          <Form
            layout="vertical"
            style={{ letterSpacing: 1 }}
            onFinish={() => handleSubmit(dataLogin!)}
          >
            <Form.Item
              style={{ marginBlock: "10px" }}
              required={true}
              label="Email or Username"
            >
              <Input
                variant="filled"
                required={true}
                value={dataLogin.identifier}
                onChange={(e) => {
                  setDataLogin({
                    ...dataLogin,
                    identifier: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "5px", marginTop: "-5px" }}
              required={true}
              label="Password"
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
                value={dataLogin.password}
                onChange={(e) => {
                  setDataLogin({
                    ...dataLogin,
                    password: e.target.value,
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
                handleSubmit(dataLogin!);
              }}
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
            <p>Don't have account?</p>
            <p
              style={{ color: "#7badff", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Sign In
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
    left: 27%;
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
