import { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Popconfirm,
    Row,
    Col,
    message,
    Upload,
    Image,
} from "antd";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { UploadOutlined, DragOutlined } from "@ant-design/icons";
import {
    useDeleteProductsMutation,
    useGetCategorysByIdQuery,
    usePostProductsMutation,
    usePutProductsMutation,
} from "/src/services/userApi.jsx";
import { PRODUCT_IMAGES } from "/src/contants.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { usePutPoductsOrderMutation } from "/src/services/userApi.jsx";

const AdminCategoryDetailTable = ({ id }) => {
    const { data: getAllProducts, refetch: refetchFoods } = useGetCategorysByIdQuery(id);
    const foods = getAllProducts?.data || { products: [], subCategories: [] };
    const [postFood, { isLoading: isAdding }] = usePostProductsMutation();
    const [putFood, { isLoading: isUpdating }] = usePutProductsMutation();
    const [deleteFood] = useDeleteProductsMutation();
    const [putProductsOrder, { isLoading: isOrdering }] = usePutPoductsOrderMutation();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingFood, setEditingFood] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [editFileList, setEditFileList] = useState([]);
    const [products, setProducts] = useState([]);

    // Initialize products with orderId
    useEffect(() => {
        if (foods.products) {
            setProducts(
                foods.products.map((product, index) => ({
                    ...product,
                    categoryName: foods.name,
                    orderId: product.orderId || index.toString(),
                }))
            );
        }
    }, [foods]);

    // Helper function to get category or subcategory name by ID
    const getCategoryName = (categoryId) => {
        if (categoryId === foods.id) return foods.name;
        const subCategory = foods.subCategories.find((sub) => sub.id === categoryId);
        return subCategory ? subCategory.name : "Bilinməyən";
    };

    // Image upload handlers
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList.slice(-1)); // Keep only one file
    };

    const handleEditUploadChange = ({ fileList }) => {
        setEditFileList(fileList.slice(-1)); // Keep only one file
    };

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        form.setFieldsValue({ categoryId: id });
        setFileList([]);
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
            categoryId: id,
        });
        setEditFileList(
            record.productImage
                ? [{ uid: "-1", name: "image", status: "done", url: PRODUCT_IMAGES + record.productImage }]
                : []
        );
        setIsEditModal(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        setFileList([]);
    };

    const handleEditCancel = () => {
        setIsEditModal(false);
        editForm.resetFields();
        setEditFileList([]);
        setEditingFood(null);
    };

    // Drag-and-drop handler
    const onDragEnd = async (result) => {
        if (!result.destination) return; // Dropped outside the list

        const newProducts = [...products];
        const [reorderedItem] = newProducts.splice(result.source.index, 1);
        newProducts.splice(result.destination.index, 0, reorderedItem);

        // Update orderId
        newProducts.forEach((product, index) => {
            product.orderId = index.toString();
        });

        setProducts(newProducts);

        // Send updated order to backend
        const payload = newProducts.map((product) => ({
            id: product.id,
            orderId: product.orderId,
        }));

        try {
            await putProductsOrder(payload).unwrap();
            message.success("Sıralama uğurla yeniləndi!");
            refetchFoods();
        } catch (error) {
            console.error("Error updating product order:", error);
            message.error(error?.data?.message || "Sıralama yenilənərkən xəta baş verdi!");
            // Revert state on error
            setProducts(
                foods.products.map((product, index) => ({
                    ...product,
                    categoryName: foods.name,
                    orderId: product.orderId || index.toString(),
                }))
            );
        }
    };

    // Form submission handlers
    const handleAddFood = async (values) => {
        const { name, nameEng, nameRu, description, descriptionEng, descriptionRu, price } = values;

        const payload = new FormData();
        payload.append("name", name);
        payload.append("nameEng", nameEng);
        payload.append("nameRu", nameRu);
        payload.append("description", description || "");
        payload.append("descriptionEng", descriptionEng || "");
        payload.append("descriptionRu", descriptionRu || "");
        payload.append("price", parseFloat(price));
        payload.append("categoryId", id);
        if (fileList[0]?.originFileObj) {
            payload.append("productImage", fileList[0].originFileObj);
        }

        try {
            await postFood(payload).unwrap();
            message.success("Yemək uğurla əlavə edildi!");
            setIsAddModalVisible(false);
            form.resetFields();
            setFileList([]);
            refetchFoods();
        } catch (error) {
            console.error("Error adding food:", error);
            message.error(error?.data?.message || "Yemək əlavə edilərkən xəta baş verdi!");
        }
    };

    const handleEditFood = async (values) => {
        const { name, nameEng, nameRu, description, descriptionEng, descriptionRu, price } = values;

        const payload = new FormData();
        payload.append("id", editingFood.id);
        payload.append("name", name);
        payload.append("nameEng", nameEng);
        payload.append("nameRu", nameRu);
        payload.append("description", description || "");
        payload.append("descriptionEng", descriptionEng || "");
        payload.append("descriptionRu", descriptionRu || "");
        payload.append("price", parseFloat(price));
        payload.append("categoryId", id);
        if (editFileList[0]?.originFileObj) {
            payload.append("productImage", editFileList[0].originFileObj);
        }

        try {
            await putFood(payload).unwrap();
            message.success("Yemək uğurla yeniləndi!");
            setIsEditModal(false);
            editForm.resetFields();
            setEditFileList([]);
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
            title: "",
            key: "drag",
            width: 50,
            render: () => (
                <DragOutlined style={{ cursor: "move", fontSize: 16, color: "#999" }} />
            ),
        },
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Şəkil",
            dataIndex: "productImage",
            key: "productImage",
            render: (productImage) =>
                productImage ? (
                    <Image
                        src={PRODUCT_IMAGES + productImage}
                        alt="Food"
                        width={50}
                        height={50}
                        className="object-cover rounded"
                    />
                ) : (
                    "Şəkil yoxdur"
                ),
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
            dataIndex: "categoryName",
            key: "categoryName",
            render: (categoryName) => categoryName || "Bilinməyən",
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

    // Upload props for validation
    const uploadProps = {
        fileList,
        onChange: handleUploadChange,
        listType: "picture-card",
    };

    const editUploadProps = {
        fileList: editFileList,
        onChange: handleEditUploadChange,
        listType: "picture-card",
    };

    return (
        <div className="p-4">
            <div style={{ marginBottom: "16px" }}>
                <Button
                    type="primary"
                    onClick={showAddModal}
                    className="mb-4 bg-blue-500 hover:bg-blue-600"
                >
                    +
                </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="products">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            <Table
                                rowKey="id"
                                columns={columns}
                                dataSource={products}
                                pagination={{ pageSize: 5 }}
                                components={{
                                    body: {
                                        row: ({ children, ...restProps }) => {
                                            const index = products.findIndex((p) => p.id === restProps["data-row-key"]);
                                            return (
                                                <Draggable
                                                    draggableId={products[index]?.id || index.toString()}
                                                    index={index}
                                                    isDragDisabled={isOrdering}
                                                >
                                                    {(provided, snapshot) => (
                                                        <tr
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...restProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                background: snapshot.isDragging ? "#f0f0f0" : "inherit",
                                                            }}
                                                        >
                                                            {Array.isArray(children) ? (
                                                                children.map((child, i) =>
                                                                    i === 0 ? (
                                                                        <td key={child?.key || i} {...provided.dragHandleProps}>
                                                                            {child}
                                                                        </td>
                                                                    ) : (
                                                                        <td key={child?.key || i}>{child}</td>
                                                                    )
                                                                )
                                                            ) : (
                                                                <td colSpan={columns.length}>No data</td>
                                                            )}
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            );
                                        },
                                    },
                                }}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

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
                            <Form.Item name="description" label="Təsvir (AZ)">
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item name="descriptionEng" label="Təsvir (EN)">
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item name="descriptionRu" label="Təsvir (RU)">
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item name="categoryId" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name="productImage" label="Şəkil">
                                <Upload {...uploadProps} maxCount={1}>
                                    <div>
                                        <UploadOutlined />
                                        <div>Şəkil Yüklə</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                            loading={isAdding}
                            disabled={isAdding}
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
                open={isEditModal}
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
                            <Form.Item name="description" label="Təsvir (AZ)">
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item name="descriptionEng" label="Təsvir (EN)">
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item name="descriptionRu" label="Təsvir (RU)">
                                <Input.TextArea
                                    placeholder="Təsvir daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item name="categoryId" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name="productImage" label="Şəkil">
                                <Upload {...editUploadProps} maxCount={1}>
                                    <div>
                                        <UploadOutlined />
                                        <div>Şəkil Yüklə</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                            loading={isUpdating}
                            disabled={isUpdating}
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

export default AdminCategoryDetailTable;