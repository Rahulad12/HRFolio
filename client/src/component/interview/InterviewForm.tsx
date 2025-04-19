import { interviewData } from '../../types'
import { Col, DatePicker, Form, Row, Select, Button, TimePicker, notification, Typography } from 'antd'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '../../Hooks/hook'
import { makeCapitilized } from '../../utils/TextAlter'
import { useGetCandidateQuery } from '../../services/candidateServiceApi'
import { useEffect } from 'react'
import { storeCandidate } from '../../action/SoreCandidate'
import { motion } from 'framer-motion'
import { useCreateInterviewMutation, useGetInterviewerQuery } from '../../services/interviewServiceApi';

const { Option } = Select


const InterviewForm = () => {
    const [form] = Form.useForm()
    const dispatch = useAppDispatch();

    const [createInterview, { isLoading: interviewCreateLoading }] = useCreateInterviewMutation();
    const { data: canidateData } = useGetCandidateQuery({
        name: "",
        technology: "",
        status: "",
        level: ""
    });
    const { data: interviewer } = useGetInterviewerQuery();
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        if (canidateData?.data) {
            dispatch(storeCandidate(canidateData.data));
        }
    })
    const candidate = useAppSelector((state) => state.candidate.candidate);
    const filteredCandidates = candidate?.filter((candidate) => candidate.status !== 'rejected' && candidate.status !== 'hired' && candidate.status !== "shortlisted");

    const onFinish = async (values: interviewData) => {
        console.log(values);
        try {
            const res = await createInterview({
                ...values,
                date: dayjs(values.date.format("YYYY-MM-DD" + " " + "HH:mm:ss")),
            }).unwrap();
            if (res.success) {
                api.success({
                    message: `${makeCapitilized(res.message)}`,
                    description: 'The interview has been successfully scheduled.',
                    placement: 'topRight',
                })
                form.resetFields();
            }
        } catch (error: any) {
            api.error({
                message: `${makeCapitilized(error.message)}`,
                description: 'An error occurred while scheduling the interview. Please try again.',
                placement: 'topRight',
            })
        }
    }

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {contextHolder}

            <Typography.Title level={3}>
                Schedule Interview
            </Typography.Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={12}>
                    <Col span={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Form.Item
                                name="candidate"
                                label="Candidate"
                                rules={[{ required: true, message: "Please select a candidate" }]}
                            >
                                <Select placeholder="Select Candidate" size="large" allowClear>
                                    {filteredCandidates?.map((c) => (
                                        <Option key={c.name} value={c._id}>
                                            {makeCapitilized(c.name)}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </motion.div>
                    </Col>

                    <Col span={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Form.Item
                                name="interviewer"
                                label="Interviewer"
                                rules={[{ required: true, message: "Please select an interviewer" }]}
                            >
                                <Select placeholder="Select Interviewer" size="large" allowClear>
                                    {interviewer?.data?.map((i) => (
                                        <Option key={i._id} value={i._id}>
                                            {i.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </motion.div>
                    </Col>
                    <Col span={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Form.Item name="time" label="Interview Time" rules={[{ required: true }]}>
                                <TimePicker format="HH:mm" className="w-full" size='large' />
                            </Form.Item>
                        </motion.div>
                    </Col>

                    <Col span={12}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Form.Item
                                name="date"
                                label="Interview Date"
                                rules={[{ required: true, message: "Please select a date" }]}
                            >
                                <DatePicker
                                    size="large"
                                    className="w-full"
                                    format="YYYY-MM-DD"
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </motion.div>
                    </Col>
                </Row>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-right mt-4"
                >
                    <Form.Item>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={interviewCreateLoading}
                                disabled={interviewCreateLoading}
                            >
                                Schedule Interview
                            </Button>
                        </motion.div>
                    </Form.Item>
                </motion.div>
            </Form>
        </motion.div >
    )
}

export default InterviewForm