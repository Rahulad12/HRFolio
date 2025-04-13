import { interviewData } from '../../types'
import { Col, DatePicker, Form, Row, Select, Button, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { useAppSelector } from '../../Hooks/hook'
import { makeCapitilized } from '../../utils/TextAlter'
const { Option } = Select


interface Props {
    submitHandler: (formData: interviewData) => void
    loading: boolean
}

const InterviewForm = ({ submitHandler, loading }: Props) => {
    const [form] = Form.useForm()

    const canidate = useAppSelector((state) => state.candidate.canditate);
    const filteredCandidates = canidate.filter((candidate) => candidate.status !== 'rejected');

    const interviewer = [
        { key: 1, name: "Devi Parsad" },
        { key: 2, name: "Ram Tiwari" },
    ]
    const onFinish = (values: interviewData) => {
        submitHandler({
            ...values,
            date: values.date?.format('YYYY-MM-DD'),
        })
    }

    return (
        <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={24}>
                    {/* First Column - Candidate, Interviewer, Time */}
                    <Col xs={24} md={12}>
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

                        <Form.Item
                            name="interviewer"
                            label="Interviewer"
                            rules={[{ required: true, message: "Please select an interviewer" }]}
                        >
                            <Select placeholder="Select Interviewer" size="large" allowClear>
                                {interviewer.map((i) => (
                                    <Option key={i.key} value={i.name}>
                                        {i.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>


                        <Form.Item name="time" label="Interview Time" rules={[{ required: true }]}>
                            <TimePicker format="HH:mm" className="w-full" />
                        </Form.Item>
                    </Col>

                    {/* Second Column - Calendar Picker (Only Date) */}
                    <Col xs={24} md={12}>
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
                    </Col>
                </Row>

                <Form.Item className="text-right mt-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        disabled={loading}
                    >
                        Schedule Interview
                    </Button>
                </Form.Item>
            </Form>
        </div >
    )
}

export default InterviewForm
