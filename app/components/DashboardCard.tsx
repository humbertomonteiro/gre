// components/dashboard/DashboardCard.tsx
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: "blue" | "green" | "purple" | "yellow" | "red";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

const colorMap = {
  blue: {
    bg: "from-blue-50 to-blue-100/80",
    text: "text-blue-900",
    accent: "text-blue-600",
    border: "border-blue-200/60",
    icon: "bg-white/80 text-blue-600 shadow-blue-200/50",
    trend: {
      positive: "text-blue-600",
      negative: "text-blue-400",
    },
  },
  green: {
    bg: "from-green-50 to-green-100/80",
    text: "text-green-900",
    accent: "text-green-600",
    border: "border-green-200/60",
    icon: "bg-white/80 text-green-600 shadow-green-200/50",
    trend: {
      positive: "text-green-600",
      negative: "text-green-400",
    },
  },
  purple: {
    bg: "from-purple-50 to-purple-100/80",
    text: "text-purple-900",
    accent: "text-purple-600",
    border: "border-purple-200/60",
    icon: "bg-white/80 text-purple-600 shadow-purple-200/50",
    trend: {
      positive: "text-purple-600",
      negative: "text-purple-400",
    },
  },
  yellow: {
    bg: "from-yellow-50 to-yellow-100/80",
    text: "text-yellow-900",
    accent: "text-yellow-600",
    border: "border-yellow-200/60",
    icon: "bg-white/80 text-yellow-600 shadow-yellow-200/50",
    trend: {
      positive: "text-yellow-600",
      negative: "text-yellow-400",
    },
  },
  red: {
    bg: "from-red-50 to-red-100/80",
    text: "text-red-900",
    accent: "text-red-600",
    border: "border-red-200/60",
    icon: "bg-white/80 text-red-600 shadow-red-200/50",
    trend: {
      positive: "text-red-600",
      negative: "text-red-400",
    },
  },
};

export default function DashboardCard({
  title,
  value,
  icon,
  color = "blue",
  trend,
  subtitle,
  onClick,
  className = "",
}: DashboardCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={`
        group relative p-6 rounded-2xl border bg-gradient-to-br backdrop-blur-sm
        transition-all duration-300 ease-out
        hover:shadow-lg hover:scale-[1.02] hover:border-opacity-80
        active:scale-[0.99] active:shadow-md
        ${colors.bg} ${colors.border} ${colors.text}
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Efeito de brilho suave no hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium opacity-80 mb-1 truncate">
            {title}
          </p>

          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="text-2xl lg:text-3xl font-bold truncate">{value}</h2>

            {trend && (
              <span
                className={`
                text-xs font-semibold px-1.5 py-0.5 rounded-full
                ${
                  trend.isPositive
                    ? colors.trend.positive
                    : colors.trend.negative
                }
                bg-white/60 backdrop-blur-sm
              `}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs opacity-60 truncate">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div
            className={`
            p-3 rounded-xl shadow-sm backdrop-blur-sm
            transition-all duration-300 group-hover:scale-110
            ${colors.icon}
          `}
          >
            <div className="text-xl">{icon}</div>
          </div>
        )}
      </div>

      {/* Indicador de clique (se aplicável) */}
      {onClick && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 rounded-full bg-current opacity-40" />
        </div>
      )}
    </div>
  );
}
