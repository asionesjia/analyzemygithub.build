import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const envClient = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})