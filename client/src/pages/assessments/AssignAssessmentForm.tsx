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
    Typography,
} from 'antd';
import React, { Key, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
    useCreateAssignAssessmentMutation,
    useGetAssignmentByIdQuery,
    useUpdateAssignmnetMutation,
} from '../../services/assessmentServiceApi';
import { useAppSelector } from '../../Hooks/hook';
import { useAssessment } from '../../action/StoreAssessment';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCandidate } from '../../action/StoreCandidate';
import { useGetAllEmailTemplateQuery } from '../../services/emailService';
import { AssignmentData } from '../../types';
import { makeCapitilized } from '../../utils/TextAlter';

const AssignAssessment: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<string>();
    const [assignForm] = Form.useForm();
    const isEditing = !!id;

    const [selectedCandidates, setSelectedCandidates] = useState<Key[]>([]);
    const [preview, setPreview] = useState('');

    const { refetch: refetchAssessment } = useAssessment();
    const { refetch: refetchCandidate } = useCandidate();

    const assessments = useAppSelector((state) => state.assessments.assessments);
    const candidates = useAppSelector((state) => state.candidate.candidate);

    const [createAssignAssessment, { isLoading: isCreating }] = useCreateAssignAssessmentMutation();
    const [updateAssignmnet, { isLoading: isUpdating }] = useUpdateAssignmnetMutation();
    const { data: emailTemplates } = useGetAllEmailTemplateQuery();
    const { data: assignedAssessments } = useGetAssignmentByIdQuery(id!, {
        skip: !id,
    });

    useEffect(() => {
        if (isEditing && assignedAssessments?.data) {
            assignForm.setFieldsValue({
                assessment: assignedAssessments.data.assessment?._id,
                dueDate: dayjs(assignedAssessments.data.date),
                emailTemplate: assignedAssessments.data.emailTemplate,
            });

            // Also set selected candidate for preview
            setSelectedCandidates([assignedAssessments.data.candidate._id]);
        }
    }, [assignedAssessments]);

    useEffect(() => {
        handlePreview();
    }, [assignForm, selectedCandidates]);

    const handlePreview = () => {
        const values = assignForm.getFieldsValue();
        const selectedTemplate = emailTemplates?.data?.find(t => t._id === values.emailTemplate);
        const selectedAssessment = assessments?.find(a => a._id === values.assessment);

        if (!selectedTemplate || !selectedAssessment) {
            setPreview('');
            return;
        }

        const candidateInfo = candidates.find(c => selectedCandidates.includes(c._id));
        if (!candidateInfo) {
            setPreview('');
            return;
        }

        const html = selectedTemplate.body
            .replace(/{{candidateName}}/g, candidateInfo.name)
            .replace(/{{technology}}/g, selectedAssessment.technology || '')
            .replace(/{{duration}}/g, selectedAssessment?.duration?.toString() || "")
            .replace(/{{assessmentDate}}/g, selectedAssessment.createdAt ? dayjs(selectedAssessment.createdAt).format('MMMM D, YYYY') : '')
            .replace(/{{assessmentTime}}/g, selectedAssessment.createdAt ? dayjs(selectedAssessment.createdAt).format('hh:mm A') : '')
            .replace(/{{level}}/g, selectedAssessment.level || '')
            .replace(/{{assessmentLink}}/g, selectedAssessment.assessmentLink || '');

        setPreview(html);
    };

    const handleTransferChange = (targetKeys: Key[]): void => {
        setSelectedCandidates(targetKeys);
    };

    const handleAssign = async (values: AssignmentData) => {
        if (!isEditing && selectedCandidates.length === 0) {
            message.warning('Please select at least one candidate.');
            return;
        }

        try {
            if (isEditing) {
                const res = await updateAssignmnet({ id: id!, data: values }).unwrap();
                if (res?.success && res?.data) {
                    message.success(res.message);
                    assignForm.resetFields();
                    setSelectedCandidates([]);
                    refetchAssessment();
                    refetchCandidate();
                    navigate('/dashboard/assessments/assignments');
                }
            } else {
                const payload = {
                    assessment: values.assessment,
                    candidate: selectedCandidates,
                    dueDate: dayjs(values.dueDate).format('YYYY-MM-DD'),
                    status: 'assigned' as AssignmentData['status'],
                    emailTemplate: values.emailTemplate,
                };
                const res = await createAssignAssessment(payload).unwrap();
                if (res?.success && res?.data) {
                    message.success(res.message);
                    assignForm.resetFields();
                    setSelectedCandidates([]);
                    refetchAssessment();
                    refetchCandidate();
                    navigate('/dashboard/assessments/assignments');
                }
            }
        } catch (error: any) {
            console.error(error);
            message.error(error?.data?.message || 'Something went wrong');
        }
    };

    const transferData = candidates.map((candidate) => ({
        key: candidate._id.toString(),
        name: makeCapitilized(candidate.name || ''),
        technology: makeCapitilized(candidate.technology || ''),
        level: makeCapitilized(candidate.level || ''),
    }));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 flex items-center">
                <Button
                    type="text"
                    icon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/dashboard/assessments/assignments')}
                />
                <Typography.Title level={2} className="ml-2 text-lg font-semibold">
                    {isEditing ? 'Edit Assignment' : 'Assign Assessment'}
                </Typography.Title>
                {isEditing && (
                    <Typography.Text className="ml-3">
                        ({makeCapitilized(assignedAssessments?.data?.candidate?.name || '')})
                    </Typography.Text>
                )}
            </div>
            <Row gutter={16}>
                <Col xs={24} md={12} lg={14}>
                    <Card>
                        <Form
                            form={assignForm}
                            layout="vertical"
                            onFinish={handleAssign}
                            onValuesChange={handlePreview}
                        >
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="assessment"
                                        label="Select Assessment"
                                        rules={[{ required: true, message: 'Please select an assessment' }]}
                                    >
                                        <Select placeholder="Select assessment" allowClear showSearch
                                            options={
                                                assessments?.map((assessment) => ({
                                                    value: assessment._id,
                                                    label: makeCapitilized(assessment.title),
                                                }))
                                            }
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="dueDate"
                                        label="Due Date"
                                        rules={[
                                            { required: true, message: 'Please select a due date' },
                                            {
                                                validator: (_, value) =>
                                                    value && dayjs(value).isBefore(dayjs().startOf('day'))
                                                        ? Promise.reject(new Error('Due date cannot be in the past'))
                                                        : Promise.resolve(),
                                            },
                                        ]}
                                    >
                                        <DatePicker style={{ width: '100%' }}
                                            disabledDate={
                                                (current) => {
                                                    return current && current < dayjs().startOf('day');
                                                }
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="emailTemplate"
                                        label="Email Template"
                                        rules={[{ required: true, message: 'Please select an email template' }]}
                                    >
                                        <Select placeholder="Select email template" allowClear
                                            options={
                                                emailTemplates?.data?.filter((template) => template.type === 'assessment')?.map((template) => ({
                                                    value: template._id,
                                                    label: makeCapitilized(template.name),
                                                }))
                                            }
                                            showSearch
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                        /
                                        >
                                    </Form.Item>
                                </Col>
                            </Row>

                            {!isEditing && (
                                <Form.Item label="Select Candidates" required>
                                    <Transfer
                                        dataSource={transferData}
                                        titles={['Available', 'Selected']}
                                        targetKeys={selectedCandidates}
                                        onChange={handleTransferChange}
                                        render={(item) => `${item.name} (${item.technology} - ${item.level})`}
                                        listStyle={{ width: 300, height: 300 }}
                                        rowKey={(item) => item.key}
                                        showSearch
                                        filterOption={(input, item) => item.name.toLowerCase().includes(input.toLowerCase())}
                                    />
                                </Form.Item>
                            )}

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
                                            loading={isCreating || isUpdating}
                                        >
                                            {isEditing ? 'Update' : 'Assign'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Email Preview">
                        {preview ? (
                            <div className="whitespace-pre-line">{preview}</div>
                        ) : (
                            <div className="text-center text-gray-500 py-6">
                                <p>Select a candidate, assessment, and email template to preview</p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default AssignAssessment;
