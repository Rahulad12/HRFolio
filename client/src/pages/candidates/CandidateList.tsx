import { Button, Space, Tag, Tooltip, Popconfirm, Skeleton, notification } from 'antd';
import { Edit, Plus, Trash2, Pencil } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../Hooks/hook';
import { useDeleteCandidateMutation, useGetCandidateQuery } from '../../services/candidateServiceApi';
import { setCandidate } from '../../slices/candidateSlices';
import { useNavigate } from 'react-router-dom';
import { candidateData } from '../../types';
import { makeCapitilized } from '../../utils/TextAlter';
import { motion, AnimatePresence } from 'framer-motion';
import type { TableColumnsType } from 'antd';
import CustomTable from '../../component/common/Table';
import Card from '../../component/ui/Card';
import TableSearch from '../../component/common/TableSearch';
import PrimaryButton from '../../component/ui/button/Primary';


// interface TableProps {
//   loading: boolean;
//   error: boolean;
// }

const statusColors: Record<string, string> = {
  shortlisted: 'blue',
  'first interview': 'orange',
  'second interview': 'purple',
  hired: 'green',
  rejected: 'red',
};

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "first interview", label: "First Interview" },
  { value: "second interview", label: "Second Interview" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const CandidateTable = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const filter = useAppSelector((state) => state.search);
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  const searchTerms = useAppSelector((state) => state.search);
  const { data, isLoading: candidateLoading, isError: candidateError } = useGetCandidateQuery({
    searchText: searchTerms?.text || "",
    status: searchTerms?.status || "",
  }, {
    refetchOnMountOrArgChange: false,
  }
  );

  const [api, contextHolder] = notification.useNotification();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCandidate(id).unwrap();
      dispatch(setCandidate([]));
      api.success({
        message: res.message,
        placement: "topRight",
        duration: 3000,
      })
    } catch (err: any) {
      api.error({
        message: err?.data?.message || "Error deleting candidate",
        placement: "topRight",
        duration: 3000,
      })
    }
  };

  const columns: TableColumnsType<candidateData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: candidateData) => (
        <div onClick={() => navigate(`/dashboard/candidates/${record._id}`)} className=' cursor-pointer'>
          <div className="font-medium text-gray-900" >{record.name}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>

      ),
    },
    {
      title: 'Technology',
      dataIndex: 'technology',
      key: 'technology',
      render: (tech: string) => (
        <span className='text-gray-500 text-sm'>
          {makeCapitilized(tech)}
        </span>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        return (
          <span className='text-gray-500 text-sm'>
            {makeCapitilized(level)}
          </span>
        );
      },
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (exp: number) => (
        <span className='text-gray-500 text-sm'>
          {`${exp} ${exp === 1 ? 'year' : 'years'}`}
        </span>
      ),
      sorter: (a: candidateData, b: candidateData) => a.experience - b.experience,
    },

    {
      title: 'Expected Salary',
      dataIndex: 'expectedsalary',
      key: 'expectedsalary',
      render: (salary: number) => (
        <span
          className='text-gray-500 text-sm'
        >
          ${salary?.toLocaleString('en-US') || '0'}
        </span>
      ),
      sorter: (a: candidateData, b: candidateData) => a.expectedsalary - b.expectedsalary,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColors[status.toLowerCase()] || 'default'} style={{
          borderRadius: '6px',
        }}>
          {makeCapitilized(status)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_: any, record: candidateData) => (
        <Space size="small">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<Pencil className="w-4 h-4" />}
                onClick={() => navigate(`/dashboard/candidate/edit/${record._id}`)}
                className="text-green-500 hover:bg-green-50"
              />
            </Tooltip>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this candidate?"
                description="Are you sure you want to delete this candidate record?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ loading: isDeleting }}
              >
                <Button
                  type="text"
                  danger
                  icon={<Trash2 className="w-4 h-4" />}
                  className="hover:bg-red-50"
                />
              </Popconfirm>
            </Tooltip>
          </motion.div>
        </Space>
      ),
    },
  ];

  if (candidateLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow p-4"
      >
        <Skeleton
          active
          paragraph={{ rows: 8 }}
        />
      </motion.div>
    );
  }

  //main content return
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all candidates in your recruitment pipeline
          </p>
        </div>
        <PrimaryButton
          text='Add Candidate'
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/dashboard/candidates/new')}
          disabled={false}
          loading={false}
        />

      </div>

      <Card>
        {contextHolder}
        <div className="flex justify-between items-center mb-4">
          <TableSearch
            items={statusOptions}
            placeholder="Search by name, level, technology"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <AnimatePresence>
            <CustomTable
              loading={candidateLoading}
              data={data?.data || []}
              columns={columns}
              pageSize={10}
              scroll={{ x: 800, y: 400 }}
              rowKey="_id"
            />
          </AnimatePresence>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default CandidateTable;