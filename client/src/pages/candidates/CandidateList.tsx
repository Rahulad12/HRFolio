import { Button, Space, Tag, Tooltip, Popconfirm, Skeleton, notification, Card, Typography } from 'antd';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../Hooks/hook';
import { useDeleteCandidateMutation, useGetCandidateQuery } from '../../services/candidateServiceApi';
import { setCandidate } from '../../slices/candidateSlices';
import { useNavigate } from 'react-router-dom';
import { candidateData } from '../../types';
import { makeCapitilized } from '../../utils/TextAlter';
import { motion, AnimatePresence } from 'framer-motion';
import type { TableColumnsType } from 'antd';
import CustomTable from '../../component/common/Table';
import TableSearch from '../../component/common/TableSearch';
import PrimaryButton from '../../component/ui/button/Primary';
import Predefineddata from '../../data/PredefinedData';


// interface TableProps {
//   loading: boolean;
//   error: boolean;
// }

const statusColors: Record<string, string> = {
  shortlisted: 'blue',
  assessment: "geekblue",
  first: 'orange',
  second: 'purple',
  third: 'cyan',
  offerd: "volcano",
  hired: 'green',
  rejected: 'red',
};


const CandidateTable = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const filter = useAppSelector((state) => state.search);
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  const { candidateSearch: searchTerms } = useAppSelector((state) => state.search);
  const { data, isLoading: candidateLoading } = useGetCandidateQuery({
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
        <div onClick={() => navigate(`/dashboard/candidates/${record._id}`)} className=' cursor-pointer flex items-center'>
          <div className="h-10 w-10 rounded-full bg-blue-950 flex items-center justify-center text-white mr-3 text-lg font-medium">
            <span>{makeCapitilized(text.charAt(0))}</span>
          </div>
          <div>
            <div className="font-medium capitalize">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
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
                onClick={() => navigate(`/dashboard/candidates/edit/${record._id}`)}
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
          <Typography.Title level={2} >Candidates</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-gray-500">
            Manage and track all candidates in your recruitment pipeline
          </Typography.Text>
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
            items={Predefineddata?.Status || []}
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
              key="candidateTable"
            />
          </AnimatePresence>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default CandidateTable;