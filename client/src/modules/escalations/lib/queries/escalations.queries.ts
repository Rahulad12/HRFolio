import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import { escalationApi } from '../api/escalations.api';
import { Escalation, RaiseEscalationPayload, ResolveEscalationPayload } from '../../types/escalations.types';

const ESCALATIONS_QUERY_KEY = ['escalations'];

export function useGetMyEscalations(): UseQueryResult<Escalation[], Error> {
  return useQuery({
    queryKey: [...ESCALATIONS_QUERY_KEY, 'my'],
    queryFn: async () => {
      const result = await escalationApi.getMyEscalations();
      return result.data;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useRaiseEscalation(): UseMutationResult<
  Escalation,
  Error,
  RaiseEscalationPayload,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const result = await escalationApi.raiseEscalation(payload);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESCALATIONS_QUERY_KEY });
    },
  });
}

export function useEscalateToLevel2(): UseMutationResult<
  Escalation,
  Error,
  { escalationId: string; payload: RaiseEscalationPayload },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ escalationId, payload }) => {
      const result = await escalationApi.escalateToLevel2(escalationId, payload);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESCALATIONS_QUERY_KEY });
    },
  });
}

export function useResolveEscalation(): UseMutationResult<
  Escalation,
  Error,
  { escalationId: string; payload: ResolveEscalationPayload },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ escalationId, payload }) => {
      const result = await escalationApi.resolveEscalation(escalationId, payload);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESCALATIONS_QUERY_KEY });
    },
  });
}

export function useCancelEscalation(): UseMutationResult<
  Escalation,
  Error,
  string,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (escalationId) => {
      const result = await escalationApi.cancelEscalation(escalationId);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESCALATIONS_QUERY_KEY });
    },
  });
}
