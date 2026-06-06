import { notification } from 'antd';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationConfig {
  message: string;
  description?: string;
  duration?: number;
  type?: NotificationType;
}

export const useNotification = () => {
  const showNotification = (config: NotificationConfig) => {
    const {
      message: title,
      description,
      duration = 4.5,
      type = 'info',
    } = config;

    notification[type]({
      message: title,
      description,
      duration,
      placement: 'topRight',
    });
  };

  const showEscalationRaised = (candidateName: string, hrAdminName: string) => {
    showNotification({
      type: 'success',
      message: 'Escalation Raised',
      description: `Escalation for ${candidateName} has been raised to ${hrAdminName}`,
      duration: 5,
    });
  };

  const showEscalationEscalated = (candidateName: string, adminName: string) => {
    showNotification({
      type: 'warning',
      message: 'Escalation Escalated',
      description: `Escalation for ${candidateName} has been escalated to ${adminName}`,
      duration: 5,
    });
  };

  const showEscalationResolved = (candidateName: string) => {
    showNotification({
      type: 'success',
      message: 'Escalation Resolved',
      description: `Escalation for ${candidateName} has been resolved`,
      duration: 4.5,
    });
  };

  const showEscalationCancelled = (candidateName: string) => {
    showNotification({
      type: 'info',
      message: 'Escalation Cancelled',
      description: `Escalation for ${candidateName} has been cancelled`,
      duration: 4.5,
    });
  };

  const showError = (error: string) => {
    notification.error({
      message: 'Error',
      description: error,
      duration: 5,
      placement: 'topRight',
    });
  };

  return {
    showNotification,
    showEscalationRaised,
    showEscalationEscalated,
    showEscalationResolved,
    showEscalationCancelled,
    showError,
  };
};
