export const defaultMeasurements = {
  shirt: {
    length: "",
    chest: "",
    sleeve: "",
    shoulder: "",
    waist: "",
    front: "",
    neck: "",
  },
  pant: {
    length: "",
    waist: "",
    hip: "",
    ankles: "",
    thighs: "",
    rise: "",
    knee: "",
  },
} as const;

export type ShirtMeasurements = typeof defaultMeasurements.shirt;
export type PantMeasurements = typeof defaultMeasurements.pant;
export type MeasurementForm = ShirtMeasurements | PantMeasurements;
export type MeasurementType = keyof typeof defaultMeasurements;
