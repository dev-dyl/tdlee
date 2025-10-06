import RequirePassword from "./RequirePassword";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequirePassword redirectTo="/admin" logoutTo="/">
      {children}
    </RequirePassword>
  );
}
