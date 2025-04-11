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
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileData) chunks.push(chunk);

    // Calculate total length
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);

    // Create a single Uint8Array
    const file = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      file.set(chunk, offset);
      offset += chunk.length;
    }

    const supabase = getSupabaseAdmin(
      connectionData.serviceRole,
      connectionData.supabaseUrl,
    );

    const {data, error} = await supabase.storage
      .from('store-files')
      .upload(filename, file, {contentType, upsert: true});

    if (error) {
      console.error('Supabase upload error:', JSON.stringify(error));
      throw error;
    }

    return data.path;
  } catch (cause) {
    console.error('Full upload error:', cause);
    // Rethrow with more specific info if possible
    if (cause instanceof Error) {
      throw new Error(`File upload failed: ${cause.message}`, {cause});
    }
    throw new Error(
      'Something went wrong while uploading the file. Please try again or contact support.',
      {cause},
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
        if (!contentType?.includes('image') || !filename) {
          return undefined;
        }

        const fileExtension = filename.split('.').pop();
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
    console.error('Error parsing form data:', cause);
    throw new Error(
      'Something went wrong while uploading the file. Please try again or contact support.',
    );
  }
}
