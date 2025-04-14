import { Form, Input, InputNumber, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MinusCircle, PlusCircle } from "lucide-react";
import { candidateFormData } from "../../types/index";

interface formProps {
    submitHandler: (formData: candidateFormData) => void;
    loading: boolean;
}

const techOptions = ["react js", "dot net", "devops", "qa"];
const levelOptions = ["junior", "mid", "senior"];

const CandidateForm = ({ submitHandler, loading }: formProps) => {
    const [form] = Form.useForm();

    const onFinish = (formData: candidateFormData) => {
        const filterFormData = {
            ...formData,
            name: formData.name.trim().toLowerCase(),
            email: formData.email.trim().toLowerCase(),
            experience: Number(formData.experience),
            expectedsalary: Number(formData.expectedsalary),
        };
        submitHandler(filterFormData);
    };

    const normFile = (e: any) => Array.isArray(e) ? e : e?.fileList;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6">Upload Candidate Details</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[{ required: true, message: "Please enter candidate name" }]}
                        >
                            <Input size="large" placeholder="Krishna Parsad" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Please enter email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input size="large" placeholder="example@example.com" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[
                                { required: true, message: "Please enter phone number" },
                                {
                                    pattern: /^[0-9]{10}$/,
                                    message: "Enter a valid 10-digit phone number",
                                },
                            ]}
                        >
                            <Input size="large" placeholder="9876543210" maxLength={10} />
                        </Form.Item>

                        <Form.Item
                            name="technology"
                            label="Technology"
                            rules={[{ required: true, message: "Please select technology" }]}
                        >
                            <Select size="large" placeholder="Select technology">
                                {techOptions.map((tech) => (
                                    <Select.Option key={tech} value={tech}>
                                        {tech.toUpperCase()}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="level"
                            label="Level"
                            rules={[{ required: true, message: "Please select level" }]}
                        >
                            <Select size="large" placeholder="Select level">
                                {levelOptions.map((lvl) => (
                                    <Select.Option key={lvl} value={lvl}>
                                        {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="experience"
                            label="Experience (years)"
                            rules={[{ required: true, message: "Please enter experience" }]}
                        >
                            <InputNumber
                                min={0}
                                max={50}
                                className="w-full"
                                size="large"
                                placeholder="Years of experience"
                            />
                        </Form.Item>

                        <Form.Item
                            name="expectedsalary"
                            label="Expected Salary"
                            rules={[{ required: true, message: "Please enter expected salary" }]}
                        >
                            <InputNumber
                                min={0}
                                size="large"
                                className="w-full"
                                placeholder="Expected salary"
                                formatter={(value) =>
                                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="resume"
                            label="CV Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: "Please upload CV" }]}
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
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">References</h3>
                                    <Button
                                        type="dashed"
                                        icon={<PlusCircle className="w-4 h-4" />}
                                        onClick={() => add()}
                                        className="text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white m-2"
                                    >
                                        Add Reference
                                    </Button>
                                </div>

                                {fields.map(({ key, name, ...restField }) => (
                                    <div
                                        key={key}
                                        className="bg-gray-50 border border-gray-200 p-4 rounded-lg relative"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Form.Item
                                                {...restField}
                                                name={[name, "name"]}
                                                label="Name"
                                            >
                                                <Input placeholder="Reference name" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "contact"]}
                                                label="Contact"
                                            >
                                                <Input placeholder="Contact info" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "relation"]}
                                                label="Relation"
                                            >
                                                <Input placeholder="Relation" />
                                            </Form.Item>
                                        </div>

                                        <Button
                                            type="text"
                                            danger
                                            icon={<MinusCircle className="w-5 h-5" />}
                                            onClick={() => remove(name)}
                                            className="absolute top-4 right-4"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form.List>

                    <Form.Item className="mt-8 text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            disabled={loading}
                            className="my-2"
                        >
                            Submit Application
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CandidateForm;
