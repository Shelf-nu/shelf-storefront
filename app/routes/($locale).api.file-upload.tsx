import type {ActionFunctionArgs} from '@remix-run/server-runtime';
import {json} from '@remix-run/server-runtime';
import type {ConnectionData} from '~/lib/files.server';
import {deleteImage, parseFileFormData} from '~/lib/files.server';

export type FileUploadAction = typeof action;

export async function action({context, request}: ActionFunctionArgs) {
  const {env} = context;
  const connectionData = {
    serviceRole: env.SUPABASE_SERVICE_ROLE,
    supabaseUrl: env.SUPABASE_URL,
  };
  const formData = await request.clone().formData();
  const intent = formData.get('intent');
  const fileUrl = formData.get('url'); // URL to delete

  switch (intent) {
    case 'upload':
      return await handleFileUpload(request, connectionData);
    case 'delete':
      if (typeof fileUrl !== 'string') {
        return json(
          {error: 'File URL not found'},
          {status: 400, headers: new Headers()},
        );
      }
      return await handleFileDelete(fileUrl, connectionData);
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

async function handleFileDelete(url: string, connectionData: ConnectionData) {
  await deleteImage({url, connectionData});
  return json(
    {success: true, message: 'File deleted successfully'},
    {status: 200, headers: new Headers()},
  );
}
