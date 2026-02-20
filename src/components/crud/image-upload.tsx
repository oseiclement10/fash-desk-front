import { PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { v4 as uuid } from "uuid";

type UploadImageProps = {
  value: UploadFile[];
  updateValue: (value: UploadFile[]) => void;
};

const UploadImage = ({ value, updateValue }: UploadImageProps) => {
  const handleChange: UploadProps["onChange"] = ({ fileList }) =>
    updateValue(fileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      action=""
      beforeUpload={() => false}
      accept="image/*"
      listType="picture-card"
      fileList={value}
      onChange={handleChange}
    >
      {value?.length >= 1 ? null : uploadButton}
    </Upload>
  );
};
export default UploadImage;


export const setupImageForDisplay = (image: any, fileName: string) => {
  if (!image) {
    return [];
  }
  if (typeof image === "string") {
    return [
      {
        uid: "1",
        name: fileName,
        url: image,
      },
    ];
  }
  if (image instanceof File) {
    const id = uuid();
    return [
      {
        uid: id,
        name: image.name || fileName,
        status: "done",
        originFileObj: image,
        url: URL.createObjectURL(image),
      },
    ];
  }

  return [image];
};
