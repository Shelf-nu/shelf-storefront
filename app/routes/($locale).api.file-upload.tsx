import type {ActionFunctionArgs} from '@remix-run/server-runtime';
import {json} from '@remix-run/server-runtime';
import type {ConnectionData} from '~/lib/files.server';
import {parseFileFormData} from '~/lib/files.server';

export type FileUploadAction = typeof action;

export async function action({context, request}: ActionFunctionArgs) {
  const {env} = context;
  const connectionData = {
    serviceRole: env.SUPABASE_SERVICE_ROLE,
    supabaseUrl: env.SUPABASE_URL,
  };
  const formData = await request.clone().formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'upload':
      return await handleFileUpload(request, connectionData);
    case 'delete':
      const fileName = formData.get('fileName');
      console.log('Deleting file:', fileName);
      return json(
        {success: true, message: 'File deleted successfully'},
        {status: 200, headers: new Headers()},
      );
    default:
      return json(
        {error: 'Invalid intent'},
        {status: 400, headers: new Headers()},
      );
  }
}

async function handleFileUpload(
  request: Request,
  connectionData: ConnectionData,
) {
  const fileFormData = await parseFileFormData({
    request,
    newFileName: `new-file-${Date.now()}`,
    connectionData,
  });
  const file = fileFormData.get('file');

  if (!file) {
    return json(
      {error: 'File not found'},
      {status: 400, headers: new Headers()},
    );
  }

  return json(
    {success: true, fileName: file},
    {status: 200, headers: new Headers()},
  );
}
