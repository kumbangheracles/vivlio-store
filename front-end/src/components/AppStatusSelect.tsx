"use client";
import React from "react";
import { Select } from "antd";
const { Option } = Select;

export const getStatusStyle = (color: string | undefined) => {
  switch (color) {
    case "success":
      return {
        border: "1px solid rgba(93, 183, 97, 1)",
        color: "rgba(93, 183, 97, 1)",
        backgroundColor: "rgba(200, 230, 201, 1)",
      };
    case "warning":
      return {
        border: "1px solid rgba(226, 202, 127, 1)",
        color: "#000000",
        backgroundColor: "rgba(255, 250, 230, 1)",
      };
    case "danger":
      return {
        border: "1px solid rgba(255, 150, 148, 1)",
        color: "rgba(255, 150, 148, 1)",
        backgroundColor: "rgba(255, 235, 232, 1)",
      };
    case "primary":
      return {
        border: "1px solid rgba(144, 202, 249, 1)",
        color: "rgba(144, 202, 249, 1)",
        backgroundColor: "rgba(222, 241, 251, 1)",
      };
    default:
      return {
        //Default
        border: "1px solid rgba(176, 176, 176, 1)",
        color: "rgba(69, 69, 69, 1)",
        backgroundColor: "rgba(176, 176, 176, 1)",
      };
  }
};

export interface StatusOption {
  label: string;
  value: string;
  color?: string;
}

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[];
  disabled?: boolean;
}

const AppStatusSelect: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  options,
  // disabled = false,
}) => {
  const selected = options.find((opt) => opt.value === value);
  const style = getStatusStyle(selected?.color);
  return (
    <>
      <Select
        value={value}
        onChange={onChange}
        // disabled={disabled}
        bordered={false}
        dropdownStyle={{ width: "auto" }}
        style={{
          width: "auto",
          borderRadius: 6,
          ...style,
        }}
      >
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            <span style={{ color: getStatusStyle(opt.color).color }}>
              {opt.label}
            </span>
          </Option>
        ))}
      </Select>
    </>
  );
};

export default AppStatusSelect;
