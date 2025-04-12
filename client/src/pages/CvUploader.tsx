import React, { useEffect, useState } from "react";
import { Typography, Divider, Modal } from "antd";
import { Plus } from "lucide-react";
import { candidateFormData } from "../types/index";
import CandidateForm from "../component/Form/CandidateForm";
import { useCreateCandidateMutation, useGetCandidateQuery } from "../services/candidateServiceApi";
import { useAppDispatch } from "../Hooks/hook";
import { storeCandidate } from "../action/SoreCandidate";
import CandidateTable from "../component/common/CandidateTable";
import { toast } from "react-toastify";

const { Title } = Typography;

const CvUploader: React.FC = () => {
    const { isLoading, data: candidate, isError } = useGetCandidateQuery();
    const [createCandidate, { isLoading: createCandidateLoading }] = useCreateCandidateMutation();
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);


    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    useEffect(() => {
        if (candidate?.data) {
            dispatch(storeCandidate(candidate.data));
        }
        return () => {
            dispatch(storeCandidate([]));
        };
    }, [candidate]);

    const submitHandler = async (formData: candidateFormData) => {
        try {
            const res = await createCandidate(formData).unwrap();
            console.log(res);
            if (res.success) {
                toast.success(res.message);
            }
            setIsModalOpen(false);
        } catch (err: any) {
            const resErr: string = err.message;
            toast.error(resErr);
        }
    };

    return (
        <div className="p-4 space-y-4">
            {isError && <p className="text-red-500">Failed to fetch candidate data.</p>}
            <div className="flex items-center justify-between">
                <Title level={3} className="!m-0">CV Uploader</Title>
                <button
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md cursor-pointer"
                    onClick={showModal}
                >
                    <Plus className="w-4 h-4" /> Add Candidate
                </button>
            </div>

            <Divider />

            <div className="overflow-x-auto bg-white rounded shadow">
                {/* <Table ref={ref} dataSource={dataSource} columns={columns} /> */}
                <CandidateTable loading={isLoading} />
            </div>

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={800}
                centered
                destroyOnClose
            >
                <CandidateForm submitHandler={submitHandler} loading={createCandidateLoading} />
            </Modal>
        </div>
    );
};

export default CvUploader;
