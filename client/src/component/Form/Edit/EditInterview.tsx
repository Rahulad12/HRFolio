import { Col, Form, Row, DatePicker, TimePicker, Select, Card, Button, Skeleton, notification, message } from 'antd';
import { interviewData } from "../../../types/index";
import { useGetInterviewByIdQuery, useGetInterviewerQuery, useUpdateInterviewMutation } from '../../../services/interviewServiceApi';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const { Option } = Select;

interface Props {
    id: string;
}

const EditInterview = ({ id }: Props) => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const { data, isLoading, isError } = useGetInterviewByIdQuery(id);
    const { data: interviewers } = useGetInterviewerQuery();
    const [updateInterview, { isLoading: updateLoading }] = useUpdateInterviewMutation();

    useEffect(() => {
        if (data?.data) {
            // Convert the date/time strings to dayjs objects for the form
            form.setFieldsValue({
                date: dayjs(data.data.date),
                time: dayjs(data.data.time),
                status: data.data.status,
                interviewer: data.data.interviewer._id
            });
        }
    }, [data, form]);

    const onFinish = async (values: interviewData) => {
        try {
            const res = await updateInterview({ id, data: values }).unwrap();
            if (res.success) {
                message.success(res.message);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    if (isLoading) {
        return (
            <div className='flex justify-center py-6'>
                <Card title="Edit Interview" className="bg-white rounded-xl shadow-md w-full max-w-3xl">
                    <Skeleton active paragraph={{ rows: 6 }} />
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className='flex justify-center py-6'>
                <Card title="Edit Interview" className="bg-white rounded-xl shadow-md w-full max-w-3xl">
                    <div className="text-center py-8 text-red-500">
                        Failed to load interview data. Please try again.
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='flex justify-center py-6'
            >
                <Card
                    title="Edit Interview"
                    className="bg-white rounded-xl shadow-md w-full max-w-3xl"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Form.Item
                                        name="date"
                                        label="Select Date"
                                        rules={[{ required: true, message: "Please select a date" }]}
                                    >
                                        <DatePicker className="w-full" />
                                    </Form.Item>
                                </motion.div>
                            </Col>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Form.Item
                                        name="time"
                                        label="Select Time"
                                        rules={[{ required: true, message: "Please select time" }]}
                                    >
                                        <TimePicker className="w-full" format="HH:mm" />
                                    </Form.Item>
                                </motion.div>
                            </Col>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Form.Item
                                        name="status"
                                        label="Interview Status"
                                        rules={[{ required: true, message: "Please select a status" }]}
                                    >
                                        <Select placeholder="Select status">
                                            <Option value="scheduled">Scheduled</Option>
                                            <Option value="completed">Completed</Option>
                                            <Option value="cancelled">Cancelled</Option>
                                        </Select>
                                    </Form.Item>
                                </motion.div>
                            </Col>
                            <Col xs={24} md={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Form.Item
                                        name="interviewer"
                                        label="Select Interviewer"
                                        rules={[{ required: true, message: "Please select an interviewer" }]}
                                    >
                                        <Select placeholder="Select interviewer">
                                            {
                                                interviewers?.data?.map((interviewer) => (
                                                    <Option key={interviewer._id} value={interviewer._id}>
                                                        {interviewer.name}
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </motion.div>
                            </Col>
                            <Col span={24} className="flex justify-end">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button type="primary" htmlType="submit" loading={updateLoading} disabled={updateLoading}>
                                        Update Interview
                                    </Button>
                                </motion.div>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </motion.div>
        </>
    );
};

export default EditInterview;