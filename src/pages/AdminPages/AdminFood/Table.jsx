import { useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Popconfirm,
    Row,
    Col,
    Select,
    message,
} from "antd";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
    useDeleteProductsMutation,
    useGetAllCategoryQuery,
    useGetAllProductsQuery,
    usePostProductsMutation,
    usePutProductsMutation,
} from "../../../services/userApi.jsx";

const FoodTable = () => {
    const { data: getAllProducts, refetch: refetchFoods } = useGetAllProductsQuery();
    const foods = getAllProducts?.data;
    const { data: getAllCategory } = useGetAllCategoryQuery();
    const categories = getAllCategory?.data;
    const [postFood] = usePostProductsMutation();
    const [putFood] = usePutProductsMutation();
    const [deleteFood] = useDeleteProductsMutation();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingFood, setEditingFood] = useState(null);

    // Helper function to generate category and subcategory options
    const getCategoryOptions = () => {
        const options = [];
        categories?.forEach((category) => {
            // Add main category
            options.push({
                value: category.id,
                label: category.name,
            });
            // Add subcategories
            category.subCategories?.forEach((subCategory) => {
                options.push({
                    value: subCategory.id,
                    label: `${category.name} > ${subCategory.name}`,
                });
            });
        });
        return options;
    };

    // Helper function to get category or subcategory name by ID
    const getCategoryName = (categoryId) => {
        for (const category of categories || []) {
            if (category.id === categoryId) {
                return category.name;
            }
            for (const subCategory of category.subCategories || []) {
                if (subCategory.id === categoryId) {
                    return `${category.name} > ${subCategory.name}`;
                }
            }
        }
        return "Bilinməyən Kateqoriya";
    };

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingFood(record);
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
            price: record.price,
            categoryId: record.categoryId,
        });
        setIsEditModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
        setEditingFood(null);
    };

    // Form submission handlers
    const handleAddFood = async (values) => {
        const { name, nameEng, nameRu, description, descriptionEng, descriptionRu, price, categoryId } = values;

        const payload = {
            name,
            nameEng,
            nameRu,
            description,
            descriptionEng,
            descriptionRu,
            price: parseFloat(price),
            categoryId,
        };

        try {
            await postFood(payload).unwrap();
            message.success("Yemək uğurla əlavə edildi!");
            setIsAddModalVisible(false);
            form.resetFields();
            refetchFoods();
        } catch (error) {
            console.error("Error adding food:", error);
            message.error(error?.data?.message || "Yemək əlavə edilərkən xəta baş verdi!");
        }
    };

    const handleEditFood = async (values) => {
        const { name, nameEng, nameRu, description, descriptionEng, descriptionRu, price, categoryId } = values;

        const payload = {
            id: editingFood.id,
            name,
            nameEng,
            nameRu,
            description,
            descriptionEng,
            descriptionRu,
            price: parseFloat(price),
            categoryId,
        };

        try {
            await putFood(payload).unwrap();
            message.success("Yemək uğurla yeniləndi!");
            setIsEditModalVisible(false);
            editForm.resetFields();
            setEditingFood(null);
            refetchFoods();
        } catch (error) {
            console.error("Error updating food:", error);
            message.error(error?.data?.message || "Yemək yenilənərkən xəta baş verdi!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteFood(id).unwrap();
            message.success("Yemək uğurla silindi!");
            refetchFoods();
        } catch (error) {
            console.error("Error deleting food:", error);
            message.error(error?.data?.message || "Yemək silinərkən xəta baş verdi!");
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Ad",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Qiymət",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price.toFixed(2)} AZN`,
        },
        {
            title: "Kateqoriya",
            dataIndex: "categoryId",
            key: "categoryId",
            render: (categoryId) => getCategoryName(categoryId),
        },
        {
            title: "Əməliyyatlar",
            key: "actions",
            render: (text, record) => (
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Button type="primary" onClick={() => showEditModal(record)}>
                        <FaRegEdit />
                    </Button>
                    <Popconfirm
                        title="Silmək istədiyinizə əminsiniz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Bəli"
                        cancelText="Xeyr"
                    >
                        <Button type="default" danger>
                            <MdDeleteForever />
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const expandedRowRender = (record) => {
        return (
            <div>
                <h4>Əlavə Məlumat</h4>
                <Row gutter={16}>
                    <Col span={12}>
                        <p>
                            <strong>Ad (EN):</strong> {record.nameEng}
                        </p>
                        <p>
                            <strong>Ad (RU):</strong> {record.nameRu}
                        </p>
                        <p>
                            <strong>Təsvir (AZ):</strong> {record.description}
                        </p>
                    </Col>
                    <Col span={12}>
                        <p>
                            <strong>Təsvir (EN):</strong> {record.descriptionEng}
                        </p>
                        <p>
                            <strong>Təsvir (RU):</strong> {record.descriptionRu}
                        </p>
                        <p>
                            <strong>Kateqoriya:</strong> {getCategoryName(record.categoryId)}
                        </p>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <div className="p-4">
            <Button
                type="primary"
                onClick={showAddModal}
                className="mb-4 bg-blue-500 hover:bg-blue-600"
            >
                +
            </Button>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={foods}
                pagination={{ pageSize: 5 }}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) =>
                        !!record.nameEng ||
                        !!record.nameRu ||
                        !!record.description ||
                        !!record.descriptionEng ||
                        !!record.descriptionRu,
                }}
            />

            {/* Add Food Modal */}
            <Modal
                title="Yeni Yemək Əlavə Et"
                open={isAddModalVisible}
                onCancel={handleAddCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={form} layout="vertical" onFinish={handleAddFood}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Yemək Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Yemək Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Yemək Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label="Qiymət"
                                rules={[{ required: true, message: "Qiymət daxil edin!" }]}
                            >
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Qiymət daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Təsvir (AZ)"
                                rules={[{ required: true, message: "Təsvir daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Təsvir (EN)"
                                rules={[{ required: true, message: "Təsvir daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Təsvir (RU)"
                                rules={[{ required: true, message: "Təsvir daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="categoryId"
                                label="Kateqoriya"
                                rules={[{ required: true, message: "Kateqoriya seçin!" }]}
                            >
                                <Select
                                    placeholder="Kateqoriya seçin"
                                    className="rounded-md"
                                    options={getCategoryOptions()}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Əlavə Et
                        </Button>
                        <Button onClick={handleAddCancel} className="rounded-md">
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Food Modal */}
            <Modal
                title="Yemək Redaktə Et"
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditFood}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Yemək Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Yemək Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Yemək Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label="Qiymət"
                                rules={[{ required: true, message: "Qiymət daxil edin!" }]}
                            >
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Qiymət daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Təsvir (AZ)"
                                rules={[{ required: true, message: "Təsvir daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Təsvir (EN)"
                                rules={[{ required: true, message: "Təsvir daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Təsvir (RU)"
                                rules={[{ required: true, message: "Təsvir daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="categoryId"
                                label="Kateqoriya"
                                rules={[{ required: true, message: "Kateqoriya seçin!" }]}
                            >
                                <Select
                                    placeholder="Kateqoriya seçin"
                                    className="rounded-md"
                                    options={getCategoryOptions()}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Düzəliş Et
                        </Button>
                        <Button onClick={handleEditCancel} className="rounded-md">
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FoodTable;