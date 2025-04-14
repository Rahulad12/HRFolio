import { Modal } from 'antd'
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import InterviewForm from '../component/Form/InterviewForm';
import { storeInterview } from '../action/StoreInterview';
import { useAppDispatch, useAppSelector } from '../Hooks/hook';
import { useCreateInterviewMutation, useGetInterviewQuery } from '../services/interviewServiceApi';
import { interviewData } from '../types';
import { toast } from 'react-toastify';
import InterviewShow from '../component/common/InterviewShow';

const Interview = () => {

    const dispatch = useAppDispatch();

    const [createInterview, { isLoading: interviewCreateLoading }] = useCreateInterviewMutation();

    const filterInterview = useAppSelector((state) => state.search);

    const { data, isLoading: interviewLoading } = useGetInterviewQuery({
        date: filterInterview?.date?.format('YYYY-MM-DD') || "",
        status: filterInterview?.interviewStatus
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    useEffect(() => {
        if (data?.data) {
            dispatch(storeInterview(data.data));
        }
        return () => {
            dispatch(storeInterview([]));
        };
    }, [data]);

    const submitHandler = async (formData: interviewData) => {
        console.log(formData);
        try {
            const res = await createInterview(formData).unwrap();
            if (res.success) {
                toast.success(res.message);
            }
            setIsModalOpen(false);

        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    }
    return (
        <div className='space-y-6'>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Interview</h1>
                <button
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md cursor-pointer"
                    onClick={showModal}
                >
                    <Calendar className="w-4 h-4" /> Add Interview
                </button>
            </div>

            <InterviewShow loading={interviewLoading} />

            <Modal
                title="Add Candidate"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <InterviewForm submitHandler={submitHandler} loading={interviewCreateLoading} />
            </Modal>

        </div>
    )
}

export default Interview
