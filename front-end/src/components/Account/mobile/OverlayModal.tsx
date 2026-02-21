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
import { Button, Form, Input } from "antd";
import AppInput from "@/components/AppInput";
import { UserProperties } from "@/types/user.type";
import PasswordCheck from "./PasswordCheck";
import { cn } from "@/libs/cn";

interface PropTypes extends HTMLAttributes<HTMLDivElement> {
  keyForm: FormKey | null;
  setKeyForm: Dispatch<SetStateAction<FormKey | null>>;
  isOverlay: boolean;
  setIsOverlay: Dispatch<SetStateAction<boolean>>;
  dataUser: UserProperties;
}

const OverlayModal = ({
  isOverlay,
  keyForm,
  setKeyForm,
  setIsOverlay,
  dataUser,
  ...htmlAttributes
}: PropTypes) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [newDataUser, setNewDataUser] = useState<UserProperties | null>(
    dataUser,
  );
  const [dragging, setDragging] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
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
                    className="border !border-gray-500"
                  />
                </Form.Item>
              </div>
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
                type="primary"
                disabled={!passwordRules.minLength}
                style={{ width: "100%", marginTop: "17px", minHeight: 38 }}
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
              <div className="flex flex-wrap gap-3 max-h-[270px] overflow-scroll">
                {[
                  Array.from({ length: 20 }).map((_, index) => (
                    <h4
                      key={index}
                      onClick={() => {
                        if (selected.length >= 5) return;
                        setSelected((prev) =>
                          prev.includes(index)
                            ? prev.filter((i) => i !== index)
                            : [...prev, index],
                        );
                      }}
                      className={`p-3 tracking-wider text-sm flex justify-center items-center !min-w-[90px] rounded-2xl text-[11px] sm:text-sm  ${cn(selected.includes(index) ? "bg-sky-200" : "bg-gray-100")}`}
                    >
                      Fantasy
                    </h4>
                  )),
                ]}
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default OverlayModal;
