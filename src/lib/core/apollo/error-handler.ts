import { ApolloError } from '@apollo/client';

/**
 * getGraphQLErrorMessage
 * Utilitas untuk mengekstrak pesan error yang user-friendly dari ApolloError.
 * Prioritas:
 * 1. graphQLErrors[0].message (Pesan error spesifik dari backend GraphQL)
 * 2. networkError (Pesan error jaringan atau server error 500/400)
 * 3. error.message (Fallback bawaan Apollo)
 */

export function getGraphQLErrorMessage(error: any): string {
  if (!error) return 'Terjadi kesalahan yang tidak diketahui';

  // 1. Tangkap error dari graphQLErrors (logic error di backend)
  if (error instanceof ApolloError && error.graphQLErrors?.length > 0) {
    return error.graphQLErrors[0].message;
  }

  // 2. Tangkap error dari networkError (misal server down atau 500)
  if (error.networkError) {
    const networkError = error.networkError as any;
    
    // Kadang server mengembalikan body JSON meskipun status code bukan 200
    if (networkError.result?.errors?.length > 0) {
      return networkError.result.errors[0].message;
    }

    // Jika error murni network (misal koneksi terputus)
    if (networkError.message) {
      return networkError.message;
    }
  }

  // 3. Fallback ke pesan generic atau pesan default Apollo
  return error.message || 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
}
