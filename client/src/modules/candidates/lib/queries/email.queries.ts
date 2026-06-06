import { useMutation } from '@tanstack/react-query'
import * as emailApi from '../api/email.api'
import type { SendEmailPayload } from '../api/email.api'

export function useSendGeneralEmail() {
  return useMutation({
    mutationFn: (data: SendEmailPayload) => emailApi.sendGeneralEmail(data),
  })
}
