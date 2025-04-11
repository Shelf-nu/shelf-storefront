import type {ActionFunctionArgs} from '@remix-run/server-runtime';
import {json} from '@remix-run/server-runtime';
import {parseFileFormData} from '~/lib/files.server';

export async function action({context, request}: ActionFunctionArgs) {
  const {env} = context;
  const connectionData = {
    serviceRole: env.SUPABASE_SERVICE_ROLE,
    supabaseUrl: env.SUPABASE_URL,
  };

  const formData = await parseFileFormData({
    request,
    newFileName: `new-file-${Date.now()}`,
    connectionData,
  });
  const file = formData.get('file');

  console.log(`File: ${file}`);

  if (!file) {
    return json(
      {error: 'File not found'},
      {status: 400, headers: new Headers()},
    );
  }

  return json({success: true, file}, {status: 200, headers: new Headers()});
}
