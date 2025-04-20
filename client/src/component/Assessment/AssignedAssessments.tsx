import { Button, Modal, notification, Popconfirm, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../Hooks/hook'
import { Edit, Trash2 } from 'lucide-react'
import { makeCapitilized } from '../../utils/TextAlter'
import dayjs from 'dayjs'
import { useDeleteAssignmentMutation, useUpdateAssignmnetMutation } from '../../services/assessmentServiceApi'
import { storeAssignedAssessment } from '../../action/StoreAssessment'
import EditAssignment from '../Form/Edit/EditAssignment'
import { useState } from 'react'
import { AssignmentData, AssignmentDataResponse } from '../../types'
import CustomTable from '../common/Table'

import { candidateData, assessmentFormData } from '../../types'



const AssignedAssessments = () => {
    const dispatch = useAppDispatch();

    const { assignedAssessments } = useAppSelector(state => state.assessments);
    const filterAssigned: AssignmentDataResponse[] = assignedAssessments?.filter(item => item.assessment !== null);
    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [assignmentId, setAssignmentId] = useState<string>('');

    const showModal = (id: string) => {
        setIsModalOpen(true)
        setAssignmentId(id)
    };
    const handleCancel = () => setIsModalOpen(false);

    const [deleteAssignment] = useDeleteAssignmentMutation();
    const [updateAssignmnet] = useUpdateAssignmnetMutation();
    const handleEditAssessment = async (value: AssignmentData) => {
        try {
            const res = await updateAssignmnet({ data: value, id: assignmentId });
            if (res.data && res?.data?.success) {
                dispatch(storeAssignedAssessment(Array.from(res?.data?.data)));
                api.success({
                    message: `${res?.data?.message}`,
                    placement: "topRight",
                    duration: 3000,
                })
            }
        } catch (error: any) {
            api.error({
                message: `${error?.data?.message}`,
                placement: "topRight",
                duration: 3000,
            })
        }
    }
    const handleDeleteAssessment = async (id: string) => {
        try {
            const res = await deleteAssignment(id);
            if (res.data && res?.data?.success) {
                dispatch(storeAssignedAssessment(Array.from(res?.data?.data)));
                api.success({
                    message: `${res?.data?.message}`,
                    placement: "topRight",
                    duration: 3000,
                })
            }

        } catch (error: any) {
            api.error({
                message: `${error?.data?.message}`,
                placement: "topRight",
                duration: 3000,
            })
        }
    }
    const columns = [
        {
            title: 'Assessment',
            dataIndex: 'assessment',
            key: 'assessment',
            render: (record: assessmentFormData) => (
                console.log(record),
                <div className='flex gap-2'>
                    <span className='font-semibold'>{makeCapitilized(record?.title)}</span>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'assessment',
            key: 'type',
            render: (record: assessmentFormData) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(record?.type)}</span>
                </div>
            )
        },
        {
            title: 'Technology',
            dataIndex: 'assessment',
            key: 'technology',
            render: (record: assessmentFormData) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(record?.technology)}</span>
                </div>
            )
        },


        {
            title: 'Level',
            dataIndex: 'assessment',
            key: 'level',
            render: (record: assessmentFormData) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(record?.level)}</span>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{dayjs(text).format('YYYY-MM-DD')}</span>
                </div>
            )
        },
        {
            title: 'Candidate',
            dataIndex: 'candidate',
            key: 'candidate',
            render: (record: candidateData) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(record?.name)}</span>
                    {/* <span>{makeCapitilized(record)}</span> */}
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AssignmentDataResponse) => (
                <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Edit Assignment">
                            <Button
                                type="text"
                                icon={<Edit className='w-4 h-4' />}
                                onClick={() => showModal(record._id)}
                            />
                        </Tooltip>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Delete">
                            <Popconfirm
                                title="Delete this assignment?"
                                description="Are you sure you want to delete, This action cannot be undone."
                                okButtonProps={{ danger: true }}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => handleDeleteAssessment(record._id)}
                            >
                                <Button
                                    type="text"
                                    danger
                                    icon={<Trash2 className='w-4 h-4' />}
                                />
                            </Popconfirm>

                        </Tooltip>
                    </motion.div>
                </div>
            ),
        },

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
                <CustomTable columns={columns} data={filterAssigned} loading={false} pageSize={5} />
                <Modal
                    open={isModalOpen}
                    footer={null}
                    onCancel={handleCancel}
                    title="Edit Assignment"
                >
                    <EditAssignment handleEdit={handleEditAssessment} id={assignmentId} />
                </Modal>
            </motion.div>
        </div>
    )
}

export default AssignedAssessments
