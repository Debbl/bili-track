import { useEffect, useState } from "react";
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
      label: {
        show: boolean;
        position: string;
      };
    }
  ];
}

export default function Home() {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    async function effect() {
      const data: Data = await (await fetch("/api/get-data")).json();
      const rawOptions: RawOptions = {};
      const options: Option[] = [];

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
        const source = o.fields.map((f) => {
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
              label: {
                show: true,
                position: "bottom",
              },
            },
          ],
        });
      }

      setOptions(options);
    }
    effect();
  }, []);

  return (
    <div>
      {options.map((o) => (
        <ReactECharts key={o.title.text} option={o as any} />
      ))}
    </div>
  );
}
