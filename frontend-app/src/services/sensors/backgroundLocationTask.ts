import * as TaskManager from "expo-task-manager";
import type { LocationObject } from "expo-location";

import { BACKGROUND_LOCATION_TASK } from "../../constants/sensors";
import { appendLocationReadings } from "../../utilities/sensorStorage";
import { toLocationReading } from "../../utilities/locationReading";

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) return;

  const locations = (data as any)?.locations as LocationObject[] | undefined;
  if (!locations || locations.length === 0) return;

  const readings = locations.map(toLocationReading);
  await appendLocationReadings(readings);
});
