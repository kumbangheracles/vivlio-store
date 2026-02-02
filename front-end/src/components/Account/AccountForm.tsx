"use client";
import { UserProperties } from "@/types/user.type";
import { Form, Input } from "antd";
import { useEffect } from "react";
type FieldKey = "fullName" | "username" | "email" | "password" | null;
type AccountFormProps = {
  activeKey: Exclude<FieldKey, null>;
  loading: boolean;
  onSubmit: (values: any) => void;
  dataUser?: UserProperties;
};

const AccountForm = ({
  activeKey,
  onSubmit,
  dataUser,
  loading,
}: AccountFormProps) => {
  const [form] = Form.useForm();
  const fieldMap = {
    fullName: { label: "Full Name", name: "fullName" },
    username: { label: "Username", name: "username" },
    email: { label: "Email", name: "email" },
    password: { label: "Password", name: "password" },
  } as const;

  useEffect(() => {
    form.setFieldsValue(dataUser);
  }, [dataUser]);

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
      {/* PASSWORD MODE */}
      {activeKey === "password" && (
        <>
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[{ required: true, message: "Old password is required" }]}
          >
            <Input.Password
              variant="filled"
              style={{ height: 50 }}
              disabled={loading}
              placeholder="Input Old Password"
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "New password is required" },
              { min: 6, message: "Minimum 6 characters" },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                message: "Must contain letters and numbers",
              },
            ]}
          >
            <Input.Password
              disabled={loading}
              variant="filled"
              style={{ height: 50 }}
              placeholder="Input New Password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Confirm password is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Password confirmation does not match"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              variant="filled"
              style={{ height: 50 }}
              disabled={loading}
              placeholder="Confirm New Password"
            />
          </Form.Item>
        </>
      )}

      {/* NON PASSWORD MODE */}
      {activeKey !== "password" && (
        <Form.Item
          label={fieldMap[activeKey].label}
          name={fieldMap[activeKey].name}
          rules={[
            {
              required: true,
              message: `${fieldMap[activeKey].label} is required`,
            },
          ]}
        >
          <Input
            variant="filled"
            disabled={loading}
            style={{ height: 50 }}
            placeholder={`Input New ${fieldMap[activeKey].label}`}
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default AccountForm;
