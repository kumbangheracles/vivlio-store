import React from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";
// import h2p from "html2plaintext";

interface HTMLEditorProps extends ReactQuillProps {
  value: string;
  height?: number;
  onChange: (value: string) => void;
}

export const quillModulesArticleBody = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["blockquote", "code-block"],
    ["bold", "italic", "underline", "strike"],
    ["link", "image", "video"],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    ["clean"],
  ],
};

export const quillFormats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "strike",
  "link",
  "image",
  "video",
  "color",
  "font",
  "background",
  "align",
  "blockquote",
  "code-block",
];

const FormEditor: React.FC<HTMLEditorProps> = ({
  value,
  height,
  onChange,
  ...rest
}) => {
  const handleChange = (val: string) => {
    // const plainText = h2p(val || "");
    onChange(val);
  };

  return (
    <ReactQuill
      style={{ marginBottom: 20, height: height || "auto" }}
      theme="snow"
      value={value}
      onChange={handleChange}
      modules={quillModulesArticleBody}
      formats={quillFormats}
      {...rest}
    />
  );
};

export default FormEditor;
