import { useEffect, useState } from "react";
import { Divider, Modal, Card } from "antd";
import { UserPlus } from "lucide-react";
import { candidateFormData } from "../types/index";
import CandidateForm from "../component/Form/CandidateForm";
import { useCreateCandidateMutation, useGetCandidateQuery } from "../services/candidateServiceApi";
import { useAppDispatch, useAppSelector } from "../Hooks/hook";
import { storeCandidate } from "../action/SoreCandidate";
import CandidateTable from "../component/common/CandidateTable";
import { toast } from "react-toastify";
import TableSearch from "../component/common/TableSearch";

const CvUploader = () => {
    console.log("cv uploader");
    const filters = useAppSelector((state) => state.search);
    const { isLoading, data: candidate, isError, refetch } = useGetCandidateQuery({
        name: filters.name,
        technology: filters.technology,
        status: filters.status,
        level: filters.level
    });
    const [createCandidate, { isLoading: createCandidateLoading }] = useCreateCandidateMutation();
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    useEffect(() => {
        if (candidate?.data) {
            dispatch(storeCandidate(candidate.data));
            refetch();
        }
        console.log("cv uploader useEffect re render");
        return () => {
            dispatch(storeCandidate([]));
        };
    }, [candidate, dispatch, refetch]);

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
        <div className=" space-y-4">

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Candidates</h1>
                <button
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md cursor-pointer"
                    onClick={showModal}
                >
                    <UserPlus className="w-4 h-4" /> Add Candidate
                </button>
            </div>

            <Divider />
            <Card className="overflow-x-auto bg-white rounded shadow">
                <div className="space-y-4">
                    <TableSearch />
                    <CandidateTable loading={isLoading} error={isError} />
                </div>
            </Card>

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
