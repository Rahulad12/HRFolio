import { Button, Card, Col, DatePicker, Form, Row, Select } from "antd";
import { AssignmentData } from "../../../types/index";
import { motion } from "framer-motion";
import { useGetAssignmentByIdQuery } from "../../../services/assessmentServiceApi";
import { useEffect } from "react";
import { useAppSelector } from "../../../Hooks/hook";
import dayjs from "dayjs";
interface Props {
    handleEdit: (value: AssignmentData) => void
    id: string
}
const EditAssignment = ({ handleEdit, id }: Props) => {
    const [form] = Form.useForm();

    const { data: assignment } = useGetAssignmentByIdQuery(id);
    const { assessments } = useAppSelector(state => state.assessments);
    const { candidate } = useAppSelector(state => state.candidate);


    useEffect(() => {
        if (assignment) {
            form.setFieldsValue({
                candidate: assignment.data.candidate._id,
                assessment: assignment.data.assessment._id,
                date: dayjs(assignment.data.date),
            })
        }
    }, [assignment, form])
    const onFinish = (values: AssignmentData) => {
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
                <Card title="Edit Assignment" className="bg-white rounded-xl shadow-md w-full max-w-3xl">
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
                                > <Form.Item name="candidate" label="Candidate" rules={[{ required: true }]}>
                                        <Select
                                            size="large"
                                            placeholder="Select Candidate"
                                        >
                                            {candidate?.map((candidate) => (
                                                <Select.Option key={candidate._id} value={candidate._id}>
                                                    {candidate.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </motion.div>

                            </Col>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Form.Item name="assessment" label="Assignment" rules={[{ required: true }]}>
                                        <Select
                                            size="large"
                                            placeholder="Select Assignment"
                                        >
                                            {
                                                assessments?.map((assessment) => (
                                                    <Select.Option key={assessment._id} value={assessment._id}>
                                                        {assessment.title}
                                                    </Select.Option>
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
                                > <Form.Item name="date" label="Assignment Date" rules={[{ required: true }]}>
                                        <DatePicker size="large" placeholder="Select Assignment Date" />
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
                                            Update Assignment
                                        </Button>
                                    </motion.div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </motion.div>
        </div>
    )
}

export default EditAssignment
