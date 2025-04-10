import {
  unstable_composeUploadHandlers,
  unstable_parseMultipartFormData,
} from '@remix-run/server-runtime';
import {getSupabaseAdmin} from './supabase.server';

// Define interfaces for better type safety
interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: string;
  // Add other resize options as needed
}

interface ConnectionData {
  serviceRole: string;
  supabaseUrl: string;
}

interface UploadOptions {
  filename: string;
  contentType: string;
  resizeOptions?: ResizeOptions;
}

interface FileFormDataParams {
  request: Request;
  newFileName: string;
  resizeOptions?: ResizeOptions;
  connectionData: ConnectionData;
}

// Get current date formatted as YYYY-MM-DD
function getCurrentDateFolder(): string {
  const now = new Date();
  return now.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
}

async function uploadFile(
  fileData: AsyncIterable<Uint8Array>,
  {filename, contentType}: UploadOptions,
  connectionData: ConnectionData,
) {
  try {
    const chunks = [];
    for await (const chunk of fileData) chunks.push(chunk);
    const file = Buffer.concat(chunks);

    const {data, error} = await getSupabaseAdmin(
      connectionData.serviceRole,
      connectionData.supabaseUrl,
    )
      .storage.from('store-files')
      .upload(filename, file, {contentType, upsert: true});
    console.log('data', data);
    console.log('error', error);

    if (error) {
      throw error;
    }

    return data.path;
  } catch (cause) {
    throw new Error(
      'Something went wrong while uploading the file. Please try again or contact support.',
    );
  }
}

export async function parseFileFormData({
  request,
  newFileName,
  connectionData,
}: FileFormDataParams): Promise<FormData> {
  try {
    const uploadHandler = unstable_composeUploadHandlers(
      async ({contentType, data, filename}) => {
        console.log('contentType', contentType);
        if (!contentType?.includes('image') || !filename) {
          return undefined;
        }

        const fileExtension = filename.split('.').pop();
        console.log('fileExtension', fileExtension);
        const uploadedFilePath = await uploadFile(
          data,
          {
            filename: `${getCurrentDateFolder()}/${newFileName}.${fileExtension}`,
            contentType,
          },
          connectionData,
        );

        return uploadedFilePath;
      },
    );

    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler,
    );
    return formData;
  } catch (cause) {
    throw new Error(
      'Something went wrong while uploading the file. Please try again or contact support.',
    );
  }
}
