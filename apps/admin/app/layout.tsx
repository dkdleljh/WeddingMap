import "./globals.css";

import { AdminShell } from "@/components/admin-shell";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
