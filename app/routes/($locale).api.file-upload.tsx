import type {ActionFunctionArgs} from '@remix-run/server-runtime';
import {json} from '@remix-run/server-runtime';

export async function action({context, request}: ActionFunctionArgs) {
  const {env} = context;
  const connectionData = {
    serviceRole: env.SUPABASE_SERVICE_ROLE,
    supabaseUrl: env.SUPABASE_URL,
  };
  return json({success: true}, {status: 200});
}
