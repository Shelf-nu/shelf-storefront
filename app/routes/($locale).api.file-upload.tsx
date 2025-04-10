import type {ActionFunctionArgs} from '@remix-run/server-runtime';
import {json} from '@remix-run/server-runtime';
import {parseFileFormData} from '~/lib/files.server';

export async function action({context, request}: ActionFunctionArgs) {
  const {env} = context;
  const connectionData = {
    serviceRole: env.SUPABASE_SERVICE_ROLE,
    supabaseUrl: env.SUPABASE_URL,
  };
  console.log('connectionData', connectionData);

  const formData = await parseFileFormData({
    request,
    newFileName: `new-file`,
    connectionData,
  });

  return json({success: true}, {status: 200});
}
