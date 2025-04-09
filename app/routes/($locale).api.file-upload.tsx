import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import {parseFileFormData} from '~/lib/storage.server';

export async function action({context, request}: ActionFunctionArgs) {
  const {env} = context;
  const connectionData = {
    serviceRole: env.SUPABASE_SERVICE_ROLE,
    supabaseUrl: env.SUPABASE_URL,
  };

  const formData = await parseFileFormData({
    request,
    newFileName: `new-file`,
    connectionData,
  });

  const file = formData.get('file') as string;
  console.log(file);
  return null;
}
