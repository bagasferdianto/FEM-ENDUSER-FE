import { StatusEnum, StatusRequestEnum } from "../_models/response/voting";

// map StatusEnum to StatusRequestEnum
const statusEnumToRequestEnum: Record<StatusEnum, StatusRequestEnum> = {
  [StatusEnum.ComingSoon]: StatusRequestEnum.ComingSoon,
  [StatusEnum.Active]: StatusRequestEnum.Active,
  [StatusEnum.NonActive]: StatusRequestEnum.NonActive,
};

export function mapStatusStringToEnumValue(status: StatusEnum): string {
  return statusEnumToRequestEnum[status].toString();
}
