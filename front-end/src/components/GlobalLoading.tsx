"use client";
import { Spin } from "antd";
import React from "react";

const GlobalLoading: React.FC = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Spin size="large" />
    </div>
  );
};

export default GlobalLoading;
