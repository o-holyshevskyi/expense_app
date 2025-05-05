"use client";

import type {ButtonProps, CardProps} from "@heroui/react";
import React from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
  PolarAngleAxis,
} from "recharts";
import {
  Card,
  cn,
} from "@heroui/react";
import ExpencesResponse, { BasicAccountData } from "@/shared/interfaces/api/expenses";
import { getTranslation, Locale } from "@/lib/i18n";

const formatTotal = (value: number | undefined) => {
  return value?.toLocaleString() ?? "0";
};

const CircleChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, "children"> & {
    title: string;
    color: ButtonProps["color"];
    chartData: { name: string; value: number }[];
    total: number;
  }
>(({className, title, color, chartData, total, ...props}, ref) => {
  return (
    <Card
        isPressable={true}
        isHoverable={true}
        ref={ref}
        className={cn("h-[170px] text-default-500 border border-transparent dark:border-default-100", className)}
        {...props}
    >
      <div className="flex text-default-500 h-full gap-x-3">
        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-none"
          height="100%"
          width="100%"
        >
          <RadialBarChart
            barSize={9}
            cx="50%"
            cy="50%"
            data={chartData}
            endAngle={-45}
            innerRadius={80}
            outerRadius={70}
            startAngle={225}
          >
            <PolarAngleAxis angleAxisId={0} domain={[0, total]} tick={false} type="number" />
            <RadialBar
              angleAxisId={0}
              animationDuration={1000}
              animationEasing="ease"
              background={{fill: "hsl(var(--heroui-default-100))"}}
              cornerRadius={12}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--heroui-${color === "default" ? "foreground" : color}))`}
                />
              ))}
            </RadialBar>
            <g>
              <text className="text-default-500" textAnchor="middle" x="50%" y="48%">
                <tspan className="fill-default-500 text-default-500 text-tiny" dy="-0.5em" x="50%">
                  {chartData?.[0]?.name}
                </tspan>
                <tspan fill="hsl(var(--heroui-default-500))" dy="1.5em" x="50%">
                  {formatTotal(chartData?.[0]?.value)}
                </tspan>
              </text>
            </g>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

CircleChartCard.displayName = "CircleChartCard";

// === Main Component that accepts ExpencesResponse ===
export default function ExpenseChart({ data, locale }: { data: ExpencesResponse; locale: Locale }) {
  const metrics = data.accountStatement.basicAccountData;

  const chartCards = [
    {
      title: getTranslation(locale, "addExpenses.reviewStep.initialBalance"),
      key: "initialBalance",
      color: "default",
    },
    {
      title: getTranslation(locale, "addExpenses.reviewStep.totalRecieved"),
      key: "totalRecieved",
      color: "success",
    },
    {
      title: getTranslation(locale, "addExpenses.reviewStep.totalWithdrawn"),
      key: "totalWithdrawn",
      color: "danger",
    },
    {
      title: getTranslation(locale, "addExpenses.reviewStep.finalBalance"),
      key: "finalBalance",
      color: "primary",
    },
    {
      title: getTranslation(locale, "addExpenses.reviewStep.reservationOfFunds"),
      key: "reservationOfFunds",
      color: "warning",
    },
    {
      title: getTranslation(locale, "addExpenses.reviewStep.availableBalance"),
      key: "availableBalance",
      color: "secondary",
    },
  ];

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {chartCards.map(({title, key, color}, index) => (
            <CircleChartCard
                key={index}
                title={title}
                color={color as ButtonProps["color"]}
                total={metrics[key as keyof BasicAccountData] || 0}
                chartData={[
                {
                name: title,
                value: metrics[key as keyof BasicAccountData] || 0,
                },
            ]}
        />
      ))}
    </dl>
  );
}
