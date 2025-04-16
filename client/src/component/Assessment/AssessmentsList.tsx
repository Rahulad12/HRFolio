import { Button, DatePicker, Form, notification, Popconfirm, Select, Table, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import { EditOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../../Hooks/hook'
import { makeCapitilized } from '../../utils/TextAlter'
import { Trash2 } from 'lucide-react'
import { AssessmentDataResponse } from '../../types'
import { useCreateAssignAssessmentMutation, useDeleteAssessmentMutation } from '../../services/assessmentServiceApi'
import { storeAssessment, storeAssignedAssessment } from '../../action/StoreAssessment'
import type { Dayjs } from 'dayjs'
const AssessmentsList = () => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const { assessments } = useAppSelector(state => state.assessments);
    const { candidate } = useAppSelector(state => state.candidate);

    const [api, contextHolder] = notification.useNotification();

    const [createAssignAssessment] = useCreateAssignAssessmentMutation();

    const [deleteAssessment] = useDeleteAssessmentMutation();

    const handleEditAssessment = () => {

    }
    const handleDeleteAssessment = async (id: string) => {
        try {
            const res = await deleteAssessment(id);
            if (res?.data && res?.data?.success) {
                dispatch(storeAssessment(Array.from(res?.data.data)));
                api.success({
                    message: res.data?.message,
                    placement: "top",
                    duration: 3000,
                })
            }

        } catch (error: any) {
            api.error({
                message: error?.data?.message || "Error deleting assessment",
                placement: "top",
                duration: 3000,
            })
        }

    }

    const handleAssignAssessment = async (candidateId: string, date: Dayjs, assessmnetId: string) => {
        try {
            const res = await createAssignAssessment({ candidate: [candidateId], assessment: assessmnetId, date }).unwrap();
            if (res?.data) {
                dispatch(storeAssignedAssessment(res?.data));
                api.success({
                    message: res.message,
                    placement: "top",
                    duration: 3000,
                })
            }
        } catch (error: any) {
            api.error({
                message: error?.data?.message || "Error assigning assessment",
                placement: "top",
                duration: 3000,
            })
        }
    }

    const columns = [
        {
            title: 'Assessment',
            dataIndex: 'title',
            key: 'assessment',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Technology',
            dataIndex: 'technology',
            key: 'technology',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AssessmentDataResponse) => (
                <div className="flex flex-col gap-2">

                    <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <Tooltip title="Edit Assessment" placement="top">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    type="default"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditAssessment()}
                                    size="small"
                                />
                            </motion.div>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Delete Assessment" placement="top">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Popconfirm
                                    title="Delete this assessment?"
                                    description="Are you sure you want to delete this assessment?"
                                    onConfirm={() => handleDeleteAssessment(record._id)}
                                    okText="Yes"
                                    cancelText="No"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button
                                        danger
                                        type="default"
                                        icon={<Trash2 className="w-4 h-4" />}
                                        size="small"
                                    />
                                </Popconfirm>
                            </motion.div>
                        </Tooltip>
                    </div>

                    {/* Assign Form */}
                    <div className="bg-gray-50 p-2 rounded shadow-inner mt-2">
                        <Form
                            form={form}
                            layout="inline"
                            onFinish={(values) =>
                                handleAssignAssessment(
                                    values[`candidate_${record._id}`],
                                    values[`date_${record._id}`],
                                    record._id
                                )
                            }
                        >
                            <Form.Item
                                name={`candidate_${record._id}`}
                                rules={[{ required: true, message: 'Select candidate' }]}
                            >
                                <Select
                                    size="small"
                                    placeholder="Candidate"
                                    style={{ width: 130 }}
                                    options={candidate.map((c) => ({
                                        label: c.name,
                                        value: c._id,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                name={`date_${record._id}`}
                                rules={[{ required: true, message: 'Pick a date' }]}
                            >
                                <DatePicker size="small" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="small">
                                    Assign
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                </div>
            ),
        }

    ]
    return (
        <div>
            {contextHolder}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-white rounded-lg shadow overflow-hidden"
            >
                <Table
                    columns={columns}
                    dataSource={Array.isArray(assessments) ? assessments : []}
                    size="middle"
                    rowKey="_id"
                    className="antd-table-custom"
                    pagination={{
                        pageSize: 3,
                    }}
                />
            </motion.div>

        </div>
    )
}

export default AssessmentsList
