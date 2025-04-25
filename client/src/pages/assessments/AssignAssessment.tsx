import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    message,
    Row,
    Select,
    Transfer,
} from 'antd';
import { Key, useState } from 'react';
import type { Dayjs } from 'dayjs';
import { useCreateAssignAssessmentMutation } from '../../services/assessmentServiceApi';
import { useAppSelector } from '../../Hooks/hook';
import { useAssessment } from '../../action/StoreAssessment';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCandidate } from '../../action/StoreCandidate';
import dayjs from 'dayjs';


const AssignAssessment = () => {
    const navigate = useNavigate();
    const [assignForm] = Form.useForm();
    const [selectedCandidates, setSelectedCandidates] = useState<Key[]>([]);

    const { refetch: refetchAssessment } = useAssessment();
    const { refetch: refetchCandidate } = useCandidate();

    const assessments = useAppSelector((state) => state.assessments.assessments);
    const candidates = useAppSelector((state) => state.candidate.candidate);

    const [createAssignAssessment, { isLoading }] = useCreateAssignAssessmentMutation();

    const handleTranseferChange = (targetKeys: Key[]): void => {
        setSelectedCandidates(targetKeys);
    };

    const handleAssign = async (values: { assessmentId: string; dueDate: Dayjs }) => {
        if (selectedCandidates.length === 0) {
            message.warning('Please select at least one candidate.');
            return;
        }

        try {
            const payload = {
                assessment: values.assessmentId,
                candidate: selectedCandidates,
                date: dayjs(values.dueDate).format('YYYY-MM-DD'),
            };
            const res = await createAssignAssessment(payload).unwrap();
            if (res?.success && res?.data) {
                message.success(res.message);
                assignForm.resetFields();
                setSelectedCandidates([]);
                refetchAssessment();
                refetchCandidate();
            }
        } catch (error: any) {
            console.error(error);
            message.error(error.data.message);
        }
    };

    const transferData = candidates.map((candidate) => ({
        key: candidate._id,
        name: candidate.name,
        technology: candidate.technology,
        level: candidate.level,
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-6 flex items-center">
                <Button
                    type="text"
                    icon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/dashboard/assessments/assignments')}
                />
                <h2 className="ml-2 text-lg font-semibold">Assign Assessment</h2>
            </div>

            <Card>
                <Form
                    form={assignForm}
                    layout="vertical"
                    onFinish={handleAssign}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="assessmentId"
                                label="Select Assessment"
                                rules={[{ required: true, message: 'Please select an assessment' }]}
                            >
                                <Select placeholder="Select assessment" allowClear >
                                    {assessments?.map((assessment) => (
                                        <Select.Option key={assessment._id} value={assessment._id} className="capitalize">
                                            {assessment.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="dueDate"
                                label="Due Date"
                                rules={[{ required: true, message: 'Please select a due date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Select Candidates"
                        required
                    >
                        <Transfer
                            dataSource={transferData}
                            titles={['Available', 'Selected']}
                            targetKeys={selectedCandidates}
                            onChange={handleTranseferChange}
                            render={(item) => `${item.name} (${item.technology} - ${item.level})`}
                            listStyle={{ width: 300, height: 300 }}
                            rowKey={(item) => item.key}
                            showSearch
                        />
                    </Form.Item>

                    <Form.Item>
                        <Row justify="end" gutter={12}>
                            <Col>
                                <Button
                                    type="default"
                                    icon={<X size={16} />}
                                    onClick={() => navigate('/dashboard/assessments/assignments')}
                                >
                                    Cancel
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                >
                                    Assign
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Card>
        </motion.div>
    );
};

export default AssignAssessment;
