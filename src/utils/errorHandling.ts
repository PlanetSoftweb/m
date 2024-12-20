interface SupabaseError {
  code: string;
  message: string;
  details?: unknown;
}

export function handleSupabaseError(error: unknown): Error {
  console.error('Supabase error:', error);

  if (!error) {
    return new Error('An unknown error occurred');
  }

  const supabaseError = error as SupabaseError;

  // Handle UUID parsing errors
  if (supabaseError.code === '22P02' && supabaseError.message.includes('uuid')) {
    return new Error('Invalid ID format');
  }

  // Handle authentication errors
  if (supabaseError.message?.includes('JWT')) {
    return new Error('Your session has expired. Please sign in again.');
  }

  // Handle network errors
  if (supabaseError.message?.includes('network')) {
    return new Error('Unable to connect to the database. Please check your internet connection.');
  }

  return new Error(supabaseError.message || 'An unexpected error occurred');
}
