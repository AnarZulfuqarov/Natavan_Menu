import React, { useState } from "react";
import {
    Table,
    Button,
    Popconfirm,
    Modal,
    Form,
    Input,
    Row,
    Col,
    Select,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    usePostCategorysMutation,
    usePutCategorysMutation,
    useDeleteCategorysMutation,
    useGetAllCategoryQuery,
} from "../../../services/userApi.jsx";
import { CATEGORY_IMAGES } from "../../../contants.js";
import icon1 from "/src/assets/icon.png";
import icon2 from "/src/assets/icon.png";
import icon3 from "/src/assets/icon.png";
import icon4 from "/src/assets/icon.png";
import icon5 from "/src/assets/icon.png";
import icon6 from "/src/assets/icon.png";
import icon7 from "/src/assets/icon.png";
import icon8 from "/src/assets/icon.png";
import icon9 from "/src/assets/icon.png";
import icon10 from "/src/assets/icon.png";
import showToast from "../../../components/ToastMessage.js";

// Sabit resim listesi
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
];

// Köməkçi funksiya: verilmiş URL-dən File obyektinə çevirir
const convertImageToFile = async (imgSrc, fileName) => {
    const res = await fetch(imgSrc);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
};

// ImagePickerGalleryAlternative komponenti
const ImagePickerGalleryAlternative = ({ value, onChange }) => {
    const handleClick = (imgName) => {
        onChange(imgName);
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
                        cursor: "pointer",
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

const CategoryTable = () => {
    const { data: getAllCategory, refetch: refetchCategories } = useGetAllCategoryQuery();
    const categories = getAllCategory?.data;
    const [postCategory] = usePostCategorysMutation();
    const [putCategory] = usePutCategorysMutation();
    const [deleteCategory] = useDeleteCategorysMutation();

    // Add Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [addForm] = Form.useForm();

    // Edit Modal state
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [editingRecord, setEditingRecord] = useState(null);

    // Tablo sütunları
    const columns = [
        {
            title: "#",
            key: "index",
            render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Şəkil",
            dataIndex: "categoryImage",
            key: "categoryImage",
            render: (categoryImage) => (
                <img
                    src={CATEGORY_IMAGES + categoryImage}
                    alt="Card"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                />
            ),
        },
        {
            title: "Kateqoriya Adı (AZ)",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Fəaliyyətlər",
            key: "actions",
            render: (text, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: 8 }}
                    />
                    <Popconfirm
                        title="Bu kateqoriyanı siləcəyinizə əminsiniz?"
                        onConfirm={() => handleDelete(record)}
                        okText="Bəli"
                        cancelText="Xeyr"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </>
            ),
        },
    ];

    // Expanded row – digər dillərdəki dəyərlər, parentCategoryId və subCategories göstərilir
    const expandedRowRender = (record) => {
        return (
            <div>
                {record.nameEng && record.nameEng !== record.name && (
                    <p>
                        <strong>Ad (EN):</strong> {record.nameEng}
                    </p>
                )}
                {record.nameRu && record.nameRu !== record.name && (
                    <p>
                        <strong>Ad (RU):</strong> {record.nameRu}
                    </p>
                )}

                <div>
                    <strong>Alt Kateqoriyalar:</strong>
                    {record.subCategories && record.subCategories.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {record.subCategories.map((subCategory) => (
                                <li key={subCategory.id}>{subCategory.name}</li>
                            ))}
                        </ul>
                    ) : (
                        " Yoxdur"
                    )}
                </div>
            </div>
        );
    };

    // Delete əməliyyatı
    const handleDelete = async (record) => {
        try {
            await deleteCategory(record.id).unwrap();
            showToast("Kateqoriya uğurla silindi!", "success");
            refetchCategories();
        } catch (error) {
            console.error("Delete Error:", error);
            const errorMsg = error?.data?.error || "Kateqoriya silinərkən xəta baş verdi!";
            showToast(errorMsg, "error");
        }
    };

    // Edit butonuna tıklayınca
    const handleEdit = (record) => {
        setEditingRecord(record);
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            categoryImage: record.categoryImage,
            parentCategoryId: record.parentCategoryId || null,
        });
        setIsEditModalVisible(true);
    };

    // Add Modal açmaq
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        addForm.resetFields();
    };

    // Yeni Kateqoriya POST əməliyyatı
    const handlePost = () => {
        addForm
            .validateFields()
            .then(async (values) => {
                const formData = new FormData();
                const textFields = ["name", "nameEng", "nameRu", "parentCategoryId"];
                textFields.forEach((field) => {
                    if (values[field]) {
                        formData.append(field, values[field]);
                    }
                });
                if (values.categoryImage) {
                    const imgObj = availableImages.find((item) => item.name === values.categoryImage);
                    if (imgObj) {
                        try {
                            const file = await convertImageToFile(imgObj.src, imgObj.name);
                            formData.append("categoryImage", file);
                        } catch (error) {
                            console.error("Image conversion error:", error);
                        }
                    }
                }
                try {
                    await postCategory(formData).unwrap();
                    showToast("Kateqoriya uğurla əlavə edildi!", "success");
                    setIsModalVisible(false);
                    addForm.resetFields();
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

    // Edit Modal cancel əməliyyatı
    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
        setEditingRecord(null);
    };

    // Edit Kateqoriya PUT əməliyyatı
    const handleEditSubmit = () => {
        editForm
            .validateFields()
            .then(async (values) => {
                const formData = new FormData();
                const textFields = ["name", "nameEng", "nameRu", "parentCategoryId"];
                textFields.forEach((field) => {
                    if (values[field]) {
                        formData.append(field, values[field]);
                    }
                });
                if (editingRecord?.id) {
                    formData.append("id", editingRecord.id);
                }
                if (values.categoryImage) {
                    const imgObj = availableImages.find((item) => item.name === values.categoryImage);
                    if (imgObj) {
                        try {
                            const file = await convertImageToFile(imgObj.src, imgObj.name);
                            formData.append("categoryImage", file);
                        } catch (error) {
                            console.error("Image conversion error:", error);
                        }
                    }
                }
                try {
                    await putCategory(formData).unwrap();
                    showToast("Kateqoriya uğurla yeniləndi!", "success");
                    setIsEditModalVisible(false);
                    editForm.resetFields();
                    setEditingRecord(null);
                    refetchCategories();
                } catch (error) {
                    console.error("PUT Error:", error);
                    const errorMsg = error?.data?.error || "Kateqoriya yenilənərkən xəta baş verdi!";
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
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Yeni Kateqoriya Əlavə edin
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={categories}
                pagination={{ pageSize: 5 }}
                expandedRowRender={expandedRowRender}
            />

            {/* Yeni Kateqoriya Əlavə edin Modal */}
            <Modal
                title="Yeni Kateqoriya Əlavə edin"
                visible={isModalVisible}
                onOk={handlePost}
                onCancel={handleCancel}
                cancelText="Ləğv et"
                okText="Əlavə Et"
                width={800}
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
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Kart Şəkli"
                                name="categoryImage"
                                rules={[{ required: true, message: "Şəkil seçin!" }]}
                            >
                                <ImagePickerGalleryAlternative
                                    onChange={(value) => addForm.setFieldsValue({ categoryImage: value })}
                                    value={addForm.getFieldValue("categoryImage")}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ana Kateqoriya"
                                name="parentCategoryId"
                            >
                                <Select
                                    placeholder="Ana kateqoriya seçin"
                                    allowClear
                                >
                                    {categories?.map((category) => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                title="Kateqoriya Redaktə Et"
                visible={isEditModalVisible}
                onOk={handleEditSubmit}
                onCancel={handleEditCancel}
                cancelText="Ləğv et"
                okText="Yenilə"
                width={800}
            >
                <Form form={editForm} layout="vertical">
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
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Kart Şəkli"
                                name="categoryImage"
                                rules={[{ required: true, message: "Şəkil seçin!" }]}
                            >
                                <ImagePickerGalleryAlternative
                                    onChange={(value) => editForm.setFieldsValue({ categoryImage: value })}
                                    value={editForm.getFieldValue("categoryImage")}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ana Kateqoriya"
                                name="parentCategoryId"
                            >
                                <Select
                                    placeholder="Ana kateqoriya seçin"
                                    allowClear
                                >
                                    {categories?.filter((category) => category.id !== editingRecord?.id).map((category) => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryTable;