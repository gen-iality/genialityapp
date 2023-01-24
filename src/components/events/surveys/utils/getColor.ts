import { COLORS_SETTINGS } from "../chartsConfiguration";

export const getColor = (number: number) => {
  return COLORS_SETTINGS.backgroundColor[number % COLORS_SETTINGS.backgroundColor.length]
}