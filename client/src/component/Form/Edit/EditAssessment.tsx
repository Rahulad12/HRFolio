import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import { assessmentFormData } from "../../../types/index";
import { motion } from "framer-motion";
import { useGetAssessmentByIdQuery } from "../../../services/assessmentServiceApi";
import { useEffect } from "react";
import Predifineddata from "../../../data/PredefinedData";
interface Props {
    handleEdit: (value: assessmentFormData) => void
    id: string
}

const EditAssessment = ({ handleEdit, id }: Props) => {
    const [form] = Form.useForm();
    const { data: assessment } = useGetAssessmentByIdQuery(id);

    useEffect(() => {
        if (assessment?.data) {
            form.setFieldsValue({
                title: assessment.data.title,
                technology: assessment.data.technology,
                type: assessment.data.type,
                level: assessment.data.level
            });
        }
    }, [assessment, form]);

    const onFinish = (values: assessmentFormData) => {
        handleEdit(values);
    }
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center py-6"
            >
                <Card title="Edit Assessment" className="bg-white rounded-xl shadow-md w-full max-w-3xl">
                    <Form
                        onFinish={onFinish}
                        layout="vertical"
                        form={form}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                > <Form.Item name="title" label="Name" rules={[{ required: true }]}>
                                        <Input size="large" placeholder="Assessment Name" />
                                    </Form.Item></motion.div>

                            </Col>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                        <Select size="large" placeholder="Select Type">
                                            {
                                                Predifineddata.Type?.map((type) => (
                                                    <Select.Option value={type.value} key={type.key}>{type.label}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </motion.div>

                            </Col>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                > <Form.Item name="technology" label="Technology" rules={[{ required: true }]}>
                                        <Select size="large" placeholder="Select Technology">
                                            {
                                                Predifineddata.Technology?.map((tech) => (
                                                    <Select.Option value={tech.value}>{tech.label}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item></motion.div>

                            </Col>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Form.Item name="level" label="Level" rules={[{ required: true }]}>
                                        <Select size="large" placeholder="Select Level">
                                            {
                                                Predifineddata.Level?.map((level) => (
                                                    <Select.Option value={level.value}>{level.label}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </motion.div>
                            </Col>
                            <Col span={24}>
                                <Form.Item>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Update Assessment
                                        </Button>
                                    </motion.div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card >
            </motion.div >
        </div >
    )
}

export default EditAssessment
