import { Button, Table } from 'antd'
import { motion } from 'framer-motion'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
const AssessmentsList = () => {

    const handleEditAssessment = () => {

    }
    const handleDeleteAssessment = () => {

    }
    const columns = [
        {
            title: 'Assessment',
            dataIndex: 'assessment',
            key: 'assessment',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Technology',
            dataIndex: 'technology',
            key: 'technology',
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditAssessment()}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteAssessment()}
                    />
                </div>
            ),
        },

    ]

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

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-white rounded-lg shadow overflow-hidden"
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    size='small'
                    className="antd-table-custom"
                />
            </motion.div>

        </div>
    )
}

export default AssessmentsList
