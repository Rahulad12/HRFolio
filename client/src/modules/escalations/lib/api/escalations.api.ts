import { GET, POST } from '@/shared/lib/axios';
import {
  Escalation,
  RaiseEscalationPayload,
  ResolveEscalationPayload,
} from '../../types/escalations.types';

const API_BASE = 'escalations';

export const escalationApi = {
  /**
   * Raise Level 1 escalation (HR only)
   */
  async raiseEscalation(payload: RaiseEscalationPayload): Promise<{ success: boolean; data: Escalation }> {
    const result = await POST<{ success: boolean; data: Escalation }>(
      `${API_BASE}/raise`,
      payload
    );
    return result;
  },

  /**
   * Escalate to Level 2 (HR Admin only)
   */
  async escalateToLevel2(
    escalationId: string,
    payload: RaiseEscalationPayload
  ): Promise<{ success: boolean; data: Escalation }> {
    const result = await POST<{ success: boolean; data: Escalation }>(
      `${API_BASE}/${escalationId}/escalate`,
      payload
    );
    return result;
  },

  /**
   * Resolve escalation (HR Admin or Admin)
   */
  async resolveEscalation(
    escalationId: string,
    payload: ResolveEscalationPayload
  ): Promise<{ success: boolean; data: Escalation }> {
    const result = await POST<{ success: boolean; data: Escalation }>(
      `${API_BASE}/${escalationId}/resolve`,
      payload
    );
    return result;
  },

  /**
   * Cancel escalation (HR only, Pending only)
   */
  async cancelEscalation(escalationId: string): Promise<{ success: boolean; data: Escalation }> {
    const result = await POST<{ success: boolean; data: Escalation }>(
      `${API_BASE}/${escalationId}/cancel`
    );
    return result;
  },

  /**
   * Get my escalations (role-scoped)
   * HR: returns escalations they raised
   * HR Admin/Admin: returns escalations assigned to them
   */
  async getMyEscalations(): Promise<{ success: boolean; data: Escalation[] }> {
    const result = await GET<{ success: boolean; data: Escalation[] }>(
      `${API_BASE}/my`
    );
    return result;
  },
};
