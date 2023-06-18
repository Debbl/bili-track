import { useRequest } from "ahooks";
import { useMemo } from "react";
import type { Data, Option, RawOptions } from "~/types";

async function getData() {
  return await (await fetch("/api/get-data")).json();
}
function formatByPad(num: number) {
  return num.toString().padStart(2, "0");
}

const useOptions = () => {
  const { data, loading } = useRequest<Data, any>(() => getData());
  const options = useMemo<Option[]>(() => {
    const rawOptions: RawOptions = {};
    const options: Option[] = [];
    if (!data) return [];
    data.forEach((d) => {
      if (!rawOptions[d.fields.mid]) {
        rawOptions[d.fields.mid] = {
          name: d.fields.name,
          fields: [],
        };
      }
      rawOptions[d.fields.mid].fields.push(d.fields);
    });
    for (const key in rawOptions) {
      const o = rawOptions[key];
      const source: [string, number][] = o.fields.map((f) => {
        const d = new Date(f.update_time);
        return [
          `${d.getFullYear()}/${formatByPad(d.getMonth() + 1)}/${formatByPad(
            d.getDate()
          )}`,
          f.follower,
        ];
      });
      const markPointValues = [source[0][1]];
      for (let i = 1; i < source.length; i++) {
        markPointValues.push(source[i][1] - source[i - 1][1]);
      }
      const numIntl = new Intl.NumberFormat("en", { style: "decimal" });
      const markPointData = source.map((s, i) => {
        const v = markPointValues[i];
        const fv = numIntl.format(v);
        return {
          name: s[0],
          coord: [s[0], 0],
          value: v > 0 ? `+${fv}` : `-${fv}`,
        };
      });
      options.push({
        title: {
          text: o.name,
        },
        dataset: {
          source,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "line",
            markPoint: {
              data: markPointData,
              symbol: "pin",
            },
            label: {
              show: true,
              position: "top",
              formatter: ({ data }) => {
                return numIntl.format(data[1]);
              },
            },
          },
        ],
        dataZoom: {
          type: "slider",
        },
      });
    }
    return options;
  }, [data]);

  return {
    loading,
    options,
  };
};

export { useOptions };
