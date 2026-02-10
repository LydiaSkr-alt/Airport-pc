// Correspond à AeroportResponse.kt
export interface AeroportResponse {
  codeIATA: string;
  nom: string;
  ville: string;
  pays: string;
  urlApi: string | null;
  estLocal: boolean;
  nombrePistes: number;
  nombreHangars: number;
}

// Correspond à AeroportCreateRequest.kt
export interface AeroportCreateRequest {
  codeIATA: string;
  nom: string;
  ville: string;
  pays: string;
  urlApi?: string | null;
  estLocal?: boolean;
}

// Correspond à AeroportUpdateRequest.kt
export interface AeroportUpdateRequest {
  nom: string;
  ville: string;
  pays: string;
  urlApi?: string | null;
  estLocal?: boolean;
}
