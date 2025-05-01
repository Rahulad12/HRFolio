import { Button, Space, Tag, Tooltip, Popconfirm, Skeleton, notification, Card, Typography } from 'antd';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../Hooks/hook';
import { useDeleteCandidateMutation, useGetCandidateQuery } from '../../services/candidateServiceApi';
import { setCandidate } from '../../slices/candidateSlices';
import { useNavigate } from 'react-router-dom';
import { candidateData } from '../../types';
import { makeCapitilized } from '../../utils/TextAlter';
import { motion } from 'framer-motion';
import type { TableColumnsType } from 'antd';
import CustomTable from '../../component/common/Table';
import TableSearch from '../../component/common/TableSearch';
import PrimaryButton from '../../component/ui/button/Primary';
import Predefineddata from '../../data/PredefinedData';
import { useMemo, useState } from 'react';

const statusColors: Record<string, string> = {
  shortlisted: 'blue',
  assessment: "geekblue",
  first: 'orange',
  second: 'purple',
  third: 'cyan',
  offered: "volcano",
  hired: 'green',
  rejected: 'red',
};


const CandidateTable = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string>("");
  // const filter = useAppSelector((state) => state.search);
  const [deleteCandidate] = useDeleteCandidateMutation();

  const { candidateSearch: searchTerms } = useAppSelector((state) => state.search);
  const { data, isLoading: candidateLoading } = useGetCandidateQuery({
    searchText: searchTerms?.text || "",
    status: searchTerms?.status || "",
  }, {
    refetchOnMountOrArgChange: false,
  }
  );

  const sortedCandidates = useMemo(() => {
    return data?.data?.slice().sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data]);
  
  const [api, contextHolder] = notification.useNotification();

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      const res = await deleteCandidate(id).unwrap();
      dispatch(setCandidate([]));
      api.success({
        message: res.message,
        placement: "topRight",
        duration: 2000,
      })
    } catch (err: any) {
      api.error({
        message: err?.data?.message || "Error deleting candidate",
        placement: "topRight",
        duration: 2000,
      })
    }
    finally {
      setDeleteId("");
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
                okButtonProps={{ loading: deleteId === record._id }}
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
      >
        <Skeleton
          active
          paragraph={{ rows: 8 }}
        />
      </motion.div>
    );
  }

  //sorted Candidate based on createdAt


  //main content return
  return (
    <>
      {contextHolder}
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
        <div className="flex justify-between items-center mb-4">
          <TableSearch
            items={Predefineddata?.Status || []}
            placeholder="Search by name, level, technology"
          />
        </div>

        <CustomTable
          loading={candidateLoading}
          data={sortedCandidates || []}
          columns={columns}
          pageSize={10}
          key={sortedCandidates?.map(c => c._id).join(',')}
        />
      </Card>
    </>


  );
};

export default CandidateTable;