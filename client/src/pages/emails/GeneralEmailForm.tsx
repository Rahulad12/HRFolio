import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Row,
    Typography,
    Upload,
} from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCandidate } from '../../action/StoreCandidate';
import { candidateData } from '../../types';
import { useCreateGeneralEmailMutation } from '../../services/emailService';

const { Title, Text } = Typography;

interface formData {
    emailAddress: string;
    subject: string;
    body: string;
    attachment: any[];
}

const GeneralEmailForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<string>();
    const [emailForm] = Form.useForm();
    const { data: candidates } = useCandidate();

    const [createGeneralEmail, { isLoading: isCreating }] = useCreateGeneralEmailMutation();
    const selectedCandidate = candidates?.data?.find((c: candidateData) => c._id === id);

    const [previewData, setPreviewData] = useState<formData>({
        subject: '',
        body: '',
        emailAddress: '',
        attachment: [],
    });

    const handleFormChange = () => {
        const values = emailForm.getFieldsValue();

        setPreviewData({
            emailAddress: selectedCandidate?.email || '',
            subject: values.subject || '',
            body: values.body || '',
            attachment: values.attachment || '',
        });
    };

    const onFinish = async (values: formData) => {

        const payload = {
            ...values,
            candidate: selectedCandidate?._id,
            emailAddress: selectedCandidate?.email,
            attachment: values.attachment?.[0]?.originFileObj || null,
        }

        try {
            const res = await createGeneralEmail(payload).unwrap();
            if (res?.success) {
                message.success(res.message);
                navigate('/dashboard/candidates');
                emailForm.resetFields();
            }
        } catch (error: any) {
            console.error('Submission failed', error);
            message.error(error?.data?.message);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex items-center">
                <Button
                    type="text"
                    icon={<ArrowLeft size={18} />}
                    className="mr-3"
                    onClick={() => navigate('/dashboard/candidates')}
                />
                <Title level={3}>Send General Email</Title>
            </div>

            {/* Layout */}
            <Row gutter={[16, 16]}>
                {/* Form Column */}
                <Col md={12} xs={24} lg={12}>
                    <Card>
                        <Form
                            form={emailForm}
                            layout="vertical"
                            autoComplete="off"
                            onFinish={onFinish}
                            onValuesChange={handleFormChange}
                        >

                            <Form.Item
                                label="Subject"
                                name="subject"
                                rules={[{ required: true, message: 'Please input the subject!' }]}
                            >
                                <Input placeholder="Subject" />
                            </Form.Item>

                            <Form.Item
                                label="Body"
                                name="body"
                                rules={[{ required: true, message: 'Please input the body!' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Email body content" />
                            </Form.Item>

                            <Form.Item
                                label="Attachment"
                                name="attachment"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                            >
                                <Upload beforeUpload={() => false}>
                                    <Button icon={<Upload />}>Click to Upload</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item className="flex justify-end">
                                <Button type="primary" htmlType="submit" loading={isCreating} disabled={isCreating}>
                                    Send Email
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Live Preview Column */}
                <Col md={12} xs={24} lg={12}>
                    <Card title="Live Email Preview">
                        {previewData.subject || previewData.body ? (
                            <div className="space-y-4">
                                <div>
                                    <Text strong>To:</Text>{' '}
                                    <span>{previewData.emailAddress || '[Candidate Email]'}</span>
                                </div>
                                <div>
                                    <Text strong>Subject:</Text>{' '}
                                    <span>{previewData.subject || '[Email Subject]'}</span>
                                </div>
                                <div>
                                    <Text strong>Body:</Text>
                                    <div className="whitespace-pre-wrap mt-1 border p-2 bg-gray-50 rounded text-sm text-gray-700">
                                        {previewData.body || '[Email Body]'}
                                    </div>
                                </div>
                                {previewData.attachment?.length > 0 && (
                                    <div>
                                        <Text strong>Attachment:</Text>{' '}
                                        <span>{previewData.attachment[0]?.name}</span>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="text-gray-500 text-center py-8">
                                Fill out the form to preview the email content here.
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default GeneralEmailForm;
