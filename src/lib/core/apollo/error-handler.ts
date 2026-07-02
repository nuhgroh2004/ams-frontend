import { ApolloError } from '@apollo/client';

/**
 * getGraphQLErrorMessage
 * Utilitas untuk mengekstrak pesan error yang user-friendly dari ApolloError.
 * Prioritas:
 * 1. graphQLErrors[0].message (Pesan error spesifik dari backend GraphQL)
 * 2. networkError.result.errors (Server mengembalikan JSON error body meskipun status 500)
 * 3. networkError.bodyText (Raw response body string — coba parse JSON)
 * 4. error.message (Fallback bawaan Apollo, sering berisi pesan backend)
 */

export function getGraphQLErrorMessage(error: any): string {
  if (!error) return 'Terjadi kesalahan yang tidak diketahui';

  // 1. Tangkap error dari graphQLErrors (logic error di backend, status 200)
  if (error instanceof ApolloError && error.graphQLErrors?.length > 0) {
    return error.graphQLErrors[0].message;
  }

  // 2. Tangkap error dari networkError (misal server down atau 500)
  if (error.networkError) {
    const networkError = error.networkError as any;
    
    // 2a. Server mengembalikan body JSON meskipun status code 500
    if (networkError.result?.errors?.length > 0) {
      return networkError.result.errors[0].message;
    }

    // 2b. bodyText — kadang Apollo menyimpan raw response body sebagai string
    if (networkError.bodyText) {
      try {
        const parsed = JSON.parse(networkError.bodyText);
        if (parsed?.errors?.[0]?.message) {
          return parsed.errors[0].message;
        }
      } catch {
        // bodyText bukan JSON, abaikan
      }
    }

    // 2c. Jika error murni network (misal koneksi terputus)
    if (networkError.message) {
      return networkError.message;
    }
  }

  // 3. Fallback ke pesan dari error.message
  //    Apollo sering menggabungkan pesan backend di sini
  if (error.message) {
    // Bersihkan prefix "Response not successful: " yang ditambahkan Apollo
    const msg = error.message as string;
    if (msg.startsWith('Response not successful:')) {
      return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
    }
    return msg;
  }

  return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
}

