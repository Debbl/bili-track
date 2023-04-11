import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function ReactECharts({
  option,
  width = "800px",
  height = "300px",
}: {
  option: echarts.EChartsCoreOption;
  width?: string;
  height?: string;
}) {
  const eEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(eEl.current!);
    chart.setOption(option);

    return () => chart.dispose();
  }, [option]);

  return <div ref={eEl} style={{ width, height }}></div>;
}
