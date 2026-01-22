import * as React from 'react'
import type { TooltipProps } from 'recharts'
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { cn } from '@/lib/utils'

type ChartColor = string

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: ChartColor
    theme?: Record<string, ChartColor>
  }
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }
  return context
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) return undefined
  // @ts-expect-error - payload is from recharts
  const payloadKey = payload?.[key] ?? payload?.payload?.[key]
  if (typeof payloadKey !== 'string') return undefined
  return config[payloadKey] ?? config[key]
}

export function ChartContainer({
  id,
  className,
  children,
  config,
}: {
  id?: string
  className?: string
  config: ChartConfig
  children: React.ComponentProps<typeof ResponsiveContainer>['children']
}) {
  const chartId = React.useId()
  const chartContainerId = id ?? `chart-${chartId}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartContainerId}
        className={cn(
          'flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke="#fff"]]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke="#ccc"]]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke="#ccc"]]:stroke-border [&_.recharts-sector[stroke="#fff"]]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none',
          className,
        )}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: Object.entries(config)
              .map(([key, itemConfig]) => {
                const color = itemConfig.color
                const theme = itemConfig.theme

                if (theme) {
                  return Object.entries(theme)
                    .map(([themeName, themeColor]) => {
                      return `[data-chart="${chartContainerId}"] [data-theme="${themeName}"] { --color-${key}: ${themeColor}; }`
                    })
                    .join('\n')
                }

                if (color) {
                  return `[data-chart="${chartContainerId}"] { --color-${key}: ${color}; }`
                }
                return null
              })
              .filter(Boolean)
              .join('\n'),
          }}
        />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

export const ChartTooltip = Tooltip

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideLabel = false,
  hideIndicator = false,
  indicator = 'dot',
  labelFormatter,
  formatter,
  nameKey,
  labelKey,
}: TooltipProps<number, string> & {
  className?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: 'dot' | 'line' | 'dashed'
  nameKey?: string
  labelKey?: string
}) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null

    const [item] = payload
    const key = `${labelKey ?? item.dataKey ?? item.name ?? 'value'}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)

    const value =
      !labelKey && typeof label === 'string'
        ? config[label]?.label ?? label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className="font-medium">
          {labelFormatter(String(value ?? ''), payload)}
        </div>
      )
    }

    return <div className="font-medium">{value}</div>
  }, [hideLabel, payload, label, labelFormatter, labelKey, config])

  if (!active || !payload?.length) return null

  return (
    <div
      className={cn(
        'grid min-w-32 items-start gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
    >
      {tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor =
            item.color ??
            // @ts-expect-error - dataKey exists on payload item
            `var(--color-${item.dataKey})` ??
            'currentColor'

          return (
            <div
              key={item.dataKey ?? index}
              className="flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground"
            >
              {!hideIndicator && (
                <div
                  className={cn(
                    'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                    {
                      'h-2.5 w-2.5': indicator === 'dot',
                      'w-1': indicator === 'line',
                      'w-0 border-[1.5px] border-dashed bg-transparent':
                        indicator === 'dashed',
                      'my-0.5': indicator === 'dashed',
                    },
                  )}
                  style={
                    {
                      '--color-bg': indicatorColor,
                      '--color-border': indicatorColor,
                    } as React.CSSProperties
                  }
                />
              )}
              <div className="flex flex-1 justify-between leading-none">
                <div className="grid gap-1.5">
                  <span className="text-muted-foreground">
                    {itemConfig?.label ?? item.name}
                  </span>
                </div>
                {item.value != null && (
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {formatter
                      ? formatter(
                          item.value,
                          item.name ?? '',
                          item,
                          index,
                          item.payload,
                        )
                      : item.value}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ChartLegend = Legend

export function ChartLegendContent({
  className,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> & {
  payload?: Array<Record<string, unknown>>
  verticalAlign?: 'top' | 'bottom'
  nameKey?: string
}) {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey ?? (item as { dataKey?: unknown }).dataKey ?? 'value'}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={key}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
          >
            {itemConfig?.icon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: (item as { color?: string }).color,
                }}
              />
            )}
            <span className="text-muted-foreground">
              {itemConfig?.label ??
                ((item as { value?: unknown }).value as React.ReactNode)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ChartGrid(props: React.ComponentProps<typeof CartesianGrid>) {
  return <CartesianGrid strokeDasharray="3 3" {...props} />
}

export function ChartXAxis(props: React.ComponentProps<typeof XAxis>) {
  return <XAxis tickLine={false} axisLine={false} {...props} />
}

export function ChartYAxis(props: React.ComponentProps<typeof YAxis>) {
  return <YAxis tickLine={false} axisLine={false} {...props} />
}
