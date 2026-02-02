"use client";

import { Upload, UploadFile } from "antd";
import { MyButton } from "../AppButton";
import { RcFile, UploadChangeParam } from "antd/es/upload";
interface PropTypes {
  fileList: UploadFile[];
  handleUpload: (info: UploadChangeParam<UploadFile>) => void;
  beforeUpload: (file: RcFile) => void;
  loading: boolean;
}
const UploadClient = ({
  beforeUpload,
  fileList,
  handleUpload,
  loading,
}: PropTypes) => {
  return (
    <Upload
      fileList={fileList}
      showUploadList={false}
      onChange={handleUpload}
      maxCount={1}
      beforeUpload={beforeUpload}
    >
      <MyButton loading={loading}>Change Profile Photo</MyButton>
    </Upload>
  );
};

export default UploadClient;
