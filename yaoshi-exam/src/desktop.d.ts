export interface LicenseStatus {
  activated: boolean;
  deviceCode: string;
  customer?: string;
  plan?: string;
  issuedAt?: string;
  expiresAt?: string | null;
  message?: string;
}

declare global {
interface Window {
  desktopApp?: {
    isDesktop: boolean;
    platform: string;
    getLicenseStatus: () => Promise<LicenseStatus>;
    activateLicense: (code: string) => Promise<LicenseStatus>;
    copyText: (text: string) => Promise<void>;
  };
}
}
