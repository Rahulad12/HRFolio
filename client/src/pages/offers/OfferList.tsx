import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Eye, Send, MoreVertical, } from 'lucide-react';
import { offerLetter } from '../../types';
import PrimaryButton from '../../component/ui/button/Primary';
import { Button, Card, Input, message, Select, Typography, Tag, Dropdown, Popconfirm, Tooltip } from 'antd';
import CustomTable from '../../component/common/Table';
import { useGetOfferLetterQuery, useCreateOfferLetterMutation, useDeleteOfferLetterMutation, useUpdateOfferLetterMutation } from '../../services/offerService';

const OfferList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sendingOfferId, setSendingOfferId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: offerLetters, isLoading: isLoadingOfferLetter, refetch } = useGetOfferLetterQuery();
  const [createOfferLetter, { isLoading: offerSending }] = useCreateOfferLetterMutation();
  const [updateOfferLetter] = useUpdateOfferLetterMutation();
  const [deleteOfferLetter] = useDeleteOfferLetterMutation();


  const filteredOffers = offerLetters?.data?.filter(offer => {
    const matchesSearch =
      offer?.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer?.position?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || offer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewCandidate = (offer: offerLetter) => {
    navigate(`/dashboard/candidates/${offer?.candidate?._id}`);
  };

  const handleEditOffer = (offer: offerLetter) => {
    navigate(`/dashboard/offers/edit/${offer?._id}`);
  };

  const handleSendOffer = async (offer: offerLetter) => {

    if (!offer.position || !offer.salary || !offer.startDate || !offer.responseDeadline || !offer.email) {
      message.warning("Incomplete offer. Please edit and complete the draft first.");
      return;
    }
    setSendingOfferId(offer._id);
    const payload = {
      candidate: offer?.candidate?._id,
      email: offer?.email,
      position: offer?.position,
      salary: offer?.salary,
      startDate: offer?.startDate,
      responseDeadline: offer?.responseDeadline,
      status: 'sent' as offerLetter['status']
    }
    try {
      const res = await createOfferLetter(payload).unwrap();
      if (res?.success) {
        message.success(res?.message);
        refetch();
      }
    } catch (error: any) {
      console.error('Failed to send offer', error);
      message.error(error?.data?.message);
    }
    finally {
      setSendingOfferId(null);
    }
  };
  const handleDeleteOffer = async (offer: offerLetter) => {
    try {
      const res = await deleteOfferLetter(offer._id).unwrap();
      if (res?.success) {
        message.success(res?.message);
        refetch();
      }
    } catch (error: any) {
      console.error('Failed to delete offer', error);
      message.error(error?.data?.message);
    }
  };
  const handleStatusUpdate = async (offer: offerLetter, status: offerLetter['status']) => {
    setSendingOfferId(offer._id);
    try {
      const payload = {
        candidate: offer?.candidate?._id,
        email: offer?.email,
        position: offer?.position,
        salary: offer?.salary,
        startDate: offer?.startDate,
        responseDeadline: offer?.responseDeadline,
        status: status
      }
      const res = await updateOfferLetter({
        id: offer._id,
        data: payload
      }).unwrap();
      if (res?.success) {
        message.success(res?.message);
        refetch();
      }
    } catch (error: any) {
      console.error('Failed to update offer status', error);
      message.error(error?.data?.message);
    }
    finally {
      setSendingOfferId(null);
    }
  }

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'negotiating', label: 'Negotiating' }
  ];

  const getStatusBadge = (status: offerLetter['status']) => {
    switch (status) {
      case 'draft':
        return <Tag color='warning'>Draft</Tag>;
      case 'sent':
        return <Tag color="green">Sent</Tag>;
      case 'accepted':
        return <Tag color="success">Accepted</Tag>;
      case 'rejected':
        return <Tag color="error">Rejected</Tag>;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Candidate',
      render: (_: any, record: offerLetter) => (
        <div>
          <div className="font-medium capitalize">{record?.candidate?.name}</div>
          <div className="text-xs text-gray-500 capitalize">{record?.candidate?.email}</div>
        </div>
      )
    },
    {
      title: 'Position',
      dataIndex: 'position',
      Key: 'position'
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      Key: 'salary'
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate'
    },
    {
      title: 'Status',
      render: (offer: offerLetter) => getStatusBadge(offer?.status as offerLetter['status'])
      // render: (offer: offerLetter) => (
      //   <div>
      //     <Select
      //       value={offer?.status}
      //       options={statusOptions}
      //       onChange={(value) => handleStatusUpdate(offer, value)}
      //       className='w-30'
      //       loading={sendingOfferId === offer._id}
      //     />
      //   </div>
      // )
    },
    {
      title: 'Actions',
      render: (_: any, offer: offerLetter) => (
        <div className="flex space-x-2">
          <Tooltip
            title="View Candidate"
          >
            <Button
              type="text"
              size='small'
              onClick={() => handleViewCandidate(offer)}
              aria-label="View candidate"
              disabled={offerSending}
              icon={<Eye size={16} color='blue'/>}
            /
            >

          </Tooltip>
          {
            offer?.status === 'sent' && (
              <>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: '1',
                        label: "Accepted",
                        onClick: () => handleStatusUpdate(offer, 'accepted'),
                      },
                      {
                        key: '2',
                        label: "Rejected",
                        danger: true,
                        onClick: () => handleStatusUpdate(offer, 'rejected'),
                      }
                    ]
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    className="p-1"
                  >
                    <MoreVertical size={16} className="text-gray-600" />
                  </Button>
                </Dropdown>
              </>
            )
          }


          {offer?.status === 'draft' && (
            <>
              <Button
                type="text"
                size="small"
                className="p-1"
                onClick={() => handleSendOffer(offer)}
                aria-label="Send offer"
                loading={sendingOfferId === offer._id}
              >
                <Send size={16} className="text-green-600" />
              </Button>

              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      label: <>
                        <Popconfirm
                          title="Are you sure you want to delete this offer?"
                          onConfirm={() => handleDeleteOffer(offer)}
                          okText="Yes"
                          cancelText="No"
                        >
                          Delete
                        </Popconfirm>
                      </>,
                      danger: true
                    }
                    , {
                      key: '2',
                      label: 'Edit Offer',
                      onClick: () => handleEditOffer(offer)
                    }
                  ]
                }}
              >
                <Button
                  type="text"
                  size="small"
                  className="p-1"
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </Button>
              </Dropdown>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={2} className="text-2xl font-bold text-gray-900">Offer Letters</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-gray-500">
            Create and manage offer letters for candidates
          </Typography.Text>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <PrimaryButton
            text="New Offer"
            icon={<FileText size={16} />}
            onClick={() => navigate('/dashboard/offers/new')}
          />
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <Input
              placeholder="Search offers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search size={18} className="text-gray-400" />}
            />
          </div>
          <div className="flex space-x-2">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
          </div>
        </div>

        <CustomTable
          data={filteredOffers || []}
          columns={columns}
          loading={isLoadingOfferLetter}
          pageSize={5}
        />
      </Card>
    </div>
  );
};

export default OfferList;