import { useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Popconfirm,
    Row,
    Col,
    Select,
    message,
    DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
    useGetAllDoctorsQuery,
    useGetAllClinicQuery,
    usePostDoctorsMutation,
    usePutDoctorsMutation,
    useDeleteDoctorsMutation,
} from "../../../services/userApi.jsx";
import {CERT_DOKTOR_URL, DOCTOR_IMG_URL} from "../../../contants.js";
import dayjs from "dayjs"; // Import dayjs for date handling

const CategoryTable = () => {
    const { data: getAllDoctors, refetch: refetchDoctors } = useGetAllDoctorsQuery();
    const { data: getAllClinic } = useGetAllClinicQuery();
    const doctors = getAllDoctors?.data || [];
    const clinics = getAllClinic?.data || [];

    const [postDoctor] = usePostDoctorsMutation();
    const [putDoctor] = usePutDoctorsMutation();
    const [deleteDoctor] = useDeleteDoctorsMutation();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [cardFileList, setCardFileList] = useState([]);
    const [certificateFileList, setCertificateFileList] = useState([]);

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        setCardFileList([]);
        setCertificateFileList([]);
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingDoctor(record);
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            surName: record.surName,
            surNameEng: record.surNameEng,
            surNameRu: record.surNameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
            rate: record.rate,
            role: record.role,
            bornDate: record.bornDate ? dayjs(record.bornDate, "M/D/YYYY") : null, // Parse backend date
            clinicId: record.clinicId,
        });

        // Populate doctor image
        setCardFileList(
            record.doctorImage
                ? [
                    {
                        uid: "-1",
                        name: record.doctorImage,
                        status: "done",
                        url: DOCTOR_IMG_URL + record.doctorImage,
                    },
                ]
                : []
        );

        // Populate certificate images
        setCertificateFileList(
            record.doctorSertificates?.length > 0
                ? record.doctorSertificates.map((img, index) => ({
                    uid: `-${index + 1}`,
                    name: img,
                    status: "done",
                    url: CERT_DOKTOR_URL + img,
                }))
                : []
        );

        setIsEditModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        setCardFileList([]);
        setCertificateFileList([]);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
        setEditingDoctor(null);
        setCardFileList([]);
        setCertificateFileList([]);
    };

    // Form submission handlers
    const handleAddDoctor = async (values) => {
        const { clinicId, bornDate, ...rest } = values;

        const formData = new FormData();
        formData.append("name", rest.name);
        formData.append("nameEng", rest.nameEng);
        formData.append("nameRu", rest.nameRu);
        formData.append("surName", rest.surName);
        formData.append("surNameEng", rest.surNameEng);
        formData.append("surNameRu", rest.surNameRu);
        formData.append("description", rest.description);
        formData.append("descriptionEng", rest.descriptionEng);
        formData.append("descriptionRu", rest.descriptionRu);
        formData.append("rate", rest.rate);
        formData.append("role", rest.role);
        formData.append("bornDate", bornDate ? bornDate.format("DD.MM.YYYY") : ""); // Format as DD.MM.YYYY
        formData.append("clinicId", clinicId);

        // Append doctorImage (single binary file)
        if (cardFileList[0]?.originFileObj) {
            formData.append("doctorImage", cardFileList[0].originFileObj);
        }

        // Append doctorSertificates (multiple binary files)
        if (certificateFileList.length > 0) {
            certificateFileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append(`doctorSertificates`, file.originFileObj);
                }
            });
        }

        try {
            await postDoctor(formData).unwrap();
            message.success("Həkim uğurla əlavə edildi!");
            setIsAddModalVisible(false);
            form.resetFields();
            setCardFileList([]);
            setCertificateFileList([]);
            refetchDoctors();
        } catch (error) {
            console.error("Error adding doctor:", error);
            message.error("Həkim əlavə edilərkən xəta baş verdi!");
        }
    };

    const handleEditDoctor = async (values) => {
        const { clinicId, bornDate, ...rest } = values;

        // Compute changes kritika
        const newCertificates = certificateFileList.filter((file) => file.originFileObj) || [];
        const deletedCertificates = editingDoctor.doctorSertificates?.filter(
            (img) => !certificateFileList.some((file) => file.name === img)
        ) || [];

        const formData = new FormData();
        formData.append("id", editingDoctor.id);
        formData.append("name", rest.name);
        formData.append("nameEng", rest.nameEng);
        formData.append("nameRu", rest.nameRu);
        formData.append("surName", rest.surName);
        formData.append("surNameEng", rest.surNameEng);
        formData.append("surNameRu", rest.surNameRu);
        formData.append("description", rest.description);
        formData.append("descriptionEng", rest.descriptionEng);
        formData.append("descriptionRu", rest.descriptionRu);
        formData.append("rate", rest.rate);
        formData.append("role", rest.role);
        formData.append("bornDate", bornDate ? bornDate.format("DD.MM.YYYY") : ""); // Format as DD.MM.YYYY
        formData.append("clinicId", clinicId);

        // Append doctorImage (single binary file, only if changed)
        if (cardFileList[0]?.originFileObj) {
            formData.append("doctorImage", cardFileList[0].originFileObj);
        }

        // Append new doctorSertificates (multiple binary files)
        if (newCertificates.length > 0) {
            newCertificates.forEach((file) => {
                if (file.originFileObj) {
                    formData.append(`doctorSertificates`, file.originFileObj);
                }
            });
        }

        // Append deleted doctorSertificates
        if (deletedCertificates.length > 0) {
            deletedCertificates.forEach((image) => {
                formData.append(`deleteDoctorSertificates`, image);
            });
        }

        try {
            await putDoctor(formData).unwrap();
            message.success("Həkim uğurla yeniləndi!");
            setIsEditModalVisible(false);
            editForm.resetFields();
            setCardFileList([]);
            setCertificateFileList([]);
            setEditingDoctor(null);
            refetchDoctors();
        } catch (error) {
            console.error("Error updating doctor:", error);
            message.error("Həkim yenilənərkən xəta baş verdi!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoctor(id).unwrap();
            message.success("Həkim uğurla silindi!");
            refetchDoctors();
        } catch (error) {
            console.error("Error deleting doctor:", error);
            message.error("Həkim silinərkən xəta baş verdi!");
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
            title: "Şəkil",
            dataIndex: "doctorImage",
            key: "doctorImage",
            render: (doctorImage) => {
                if (!doctorImage) return <span>No Image</span>;
                return (
                    <img
                        src={DOCTOR_IMG_URL + doctorImage}
                        alt="Şəkil"
                        style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                    />
                );
            },
        },
        {
            title: "Həkim adı",
            dataIndex: "name",
            key: "name",
            render: (name, record) => `${name} ${record.surName}`,
        },
        {
            title: "Açıqlama",
            dataIndex: "description",
            key: "description",
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
        const clinicName = clinics.find((clinic) => clinic.id === record.clinicId)?.name || "Bilinməyən Klinika";

        return (
            <div>
                <h4>Əlavə Məlumat</h4>
                <Row gutter={16}>
                    <Col span={12}>
                        <p><strong>Ad (EN):</strong> {record.nameEng}</p>
                        <p><strong>Ad (RU):</strong> {record.nameRu}</p>
                        <p><strong>Soyad (EN):</strong> {record.surNameEng}</p>
                        <p><strong>Soyad (RU):</strong> {record.surNameRu}</p>
                        <p><strong>Açıqlama (EN):</strong> {record.descriptionEng}</p>
                        <p><strong>Açıqlama (RU):</strong> {record.descriptionRu}</p>
                    </Col>
                    <Col span={12}>
                        <p><strong>Reytinq:</strong> {record.rate.toFixed(2)}</p>
                        <p><strong>Rol:</strong> {record.role}</p>
                        <p><strong>Doğum Tarixi:</strong> {record.bornDate}</p>
                        <p><strong>Klinika:</strong> {clinicName}</p>
                        <p>
                            <strong>Sertifikatlar:</strong>{" "}
                            {record.doctorSertificates.length > 0
                                ? record.doctorSertificates.map((img, index) => (
                                    <img
                                        key={index}
                                        src={CERT_DOKTOR_URL + img}
                                        alt={`Sertifikat ${index + 1}`}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            marginRight: 8,
                                            borderRadius: "5px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ))
                                : "Sertifikat yoxdur"}
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
                dataSource={doctors}
                pagination={{ pageSize: 6 }}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) =>
                        record.nameEng ||
                        record.nameRu ||
                        record.surNameEng ||
                        record.surNameRu ||
                        record.descriptionEng ||
                        record.descriptionRu ||
                        record.rate ||
                        record.role ||
                        record.bornDate ||
                        record.clinicId ||
                        record.doctorSertificates.length > 0,
                }}
            />

            {/* Add Doctor Modal */}
            <Modal
                title="Yeni Həkim Əlavə Et"
                open={isAddModalVisible}
                onCancel={handleAddCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={form} layout="vertical" onFinish={handleAddDoctor}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Həkim Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Həkim Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Həkim Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="surName"
                                label="Soyad (AZ)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input placeholder="Soyad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="surNameEng"
                                label="Soyad (EN)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input placeholder="Soyad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="surNameRu"
                                label="Soyad (RU)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input placeholder="Soyad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item label="Sertifikat Şəkilləri">
                                <Upload
                                    name="doctorSertificates"
                                    listType="picture-card"
                                    fileList={certificateFileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setCertificateFileList(fileList)}
                                    onRemove={(file) =>
                                        setCertificateFileList(
                                            certificateFileList.filter((f) => f.uid !== file.uid)
                                        )
                                    }
                                    className="rounded-md"
                                    multiple
                                    accept="image/*"
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div className="mt-2">Sertifikat şəkilləri əlavə et</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="doctorImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                    className="rounded-md"
                                    accept="image/*"
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div className="mt-2">Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="rate"
                                label="Reytinq"
                                rules={[{ required: true, message: "Reytinq daxil edin!" }]}
                            >
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="Reytinq daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label="Rol"
                                rules={[{ required: true, message: "Rol daxil edin!" }]}
                            >
                                <Input placeholder="Rol daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="bornDate"
                                label="Doğum Tarixi"
                                rules={[{ required: true, message: "Doğum tarixi seçin!" }]}
                            >
                                <DatePicker
                                    format="DD.MM.YYYY"
                                    placeholder="Doğum tarixi seçin"
                                    className="w-full rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="clinicId"
                                label="Klinika"
                                rules={[{ required: true, message: "Klinika seçin!" }]}
                            >
                                <Select placeholder="Klinika seçin" className="rounded-md">
                                    {clinics.map((clinic) => (
                                        <Select.Option key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </Select.Option>
                                    ))}
                                </Select>
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

            {/* Edit Doctor Modal */}
            <Modal
                title="Həkim Redaktə Et"
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditDoctor}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Həkim Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Həkim Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Həkim Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="surName"
                                label="Soyad (AZ)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input placeholder="Soyad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="surNameEng"
                                label="Soyad (EN)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input placeholder="Soyad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="surNameRu"
                                label="Soyad (RU)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input placeholder="Soyad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item label="Sertifikat Şəkilləri">
                                <Upload
                                    name="doctorSertificates"
                                    listType="picture-card"
                                    fileList={certificateFileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setCertificateFileList(fileList)}
                                    onRemove={(file) =>
                                        setCertificateFileList(
                                            certificateFileList.filter((f) => f.uid !== file.uid)
                                        )
                                    }
                                    className="rounded-md"
                                    multiple
                                    accept="image/*"
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div className="mt-2">Sertifikat şəkilləri əlavə et</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="doctorImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                    className="rounded-md"
                                    accept="image/*"
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div className="mt-2">Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="rate"
                                label="Reytinq"
                                rules={[{ required: true, message: "Reytinq daxil edin!" }]}
                            >
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="Reytinq daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label="Rol"
                                rules={[{ required: true, message: "Rol daxil edin!" }]}
                            >
                                <Input placeholder="Rol daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="bornDate"
                                label="Doğum Tarixi"
                                rules={[{ required: true, message: "Doğum tarixi seçin!" }]}
                            >
                                <DatePicker
                                    format="DD.MM.YYYY"
                                    placeholder="Doğum tarixi seçin"
                                    className="w-full rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="clinicId"
                                label="Klinika"
                                rules={[{ required: true, message: "Klinika seçin!" }]}
                            >
                                <Select placeholder="Klinika seçin" className="rounded-md">
                                    {clinics.map((clinic) => (
                                        <Select.Option key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </Select.Option>
                                    ))}
                                </Select>
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

export default CategoryTable;