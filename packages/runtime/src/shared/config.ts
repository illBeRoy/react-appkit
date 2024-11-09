import z from 'zod';

export const AppConfigSchema = z
  .object({
    id: z
      .string()
      .describe(
        'The identifier of the app. Usually looks like com.my-company.my-app',
      ),
    displayName: z
      .string()
      .describe(
        'The display name of the app. Shown in the UI and used as the process name',
      ),
    buildTargets: z
      .array(z.enum(['win', 'mac', 'linux']))
      .describe('The build targets for the app')
      .optional(),
  })
  .strict();

export type AppConfig = z.infer<typeof AppConfigSchema>;
