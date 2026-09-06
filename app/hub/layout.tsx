import { HubShell } from "@/components/hub/HubShell";

export default function HubLayout({children}:{children:React.ReactNode}){
  return <HubShell>{children}</HubShell>;
}
