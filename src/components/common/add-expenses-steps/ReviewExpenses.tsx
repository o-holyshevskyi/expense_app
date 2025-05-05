import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, cn, RangeCalendar, RangeValue} from "@heroui/react";
import { useTheme } from "next-themes";
import ExpencesResponse from "@/shared/interfaces/api/expenses";
import { Category } from "@/pages/expense-categories";
import CircleChartComponent from "./review-step/BasicAccountData";
import { getTranslation, Locale } from "@/lib/i18n";
import { DateValue, parseDate} from "@internationalized/date";
import {I18nProvider, useDateFormatter} from "@react-aria/i18n";

interface ReviewExpensesProps {
    extractedExpences: ExpencesResponse | undefined;
}

interface CategorySum {
  name: string;
  value: number;
}

export default function ReviewExpenses({ extractedExpences }: ReviewExpensesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { locale } = useRouter();
  const { theme } = useTheme();
  const calendarColor = theme === "dark" ? "secondary" : "primary";
  const creditColor = "danger";
  const debitColor = "success";
  const [dateRange, setDateRange] = useState(() => {
    // Convert dates to DateValue format
    const startDateStr = extractedExpences?.accountStatement.period.startDate;
    const endDateStr = extractedExpences?.accountStatement.period.endDate;
    
    let start, end;
    
    if (startDateStr) {
      // Parse date from dd-MM-YYYY format
      const [day, month, year] = startDateStr.split('-').map(Number);
      start = parseDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
    
    if (endDateStr) {
      // Parse date from dd-MM-YYYY format
      const [day, month, year] = endDateStr.split('-').map(Number);
      end = parseDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
    
    return {
      start: start || parseDate(new Date().toISOString().split('T')[0]),
      end: end || parseDate(new Date().toISOString().split('T')[0])
    };
  });

  useEffect(() => {
    if (locale) {
      fetch(`/api/categories?locale=${locale}`)
        .then((response) => response.json())
        .then((data) => {
          setCategories(data.categories);
        });
    }
  }, [locale]);

  // Filter credit transactions (negative amounts) and group by category
  const creditCategoryData = useMemo(() => {
    // Filter only credit transactions (negative amounts)
    const creditTransactions = extractedExpences?.accountStatement.transactions.filter(tx => tx.amount < 0);
    
    // Group by category and sum values
    const categoryMap = new Map<string, number>();
    
    if (creditTransactions === undefined) {
      return [];
    }

    creditTransactions.forEach(transaction => {
      const category = transaction.transactionDetails?.category || "Uncategorized";
      const currentSum = categoryMap.get(category) || 0;
      // We use absolute value to make the chart look better
      categoryMap.set(category, currentSum + Math.abs(transaction.amount));
    });
    
    // Convert map to array format expected by the pie chart
    const result: CategorySum[] = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
    
    return result;
  }, [extractedExpences]);

  // Filter debit transactions (positive amounts) and group by category
  const debitCategoryData = useMemo(() => {
    // Filter only debit transactions (positive amounts)
    const debitTransactions = extractedExpences?.accountStatement.transactions.filter(tx => tx.amount > 0);
    
    // Group by category and sum values
    const categoryMap = new Map<string, number>();
    
    if (debitTransactions === undefined) {
      return [];
    }

    debitTransactions.forEach(transaction => {
      const category = transaction.transactionDetails?.category || "Uncategorized";
      const currentSum = categoryMap.get(category) || 0;
      categoryMap.set(category, currentSum + transaction.amount);
    });
    
    // Convert map to array format expected by the pie chart
    const result: CategorySum[] = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
    
    return result;
  }, [extractedExpences]);

  // Format number without currency symbol
  const formatTotal = (value: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Shared Tooltip component
  const renderTooltip = (color: string) => {    
    return ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="flex flex-col min-w-[160px] rounded-medium bg-background px-3 py-2 text-tiny shadow-small">
            {payload.map((entry: any, index: number) => {
              const name = entry.name;
              const value = entry.value;
              const category = categories.find((c) => c.title.toLowerCase() === name?.toLowerCase()) || { title: name as string };
  
              return (
                <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2 mb-1">
                  <div
                    className="h-2 w-2 flex-none rounded-full"
                    style={{
                      backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                    }}
                  />
                  <div className="flex w-full items-center justify-between gap-x-2 pr-1 text-xs">
                    <span className="text-default-500">{category.title}</span>
                    <span className="font-mono font-medium text-default-500">
                      {formatTotal(value as number)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      return null;
    };
  };

  // Shared legend component
  const renderLegend = (data: CategorySum[], color: string) => {
    return (
      <div className="flex w-30% mr-10 flex-col justify-center gap-4 p-4 text-tiny text-default-500 lg:p-0">
        {data.map((entry, index) => {
          const category = categories.find((c) => c.title.toLowerCase() === entry.name?.toLowerCase()) || { title: entry.name as string };

          return (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                  }}
                />
                <span className="capitalize">{category.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render a transaction card
  const renderTransactionCard = (title: string, data: CategorySum[], color: string) => {
    return (
      <Card 
        isPressable={true}
        isHoverable={true}
        className={cn("min-h-[240px] w-[560px] border border-transparent dark:border-default-100")}
      >
        <div className="flex flex-col gap-y-2 p-4 pb-0">
          <div className="flex items-center justify-between gap-x-2">
            <dt>
              <h3 className="text-small font-medium text-default-500">{title}</h3>
            </dt>
          </div>
        </div>
        <div className="flex h-full flex-wrap items-center justify-center gap-x-2 lg:flex-nowrap">
          {data.length > 0 ? (
            <ResponsiveContainer
              className="[&_.recharts-surface]:outline-none"
              height={250}
              width="70%"
            >
              <PieChart accessibilityLayer margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip content={renderTooltip(color)} cursor={false} />
                <Pie
                  animationDuration={1000}
                  animationEasing="ease"
                  data={data}
                  dataKey="value"
                  innerRadius="50%"
                  nameKey="name"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--heroui-${color}-${(index + 1) * 200}))`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] w-70% text-default-400">
              No transactions found
            </div>
          )}

          {renderLegend(data, color)}
        </div>
      </Card>
    );
  };

  const [value, setValue] = useState<RangeValue<DateValue>>({
    start: parseDate("2024-03-01"),
    end: parseDate("2024-03-07")
  });

  let formatter = useDateFormatter({dateStyle: "long"});

  return (
    <div className="mt-6 flex flex-row gap-6">
        <div className="flex flex-col gap-6">
          {extractedExpences && (
            <CircleChartComponent data={extractedExpences} locale={locale as Locale} />
          )}
          <div className="flex flex-row gap-6">
            {renderTransactionCard(getTranslation(locale as Locale, "addExpenses.reviewStep.charts.expences"), creditCategoryData, creditColor)}
            {renderTransactionCard(getTranslation(locale as Locale, "addExpenses.reviewStep.charts.income"), debitCategoryData, debitColor)}
            
          </div>
        </div>
        <div>
          <I18nProvider locale={locale}>
            <RangeCalendar
              isReadOnly 
              aria-label="period" 
              value={{
                start: dateRange.start,
                end: dateRange.end,
              }}
              color={calendarColor}
              className="before:bg-default-200"
              classNames={{
                gridWrapper: "dark:text-default-500 dark:bg-zinc-800 text-default-500 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black", // Wrapper around the grid
                cell: "text-primary-500",
                cellButton: "text-default-500"
              }}
            />
          </I18nProvider>
        </div>
    </div>
  );
}

