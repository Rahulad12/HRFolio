import { Button, notification, Popconfirm, Tooltip, Modal } from 'antd'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../Hooks/hook'
import { makeCapitilized } from '../../utils/TextAlter'
import { Edit, Trash2 } from 'lucide-react'
import { AssessmentDataResponse, assessmentFormData } from '../../types'
import { useDeleteAssessmentMutation } from '../../services/assessmentServiceApi'
import { storeAssessment } from '../../action/StoreAssessment'
import EditAssessment from '../Form/Edit/EditAssessment'
import { useState } from 'react'
import { useUpdateAssessmentMutation } from "../../services/assessmentServiceApi";
import CustomTable from '../common/Table'
import type { TableColumnsType } from 'antd';
FIX: "IF I click update with out any changing then the store is being clear if i do any change then it will run perfectly"
const AssessmentsList = () => {
    const dispatch = useAppDispatch();

    const { assessments } = useAppSelector(state => state.assessments);

    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [assessmentId, setAssessmentId] = useState<string>("");
    const showModal = (id: string) => {
        setIsModalOpen(true);
        setAssessmentId(id);
    }
    const handleCancel = () => setIsModalOpen(false);


    const [deleteAssessment] = useDeleteAssessmentMutation();
    const [updateAssessment] = useUpdateAssessmentMutation();
    const handleEditAssessment = async (value: assessmentFormData) => {
        try {
            const res = await updateAssessment({ id: assessmentId, data: value });
            console.log(res);
            if (res?.data && res?.data?.success) {
                dispatch(storeAssessment(Array.from(res?.data.data)));
                api.success({
                    message: res.data?.message,
                    placement: "topRight",
                    duration: 3000,
                })
            }
        } catch (error: any) {
            api.error({
                message: error?.data?.message || "Error updating assessment",
                placement: "topRight",
                duration: 3000,
            })
        }
    }
    const handleDeleteAssessment = async (id: string) => {
        try {
            const res = await deleteAssessment(id);
            if (res?.data && res?.data?.success) {
                dispatch(storeAssessment(Array.from(res?.data.data)));
                api.success({
                    message: res.data?.message,
                    placement: "topRight",
                    duration: 3000,
                })
            }
        } catch (error: any) {
            api.error({
                message: error?.data?.message || "Error deleting assessment",
                placement: "topRight",
                duration: 3000,
            })
        }
    }

    const columns: TableColumnsType<AssessmentDataResponse> = [
        {
            title: 'Assessment',
            dataIndex: 'title',
            key: 'assessment',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span className='font-semibold'>{makeCapitilized(text)}</span>
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
                <div className="flex gap-2">
                    {/* Edit Button */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Edit Assessment" placement="top">
                            <Button
                                type="text"
                                icon={<Edit className='w-4 h-4' />}
                                onClick={() => showModal(record._id)}
                            />
                        </Tooltip>
                    </motion.div>

                    {/* Delete Button */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Delete Assessment" placement="top">
                            <Popconfirm
                                title="Delete this assessment?"
                                description="Are you sure you want to delete, This action cannot be undone."
                                okButtonProps={{ danger: true }}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => handleDeleteAssessment(record._id)}
                            >
                                <Button
                                    danger
                                    type="text"
                                    icon={<Trash2 className="w-4 h-4" />}
                                />
                            </Popconfirm>
                        </Tooltip>
                    </motion.div>

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
                <CustomTable
                    loading={false}
                    data={assessments}
                    columns={columns}
                    pageSize={5}
                />
                <Modal
                    onCancel={handleCancel}
                    open={isModalOpen}
                    footer={null}
                >
                    <EditAssessment handleEdit={handleEditAssessment} id={assessmentId} />
                </Modal>
            </motion.div>
        </div>
    )
}

export default AssessmentsList
