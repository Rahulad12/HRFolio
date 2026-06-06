import { useState } from 'react';
import { Modal, Form, Input, Select, Space, Spin, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRaiseEscalation } from '../lib/queries/escalations.queries';
import { raiseEscalationSchema, type RaiseEscalationFormData } from '../schemas/escalations.schema';
import { useAuth } from '@/shared/hooks/useAuth';

interface RaiseEscalationModalProps {
  open: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  hrAdmins: Array<{ id: string; name: string; email: string }>;
  onSuccess?: () => void;
}

export function RaiseEscalationModal({
  open,
  onClose,
  candidateId,
  candidateName,
  hrAdmins,
  onSuccess,
}: RaiseEscalationModalProps) {
  const { control, handleSubmit, reset } = useForm<RaiseEscalationFormData>({
    resolver: zodResolver(raiseEscalationSchema),
    defaultValues: {
      candidateId,
      targetUserId: '',
      notes: '',
    },
  });
  const { user } = useAuth();
  const { mutate: raiseEscalation, isPending } = useRaiseEscalation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RaiseEscalationFormData) => {
    setIsSubmitting(true);
    try {
      raiseEscalation(data, {
        onSuccess: () => {
          message.success('Escalation raised successfully');
          reset();
          onClose();
          onSuccess?.();
        },
        onError: (error) => {
          message.error(`Failed to raise escalation: ${error.message}`);
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={`Raise Escalation: ${candidateName}`}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isPending || isSubmitting}
      width={600}
      okText="Raise Escalation"
      cancelText="Cancel"
    >
      <Spin spinning={isPending}>
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Candidate" required>
            <Input disabled value={candidateName} />
          </Form.Item>

          <Form.Item label="Raised By" required>
            <Input disabled value={user?.username || ''} />
          </Form.Item>

          <Form.Item label="Escalate To (HR Admin)" required>
            <Controller
              name="targetUserId"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    placeholder="Select HR Admin to escalate to"
                    options={hrAdmins.map((admin) => ({
                      value: admin.id,
                      label: `${admin.name} (${admin.email})`,
                    }))}
                    status={fieldState.error ? 'error' : ''}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </Form.Item>

          <Form.Item label="Notes" required>
            <Controller
              name="notes"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input.TextArea
                    {...field}
                    placeholder="Describe the escalation reason..."
                    rows={4}
                    maxLength={500}
                    status={fieldState.error ? 'error' : ''}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {field.value?.length || 0}/500 characters
                  </p>
                </>
              )}
            />
          </Form.Item>

          <Space direction="vertical" className="w-full text-xs text-gray-500">
            <p>• This will create a Level 1 escalation request</p>
            <p>• The selected HR Admin will be notified</p>
            <p>• You can cancel this escalation if still Pending</p>
          </Space>
        </Form>
      </Spin>
    </Modal>
  );
}
