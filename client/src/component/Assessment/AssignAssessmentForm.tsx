import { Button, DatePicker, Form, message, notification, Select, Transfer } from 'antd';
import { Key, useState } from 'react';
import type { Dayjs } from 'dayjs';
import { useCreateAssignAssessmentMutation } from '../../services/assessmentServiceApi';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';
import { storeAssignedAssessment } from '../../action/StoreAssessment';

const AssignAssessmentForm = () => {
    const dispatch = useAppDispatch();
    const [assignForm] = Form.useForm();
    const [selectedCandidates, setSelectedCandidates] = useState<Key[]>([]);

    const assessments = useAppSelector(state => state.assessments.assessments);
    const candidates = useAppSelector(state => state.candidate.candidate);

    const [createAssignAssessment, { isLoading }] = useCreateAssignAssessmentMutation();

    const handleTranseferChange = (targetKeys: Key[]): void => {
        setSelectedCandidates(targetKeys);
    }
    const handleAssign = async (values: { assessmentId: string, dueDate: Dayjs }) => {
        try {
            if (selectedCandidates.length === 0) {
                message.warning('Please select at least one candidate.');
                return;
            }
            const payload = {
                assessment: values.assessmentId,
                candidate: selectedCandidates,
                date: values.dueDate,
            };
            const res = await createAssignAssessment(payload).unwrap();

            if (res?.data && res?.success) {
                dispatch(storeAssignedAssessment(res.data));
                notification.success({
                    message: `${res?.message}`,
                    placement: 'top',
                    duration: 3000
                })
            }
            assignForm.resetFields();
            setSelectedCandidates([]);
        } catch (error: any) {
            console.error(error);
            notification.error({
                message: `${error?.data?.message}`,
                placement: 'top',
                duration: 3000
            })
        }
    };

    // Map candidates for Transfer component (must have key field as string)
    const transferData = candidates.map(candidate => ({
        key: candidate._id,
        name: candidate.name,
        technology: candidate.technology,
        level: candidate.level,
    }));



    return (
        <div>
            <Form
                form={assignForm}
                layout="vertical"
                onFinish={handleAssign}
            >
                <Form.Item
                    name="assessmentId"
                    label="Select Assessment"
                    rules={[{ required: true, message: 'Please select an assessment' }]}
                >
                    <Select placeholder="Select assessment" style={{ width: '100%' }} allowClear>
                        {assessments?.map(assessment => (
                            <Select.Option key={assessment._id} value={assessment._id}>
                                {assessment.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="dueDate"
                    label="Due Date"
                    rules={[{ required: true, message: 'Please select a due date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Select Candidates">
                    <Transfer
                        dataSource={transferData}
                        titles={['Available', 'Selected']}
                        targetKeys={selectedCandidates}
                        onChange={handleTranseferChange}
                        render={item => `${item.name} (${item.technology} - ${item.level})`}
                        listStyle={{ width: 300, height: 300 }}
                        rowKey={item => item.key}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Assign
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AssignAssessmentForm;
