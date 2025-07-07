import { Button, Row, Space, Typography } from "antd";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  rightAction?: ReactNode;
  breadcrumb?: string;
  icon?: "back";
  goBack?: () => void;
}
export default function HeaderPage({
  title,
  rightAction,
  breadcrumb,
  icon,
  goBack,
}: Props) {
  const navigate = useNavigate();
  return (
    <Row
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
      }}
    >
      <Space size={20}>
        {icon === "back" && (
          <Button
            style={{
              padding: 0,
            }}
            type="text"
            onClick={() => {
              if (goBack) {
                goBack();
              } else {
                navigate(-1);
              }
            }}
          >
            <Arrow />
          </Button>
        )}

        <Space size={6} direction="vertical">
          <Typography.Title
            level={2}
            style={{
              color: "#000",
              fontSize: 20,
              fontWeight: 600,
              margin: 0,
              letterSpacing: 1,
            }}
          >
            {title}
          </Typography.Title>

          <Typography.Text
            style={{
              fontSize: 14,
              color: "#A1A1AA",
              fontWeight: 300,
            }}
          >
            {breadcrumb}
          </Typography.Text>
        </Space>
      </Space>

      {rightAction}
    </Row>
  );
}

const Arrow = () => {
  return (
    <>
      <svg
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 7.5H1M1 7.5L7 13.5M1 7.5L7 1.5"
          stroke="#171717"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  );
};
