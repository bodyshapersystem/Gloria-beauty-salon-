import { AccessShell } from "@/components/access/AccessShell";

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return <AccessShell>{children}</AccessShell>;
}
