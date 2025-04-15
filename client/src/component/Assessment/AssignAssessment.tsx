import { Input, Select, Transfer } from 'antd'
import React, { useState } from 'react'
import { Form } from 'antd'

const AssignAssessment = () => {
    const [assignForm] = Form.useForm();
    const { Option } = Select;
    const assessments = [{
        id: 1,
        name: "Assessment 1",
        candidates: [
            {
                id: 1,
                name: "Candidate 1",
                technology: "Technology 1",
                level: "Level 1",
            },
            {
                id: 2,
                name: "Candidate 2",
                technology: "Technology 2",
                level: "Level 2",
            },
        ]
    }]
    const data = [{
        key: '1',
        assessment: 'Assessment 1',
        type: 'Type 1',
        technology: 'React Js',
        level: "Junior",
    },
    {
        key: '2',
        assessment: 'Assessment 2',
        type: 'Type 2',
        technology: 'React Js',
        level: "Junior",
    }
    ]
    const [selectedAssessment, setSelectedAssessment] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    return (
        <div>
            <Form form={assignForm} layout="vertical">
                <Form.Item
                    name="assessmentId"
                    label="Select Assessment"
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="Select assessment"
                        onChange={(value) => setSelectedAssessment(value)}
                    >
                        {assessments.map(assessment => (
                            <Option key={assessment.id} value={assessment.id}>
                                {assessment.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="dueDate"
                    label="Due Date"
                    rules={[{ required: true }]}
                >
                    <Input type="date" />
                </Form.Item>

                <Form.Item label="Select Candidates">
                    <Transfer
                        dataSource={data}
                        titles={['Available', 'Selected']}
                        targetKeys={selectedCandidates}
                        // onChange={setSelectedCandidates}
                        // render={item => `${item.name} (${item.technology} - ${item.level})`}
                        listStyle={{
                            width: 300,
                            height: 300,
                        }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}

export default AssignAssessment
