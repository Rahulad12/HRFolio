import { Form, Input, InputNumber, Select, Upload, Button, Space } from "antd";
import { candidateFormData } from "../../types/index"
import { MinusCircle, PlusCircle } from "lucide-react";
import { UploadOutlined } from '@ant-design/icons';

interface formProps {
    submitHandler: (formData: candidateFormData) => void;
    loading: boolean;
}

const { Option } = Select;

const CandidateForm = ({ submitHandler, loading }: formProps) => {
    const [form] = Form.useForm();
    const onFinish = (formData: candidateFormData) => {
        submitHandler(formData);
        // console.log(formData);
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6">Upload Candidate Details</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[{ required: true, message: 'Please enter candidate name' }]}
                        >
                            <Input size="large" placeholder="John Doe" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter a valid email' },
                            ]}
                        >
                            <Input size="large" placeholder="john@example.com" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                            <Input size="large" placeholder="+1234567890" />
                        </Form.Item>

                        <Form.Item
                            name="technology"
                            label="Technology"
                            rules={[{ required: true, message: 'Please select technology' }]}
                        >
                            <Select size="large" placeholder="Select technology">
                                <Option value="React JS">React JS</Option>
                                <Option value="Dot Net">Dot Net</Option>
                                <Option value="DevOps">DevOps</Option>
                                <Option value="QA">QA</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="level"
                            label="Level"
                            rules={[{ required: true, message: 'Please select level' }]}
                        >
                            <Select size="large" placeholder="Select level">
                                <Option value="Junior">Junior</Option>
                                <Option value="Mid">Mid</Option>
                                <Option value="Senior">Senior</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="experience"
                            label="Experience (years)"
                            rules={[{ required: true, message: 'Please enter experience' }]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                max={50}
                                className="w-full"
                                placeholder="Years of experience"
                            />
                        </Form.Item>

                        <Form.Item
                            name="expectedsalary"
                            label="Expected Salary"
                            rules={[{ required: true, message: 'Please enter expected salary' }]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                className="w-full"
                                placeholder="Expected salary"
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="resume"
                            label="CV Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: 'Please upload CV' }]}
                            className="col-span-2"
                        >
                            <Upload
                                maxCount={1}
                                beforeUpload={() => false}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            >
                                <Button icon={<UploadOutlined />}>Click to Upload CV</Button>
                            </Upload>
                        </Form.Item>
                    </div>

                    <Form.List name="references">
                        {(fields, { add, remove }) => (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">References</h3>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusCircle className="w-4 h-4" />}
                                    >
                                        Add Reference
                                    </Button>
                                </div>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} className="flex items-start border p-4 rounded">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Missing name' }]}
                                        >
                                            <Input placeholder="Reference name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'contact']}
                                            rules={[{ required: true, message: 'Missing contact' }]}
                                        >
                                            <Input placeholder="Contact info" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'relation']}
                                            rules={[{ required: true, message: 'Missing relation' }]}
                                        >
                                            <Input placeholder="Relation" />
                                        </Form.Item>
                                        <MinusCircle
                                            className="w-5 h-5 text-red-500 cursor-pointer mt-2"
                                            onClick={() => remove(name)}
                                        />
                                    </Space>
                                ))}
                            </div>
                        )}
                    </Form.List>

                    <Form.Item className="mt-6">

                        <Button type="primary" htmlType="submit" size="middle" loading={loading} disabled={loading}>
                            Submit Application
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default CandidateForm;
