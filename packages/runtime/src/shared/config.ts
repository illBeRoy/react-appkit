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
    singleInstance: z
      .boolean()
      .describe(
        'Whether multiple instances of the app can be running at the same time. If false, reopening the app will focus the existing instance.',
      )
      .optional(),
    openWindowOnStartup: z
      .boolean()
      .describe(
        'Whether to open the main window on startup. If false, the app will start in the background. You can still open the main window by calling the "openWindow" action.',
      )
      .optional(),
  })
  .strict();

export type AppConfig = z.infer<typeof AppConfigSchema>;
