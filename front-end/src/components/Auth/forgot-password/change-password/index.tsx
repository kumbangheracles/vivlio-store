"use client";

import { UserProperties } from "@/types/user.type";
import { Button, Card, Input, message } from "antd";
import { useState } from "react";
import { USER_CREDIT_KEY } from "..";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import { isEmpty } from "@/helpers/validation";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";

const ChangePasswordIndex = () => {
  const [dataPass, setDataPass] = useState<UserProperties | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const storedUserCredit = localStorage.getItem(USER_CREDIT_KEY);
  const storedUser = JSON.parse(storedUserCredit as string);
  const { handleReplaceRoute } = useGlobalLoadingBar();
  console.log("Stored User: ", storedUser);
  const handleSubmit = async (data: UserProperties) => {
    if (isEmpty(data?.password) || isEmpty(data?.confirmPassword)) {
      message.error("All fields ar required!.");
      return;
    }
    if ((data?.password?.length as number) < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }
    if (data?.password !== data?.confirmPassword) {
      message.error("Password not match!.");
      return;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!regex.test(data.password as string)) {
      message.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        password: data?.password,
        confirmPassword: data?.confirmPassword,
      };

      await myAxios.patch(
        `/auth/forgot-password/${storedUser?.id as string}`,
        payload,
      );

      message.success("Update password success!.");

      setTimeout(() => {
        setLoading(false);
        handleReplaceRoute("/auth/login");
      }, 1000);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card className="shadow-xl sm:!w-[40%] !w-[90%]">
        <div className="flex flex-col gap-2">
          <Input.Password
            variant="filled"
            onChange={(e) =>
              setDataPass({
                ...dataPass,
                password: e.target.value,
              })
            }
            placeholder="Input New Password"
          />
          <Input.Password
            variant="filled"
            onChange={(e) =>
              setDataPass({
                ...dataPass,
                confirmPassword: e.target.value,
              })
            }
            placeholder="Confirm New Password"
          />
          <Button
            className="!w-full"
            type="primary"
            onClick={() => handleSubmit(dataPass as UserProperties)}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChangePasswordIndex;
