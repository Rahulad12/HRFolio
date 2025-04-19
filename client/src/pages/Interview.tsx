import { Modal } from 'antd'
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import InterviewForm from '../component/interview/InterviewForm';
import { storeInterview } from '../action/StoreInterview';
import { useAppDispatch, useAppSelector } from '../Hooks/hook';
import { useGetInterviewQuery } from '../services/interviewServiceApi';
import InterviewShow from '../component/interview/InterviewShow';
import PrimaryButton from '../component/ui/button/Primary';
import Hero from '../component/common/Hero';
import { buttonState } from '../slices/ButtonPropsSlices';

const Interview = () => {

    const dispatch = useAppDispatch();
    const filterInterview = useAppSelector((state) => state.search);

    const { data, isLoading: interviewLoading } = useGetInterviewQuery({
        date: filterInterview?.date?.format("YYYY-MM-DD" + " " + "HH:mm:ss") || "",
        status: filterInterview?.interviewStatus
        // date: "",
        // status: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    useEffect(() => {
        if (data?.data) {
            dispatch(storeInterview(data.data));
        }
        dispatch(buttonState({ text: "Create Interview", icon: <Calendar className="w-4 h-4" />, onClick: showModal }));
        return () => {
            dispatch(storeInterview([]));
        };
    }, [data, dispatch]);


    return (
        <div className='p-4 flex flex-col gap-4'>
            <Hero title="Interview" />

            <InterviewShow loading={interviewLoading} />

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <InterviewForm />
            </Modal>

        </div>
    )
}

export default Interview
