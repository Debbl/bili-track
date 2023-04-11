import type {
  ICreateRecordsReqParams,
  IGetRecordsReqParams,
} from "@vikadata/vika";
import { Vika } from "@vikadata/vika";
import { DATA_SHEET_FANS_ID, DATA_SHEET_UPS_ID, VIKA_TOKEN } from "~/config";

const vika = new Vika({ token: VIKA_TOKEN });

const vika_datasheet_ups = vika.datasheet(DATA_SHEET_UPS_ID);
const vika_datasheet_fans = vika.datasheet(DATA_SHEET_FANS_ID);

const vika_view = (type: "ups" | "fans", params?: IGetRecordsReqParams) => {
  const datasheet =
    type === "fans"
      ? vika_datasheet_fans
      : type === "ups"
      ? vika_datasheet_ups
      : null;

  return datasheet!.records.query({
    ...params,
  });
};
const vika_create = (
  type: "ups" | "fans",
  newRecords: ICreateRecordsReqParams,
  fieldKey?: "name" | "id" | undefined
) => {
  const datasheet =
    type === "fans"
      ? vika_datasheet_fans
      : type === "ups"
      ? vika_datasheet_ups
      : null;

  return datasheet!.records.create(newRecords, fieldKey);
};

export { vika_view, vika_create };
