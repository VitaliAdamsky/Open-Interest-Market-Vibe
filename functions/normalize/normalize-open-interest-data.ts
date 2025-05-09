import { OpenInterestData } from "../../models/open-interest-data.ts";
import { getColorFromChangeValue } from "../utils/get-color-from-change-value.ts";
import { getColorFromValue } from "../utils/get-color-from-value.ts";

export function normalizeOpenInterestData(
  openInterestDataArray: OpenInterestData[]
): OpenInterestData[] {
  return openInterestDataArray.map((coinData) => {
    const { data } = coinData;

    // Extract values for normalization
    const openInterests = data.map((item) => item.openInterest);
    const openInterestChanges = data.map((item) => item.openInterestChange);

    // Calculate min/max for openInterest
    const oiMin = Math.min(...openInterests);
    const oiMax = Math.max(...openInterests);
    const oiRange = oiMax - oiMin;
    const oiUniform = oiRange === 0;

    // Calculate min/max for openInterestChange
    const oiChangeMin = Math.min(...openInterestChanges);
    const oiChangeMax = Math.max(...openInterestChanges);

    // Update data with normalization and colors
    const updatedData = data.map((item) => {
      // Normalize openInterest
      const normalizedOi = oiUniform
        ? 1
        : (item.openInterest - oiMin) / oiRange;
      const oiColor = getColorFromValue(normalizedOi); // Gradient of green

      // Color for openInterestChange (diverging scale)
      const oiChangeColor = getColorFromChangeValue(
        item.openInterestChange,
        oiChangeMin,
        oiChangeMax
      );

      // Return updated item with colors in the `colors` field
      return {
        ...item,
        colors: {
          ...item.colors,
          openInterest: oiColor,
          openInterestChange: oiChangeColor,
        },
        normalizedOpenInterest: parseFloat(normalizedOi.toFixed(4)),
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}
