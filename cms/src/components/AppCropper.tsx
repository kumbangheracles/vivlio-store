import { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";

function CropDemo({ src }: { src: any }) {
  const [crop, setCrop] = useState<Crop>();
  return (
    <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
      <img src={src} />
    </ReactCrop>
  );
}

export default CropDemo;
