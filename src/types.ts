export type Data = {
  mid: string;
  name: string;
  archive_count: number;
  follower: number;
  like_num: number;
  update_time: string;
}[];
export type RawOptions = Record<
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
export interface Option {
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
  dataZoom: {
    type: "inside" | "slider";
  };
}
