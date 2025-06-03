import AdminCategoryDetailTable from "./Table.jsx";
import { useParams } from "react-router-dom";
import SubCategoryTable from "./Table2.jsx";
import { useGetCategorysByIdQuery, usePostCategorysMutation } from "../../../services/userApi.jsx";
import { Button, Col, Form, Image, Input, Modal, Row, Upload } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import showToast from "../../../components/ToastMessage.js";
import icon1 from "../../../assets/icons/icon.png";
import icon2 from "../../../assets/icons/2.png";
import icon3 from "../../../assets/icons/3.png";
import icon4 from "../../../assets/icons/4.png";
import icon5 from "../../../assets/icons/5.png";
import icon6 from "../../../assets/icons/6.png";
import icon7 from "../../../assets/icons/7.png";
import icon8 from "../../../assets/icons/8.png";
import icon9 from "../../../assets/icons/9.png";
import icon10 from "../../../assets/icons/10.png";
import icon11 from "../../../assets/icons/11.png";
import icon12 from "../../../assets/icons/12.png";
import icon13 from "../../../assets/icons/12.png"; // Note: Duplicate, should be fixed
import icon14 from "../../../assets/icons/13.png";
import icon15 from "../../../assets/icons/14.png";
import icon16 from "../../../assets/icons/15.png";
import icon17 from "../../../assets/icons/16.png";
import icon18 from "../../../assets/icons/17.png";
import icon19 from "../../../assets/icons/18.png";
import icon20 from "../../../assets/icons/19.png";
import icon21 from "../../../assets/icons/20.png";
import icon22 from "../../../assets/icons/21.png";
import icon23 from "../../../assets/icons/22.png";
import icon24 from "../../../assets/icons/23.png";
import icon25 from "../../../assets/icons/24.png";
import icon26 from "../../../assets/icons/25.png";
import icon27 from "../../../assets/icons/269.png";

const availableImages = [
    { name: "1.png", src: icon1 },
    { name: "2.png", src: icon2 },
    { name: "3.png", src: icon3 },
    { name: "4.png", src: icon4 },
    { name: "5.png", src: icon5 },
    { name: "6.png", src: icon6 },
    { name: "7.png", src: icon7 },
    { name: "8.png", src: icon8 },
    { name: "9.png", src: icon9 },
    { name: "10.png", src: icon10 },
    { name: "11.png", src: icon11 },
    { name: "12.png", src: icon12 },
    { name: "13.png", src: icon14 }, // Fixed: icon13 was pointing to "12.png"
    { name: "14.png", src: icon15 },
    { name: "15.png", src: icon16 },
    { name: "16.png", src: icon17 },
    { name: "17.png", src: icon18 },
    { name: "18.png", src: icon19 },
    { name: "19.png", src: icon20 },
    { name: "20.png", src: icon21 },
    { name: "21.png", src: icon22 },
    { name: "22.png", src: icon23 },
    { name: "23.png", src: icon24 },
    { name: "24.png", src: icon25 },
    { name: "25.png", src: icon26 },
    { name: "26.png", src: icon27 },
];

const convertImageToFile = async (imgSrc, fileName) => {
    const res = await fetch(imgSrc);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
};

// ImagePickerGalleryAlternative component
const ImagePickerGalleryAlternative = ({ value, onChange, disabled }) => {
    const handleClick = (imgName) => {
        if (!disabled) {
            onChange(imgName);
        }
    };

    return (
        <div
            className="image-picker-gallery-alternative"
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                maxHeight: "250px",
                overflowY: "auto",
                padding: "5px",
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? "none" : "auto",
            }}
        >
            {availableImages.map((imgObj) => (
                <div
                    key={imgObj.name}
                    onClick={() => handleClick(imgObj.name)}
                    className={`image-card ${value === imgObj.name ? "selected" : ""}`}
                    style={{
                        width: "100px",
                        height: "100px",
                        border: value === imgObj.name ? "2px solid #1890ff" : "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: disabled ? "not-allowed" : "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px",
                    }}
                >
                    <img
                        src={imgObj.src}
                        alt={imgObj.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

function AdminCategoryDetail() {
    const { id } = useParams();
    const { data: getCategorysById, refetch: refetchCategories } = useGetCategorysByIdQuery(id);
    const [postCategory, { isLoading: isPosting }] = usePostCategorysMutation();
    const [addForm] = Form.useForm();
    const data = getCategorysById?.data?.subCategories || [];
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [addUploadedFile, setAddUploadedFile] = useState(null);
    const [addPreviewUrl, setAddPreviewUrl] = useState(null);

    const showModal = () => {
        setIsModalVisible(true);
        // Optionally pre-fill parentCategoryId in the form
        addForm.setFieldsValue({ parentCategoryId: id });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        addForm.resetFields();
        setAddUploadedFile(null);
        setAddPreviewUrl(null);
    };

    const uploadPropsAdd = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                showToast("Yalnız şəkil faylları yüklənə bilər!", "error");
                return false;
            }
            setAddUploadedFile(file);
            const url = URL.createObjectURL(file);
            setAddPreviewUrl(url);
            addForm.setFieldsValue({ categoryImage: null }); // Clear gallery selection
            return false; // Prevent default upload behavior
        },
        fileList: addUploadedFile ? [addUploadedFile] : [],
    };

    const handleRemoveAddImage = () => {
        setAddUploadedFile(null);
        setAddPreviewUrl(null);
        if (addPreviewUrl) {
            URL.revokeObjectURL(addPreviewUrl);
        }
    };

    const handlePost = () => {
        addForm
            .validateFields()
            .then(async (values) => {
                const formData = new FormData();
                const textFields = ["name", "nameEng", "nameRu"];
                textFields.forEach((field) => {
                    if (values[field]) {
                        formData.append(field, values[field]);
                    }
                });
                // Always append parentCategoryId from useParams id
                formData.append("parentCategoryId", id);

                if (addUploadedFile) {
                    formData.append("categoryImage", addUploadedFile);
                } else if (values.categoryImage) {
                    const imgObj = availableImages.find((item) => item.name === values.categoryImage);
                    if (imgObj) {
                        try {
                            const file = await convertImageToFile(imgObj.src, imgObj.name);
                            formData.append("categoryImage", file);
                        } catch (error) {
                            console.error("Image conversion error:", error);
                            showToast("Şəkil yüklənərkən xəta baş verdi!", "error");
                            return;
                        }
                    }
                }

                try {
                    await postCategory(formData).unwrap();
                    showToast("Kateqoriya uğurla əlavə edildi!", "success");
                    setIsModalVisible(false);
                    addForm.resetFields();
                    setAddUploadedFile(null);
                    setAddPreviewUrl(null);
                    refetchCategories();
                } catch (error) {
                    console.error("POST Error:", error);
                    const errorMsg = error?.data?.error || "Kateqoriya əlavə edilərkən xəta baş verdi!";
                    showToast(errorMsg, "error");
                }
            })
            .catch((errorInfo) => {
                console.log("Validation Failed:", errorInfo);
            });
    };

    return (
        <div>
            <div style={{ marginBottom: "16px" }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    loading={isPosting}
                    disabled={isPosting}
                >
                    Yeni Kateqoriya Əlavə edin
                </Button>
            </div>
            {data.length === 0 ? null : <SubCategoryTable id={id} />}
            <AdminCategoryDetailTable id={id} />
            <Modal
                title="Yeni Kateqoriya Əlavə edin"
                open={isModalVisible}
                onOk={handlePost}
                onCancel={handleCancel}
                cancelText="Ləğv et"
                okText="Əlavə Et"
                width={800}
                okButtonProps={{ loading: isPosting, disabled: isPosting }}
            >
                <Form form={addForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Kateqoriya Adı (AZ)"
                                name="name"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Kateqoriya Adı (ENG)"
                                name="nameEng"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Kateqoriya Adı (RU)"
                                name="nameRu"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Optionally hide parentCategoryId field since it's set programmatically */}
                            <Form.Item
                                name="parentCategoryId"
                                hidden
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Kart Şəkli"
                                name="categoryImage"
                                rules={[{ required: !addUploadedFile, message: "Şəkil seçin və ya yükləyin!" }]}
                            >
                                <div>
                                    <Upload {...uploadPropsAdd} accept="image/*">
                                        <Button icon={<UploadOutlined />}>Şəkil Yüklə</Button>
                                    </Upload>
                                    {addPreviewUrl && (
                                        <div style={{ marginTop: 16 }}>
                                            <Image
                                                src={addPreviewUrl}
                                                alt="Yüklənmiş Şəkil"
                                                style={{ width: 100, height: 100, objectFit: "contain" }}
                                            />
                                            <Button
                                                type="link"
                                                danger
                                                onClick={handleRemoveAddImage}
                                                style={{ marginTop: 8 }}
                                            >
                                                Şəkli Sil
                                            </Button>
                                        </div>
                                    )}
                                    <div style={{ marginTop: 16 }}>
                                        <ImagePickerGalleryAlternative
                                            onChange={(value) => addForm.setFieldsValue({ categoryImage: value })}
                                            value={addForm.getFieldValue("categoryImage")}
                                            disabled={!!addUploadedFile}
                                        />
                                    </div>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default AdminCategoryDetail;