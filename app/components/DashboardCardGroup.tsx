// components/dashboard/DashboardCardGroup.tsx
import { ReactNode } from "react";

export default function DashboardCardGroup({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
}
