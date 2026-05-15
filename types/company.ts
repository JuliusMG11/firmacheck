export type Company = {
  ico: string;
  name: string;
  dic: string | null;
  legalForm: string | null;
  establishedAt: string | null;
  closedAt: string | null;
  address: {
    full: string;
    street: string | null;
    city: string | null;
    psc: string | null;
  };
  isActive: boolean;
};

export type SavedCompany = {
  ico: string;
  name: string;
  savedAt: string;
};

export type ApiError = {
  code: 'INVALID_ICO' | 'NOT_FOUND' | 'ARES_UNAVAILABLE' | 'DB_ERROR' | 'NETWORK' | 'UNKNOWN';
  message: string;
};
