import { useRequest } from "ahooks";
import { useMemo } from "react";
import ReactECharts from "~/components/ReactECharts";

type Data = {
  recordId: string;
  createdAt: number;
  updatedAt: number;
  fields: {
    mid: string;
    name: string;
    archive_count: number;
    follower: number;
    like_num: number;
    update_time: string;
  };
}[];
type RawOptions = Record<
  string,
  {
    name: string;
    fields: {
      mid: string;
      name: string;
      archive_count: number;
      follower: number;
      like_num: number;
      update_time: string;
    }[];
  }
>;
interface Option {
  title: {
    text: string;
  };
  dataset: {
    source: any[];
  };
  xAxis: {
    type: string;
  };
  yAxis: {
    type: string;
  };
  series: [
    {
      type: string;
      markPoint: {
        data: any[];
        symbol: string;
      };
      label: {
        show: boolean;
        position: string;
        formatter: (p: { data: [string, number] }) => string;
      };
    }
  ];
}

async function getData() {
  return await (await fetch("/api/get-data")).json();
}

export default function Home() {
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
          `${d.getFullYear()}/${
            d.getMonth() + 1
          }/${d.getDate()} ${d.getHours()}:${d
            .getMonth()
            .toString()
            .padStart(2, "0")}`,
          f.follower,
        ];
      });
      const markPointValues = source.reduce(
        (a, b) => [...a, b[1] - a.at(-1)!],
        [0]
      );
      const numIntl = new Intl.NumberFormat("en", { style: "decimal" });
      const markPointData = source.map((s, i) => {
        const v = markPointValues[i + 1];
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
      });
    }
    return options;
  }, [data]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>loading</span>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {options.map((o) => (
          <ReactECharts key={o.title.text} option={o as any} />
        ))}
      </div>
    </div>
  );
}
