import ReactECharts from "~/components/ReactECharts";
import { useOptions } from "~/hooks/useOptions";

export default function Home() {
  const { loading, options } = useOptions();

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
