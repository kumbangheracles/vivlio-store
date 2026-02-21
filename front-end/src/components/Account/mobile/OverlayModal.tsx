"use client";
import React, {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormKey } from "./AccountMobile";
import { Button, Form, Input, message } from "antd";
import AppInput from "@/components/AppInput";
import { UserProperties } from "@/types/user.type";
import PasswordCheck from "./PasswordCheck";
import { cn } from "@/libs/cn";
import myAxios from "@/libs/myAxios";
import { useAuth } from "@/hooks/useAuth";
import { ErrorHandler } from "@/helpers/handleError";
import { isEmpty } from "@/helpers/validation";
import { CategoryProps } from "@/types/category.types";
import { useRouter } from "next/navigation";

interface PropTypes extends HTMLAttributes<HTMLDivElement> {
  keyForm: FormKey | null;
  setKeyForm: Dispatch<SetStateAction<FormKey | null>>;
  isOverlay: boolean;
  setIsOverlay: Dispatch<SetStateAction<boolean>>;
  dataUser: UserProperties;
  dataCategory: CategoryProps[];
  handleOpenForm: (key: FormKey | null, type: "open" | "close") => void;
}

const OverlayModal = ({
  isOverlay,
  keyForm,
  setKeyForm,
  setIsOverlay,
  dataUser,
  dataCategory,
  handleOpenForm,
  ...htmlAttributes
}: PropTypes) => {
  const auth = useAuth();
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const router = useRouter();
  const currentY = useRef(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [newDataUser, setNewDataUser] = useState<UserProperties | null>(
    dataUser,
  );
  const [dragging, setDragging] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  const passwordRules = {
    minLength: (newDataUser?.newPassword?.length as number) >= 8,
    lowercase: /[a-z]/.test(newDataUser?.newPassword || ""),
    uppercase: /[A-Z]/.test(newDataUser?.newPassword || ""),
    numberSymbol:
      /[0-9]/.test(newDataUser?.newPassword || "") &&
      /[^\w\s]/.test(newDataUser?.newPassword || ""),
  };
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    startY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;

    const delta = e.clientY - startY.current;

    if (delta > 0) {
      currentY.current = delta;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${delta}px)`;
      }
    }
  };

  const handlePointerUp = () => {
    setDragging(false);

    if (currentY.current > 100) {
      setIsOverlay(false);
      setKeyForm(null);
    } else {
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(0px)`;
      }
    }

    currentY.current = 0;
  };

  const handleSubmitData = async (data: UserProperties, type: FormKey) => {
    let payload: UserProperties = {};

    if (type === "fullName") {
      if ((data?.fullName?.length as number) < 7) {
        message.error("Full Name minimum 7 character.");
        return;
      }

      if (isEmpty(data?.fullName)) {
        message.error("Full Name is required.");
        return;
      }

      payload.fullName = data?.fullName;
    } else if (type === "password") {
      if (
        isEmpty(data?.newPassword) ||
        isEmpty(data?.oldPassword) ||
        isEmpty(data?.confirmPassword)
      ) {
        message.error("All password field is required.");
        return;
      }
      payload.password = data?.confirmPassword;
    } else if (type === "preference") {
      if (selected.length < 5) {
        message.error("Category preference minimum 5.");
        return;
      }

      payload.category_preference = dataCategory?.filter((item) =>
        selected.includes(item.categoryId),
      );
    } else if (type === "username") {
      if ((data?.username?.length as number) > 20) {
        message.error("Username maximum 20 character.");
        return;
      }
      if (data?.username?.includes(" ")) {
        message.error("Username cannot contain spaces.");
        return;
      }

      if (isEmpty(data?.username)) {
        message.error("Username is required.");
        return;
      }
      payload.username = data?.username;
    }

    try {
      setLoading(true);
      const res = await myAxios.patch(`/users/${auth?.user?.id}`, payload);

      if (type === "fullName") {
        message.success("Success update full name.");
      } else if (type === "password") {
        message.success("Success update password.");
      } else if (type === "preference") {
        message.success("Success update category preference.");
      } else if (type === "username") {
        message.success("Success update username.");
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
      setKeyForm(null);
      setIsOverlay(false);
      router.refresh();
    }
  };
  useEffect(() => {
    if (dataUser?.category_preference && selected.length === 0) {
      setSelected(dataUser.category_preference.map((item) => item.categoryId));
    }
  }, [dataUser]);
  return (
    <div
      className="fixed inset-0 flex items-end z-50"
      onClick={() => {
        (setIsOverlay(false), setDragging(false), setKeyForm(null));
      }}
      {...htmlAttributes}
    >
      <div
        ref={sheetRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full min-h-[200px] rounded-t-2xl 
        transform transition-all  ease-out touch-none
        ${isVisible ? "translate-y-0 duration-200" : "translate-y-full duration-50"}`}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />

        <Form>
          {keyForm === "fullName" && (
            <div className="p-4">
              <h4 className="font-semibold text-center text-[18px]">
                Full Name
              </h4>

              <p className="text-sm text-gray-500 my-4">
                This name will be used on several pages.
              </p>
              <div>
                <Form.Item
                  name={"fullName"}
                  initialValue={newDataUser?.fullName}
                >
                  <AppInput
                    placeholder="Full Name"
                    variant="filled"
                    onChange={(e) =>
                      setNewDataUser({
                        ...newDataUser,
                        fullName: e.target.value,
                      })
                    }
                    className="border !border-gray-500"
                  />
                </Form.Item>
              </div>

              <Button
                loading={loading}
                type="primary"
                style={{ width: "100%", minHeight: 38 }}
                disabled={
                  dataUser?.fullName === newDataUser?.fullName ||
                  isEmpty(newDataUser?.fullName)
                }
                onClick={() =>
                  handleSubmitData(newDataUser as UserProperties, "fullName")
                }
              >
                Save
              </Button>
            </div>
          )}
          {keyForm === "username" && (
            <div className="p-4">
              <h4 className="font-semibold text-center text-[18px]">
                Username
              </h4>

              <p className="text-sm text-gray-500 my-4">
                This username will be used on several pages.
              </p>
              <div>
                <Form.Item
                  name={"username"}
                  initialValue={newDataUser?.username}
                >
                  <AppInput
                    placeholder="Full Name"
                    variant="filled"
                    onChange={(e) =>
                      setNewDataUser({
                        ...newDataUser,
                        username: e.target.value,
                      })
                    }
                    className="border !border-gray-500"
                  />
                </Form.Item>
              </div>

              <Button
                loading={loading}
                type="primary"
                style={{ width: "100%", minHeight: 38 }}
                disabled={
                  dataUser?.username === newDataUser?.username ||
                  isEmpty(newDataUser?.username)
                }
                onClick={() =>
                  handleSubmitData(newDataUser as UserProperties, "username")
                }
              >
                Save
              </Button>
            </div>
          )}
          {keyForm === "password" && (
            <div className="p-4">
              <h4 className="font-semibold text-center text-[18px]">
                Password
              </h4>

              <p className="text-sm text-gray-500 my-4">
                Create a strong password for your account.
              </p>
              <div>
                <div>
                  <Form.Item name={"oldPassword"}>
                    <Input.Password
                      type="password"
                      onChange={(e) =>
                        setNewDataUser({
                          ...newDataUser,
                          oldPassword: e.target.value,
                        })
                      }
                      placeholder="Old Password"
                      variant="filled"
                      className="border !min-h-[38px] !border-gray-500"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item name={"newPassword"}>
                    <Input.Password
                      type="password"
                      onChange={(e) =>
                        setNewDataUser({
                          ...newDataUser,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="New Password"
                      variant="filled"
                      className="border !min-h-[38px] !border-gray-500"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item name={"confirmNewPassword"}>
                    <Input.Password
                      type="password"
                      onChange={(e) =>
                        setNewDataUser({
                          ...newDataUser,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm New Password"
                      variant="filled"
                      className="border !min-h-[38px] !border-gray-500"
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <PasswordCheck
                  valid={passwordRules.minLength}
                  text="Minimum 8 characters"
                />
                <PasswordCheck
                  valid={passwordRules.lowercase && passwordRules.uppercase}
                  text="Include uppercase & lowercase letters"
                />
                <PasswordCheck
                  valid={passwordRules.numberSymbol}
                  text="Include at least one number & symbol"
                />
              </div>

              <Button
                loading={loading}
                type="primary"
                disabled={
                  !passwordRules.minLength ||
                  !passwordRules.lowercase ||
                  !passwordRules.numberSymbol ||
                  !passwordRules.uppercase ||
                  isEmpty(newDataUser?.newPassword) ||
                  isEmpty(newDataUser?.oldPassword) ||
                  isEmpty(newDataUser?.confirmPassword)
                }
                style={{ width: "100%", marginTop: "17px", minHeight: 38 }}
                onClick={() =>
                  handleSubmitData(newDataUser as UserProperties, "password")
                }
              >
                Save
              </Button>
            </div>
          )}

          {keyForm === "preference" && (
            <div className="p-4">
              <h4 className="font-semibold text-center text-[18px]">
                Category Preference
              </h4>

              <p className="text-sm text-gray-500 my-4">
                Select maximum 5 category which you prefered.
              </p>
              <div className="flex flex-wrap gap-1 max-h-[270px] overflow-scroll">
                {dataCategory?.map((item) => (
                  <h4
                    key={item?.categoryId}
                    onClick={() => {
                      setSelected((prev) => {
                        const isSelected = prev.includes(item.categoryId);

                        if (isSelected) {
                          return prev.filter((id) => id !== item.categoryId);
                        }

                        if (prev.length >= 5) {
                          return prev;
                        }

                        return [...prev, item.categoryId];
                      });
                    }}
                    className={`p-3 tracking-wider text-sm flex justify-center items-center  min-w-[90px] rounded-2xl text-[11px] sm:text-sm ${selected.includes(item.categoryId) ? "bg-sky-200" : "bg-gray-100"}`}
                  >
                    {item?.name}
                  </h4>
                ))}
              </div>
              <Button
                loading={loading}
                type="primary"
                style={{ width: "100%", marginTop: "17px", minHeight: 38 }}
                onClick={() =>
                  handleSubmitData(newDataUser as UserProperties, "preference")
                }
              >
                Save
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default OverlayModal;
