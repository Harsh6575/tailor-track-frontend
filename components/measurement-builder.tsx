import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultMeasurements, MeasurementType } from "@/lib/constants/measurements";
import { Plus, Trash2 } from "lucide-react";
import {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type MeasurementData = {
  type: string;
  notes?: string;
  data: Record<string, string>;
};

// TODO: type fixing
/* eslint-disable @typescript-eslint/no-explicit-any */
type MeasurementBuilderProps = {
  // For nested measurements array (AddCustomerDialog)
  control?: Control<any>;
  fields?: FieldArrayWithId<any, "measurements", "id">[];
  append?: UseFieldArrayAppend<any, "measurements">;
  remove?: UseFieldArrayRemove;
  watch?: UseFormWatch<any>;
  setValue?: UseFormSetValue<any>;
  register?: UseFormRegister<any>;
  fieldPrefix?: string; // e.g., "measurements"

  // For single measurement form (Add/Edit Measurement Dialog)
  singleMode?: boolean;
  singleData?: MeasurementData;
  onSingleDataChange?: (data: MeasurementData) => void;
};

export const MeasurementBuilder = ({
  // control,
  fields = [],
  append,
  remove,
  watch,
  setValue,
  register,
  fieldPrefix = "measurements",
  singleMode = false,
  singleData,
  onSingleDataChange,
}: MeasurementBuilderProps) => {
  // Helper: add a measurement card for a garment type with default data
  const addMeasurementOfType = (type: MeasurementType) => {
    const template = defaultMeasurements[type];
    if (append) {
      append({
        type,
        notes: "",
        data: { ...template },
      });
    }
  };

  // Helper: add a custom field to measurement data
  const addCustomField = (index: number, key: string) => {
    if (!setValue || !watch) return;

    const currentData = watch(`${fieldPrefix}.${index}.data`) as Record<string, string> | undefined;
    setValue(`${fieldPrefix}.${index}.data`, {
      ...currentData,
      [key]: "",
    });
  };

  // Helper: remove a custom field from measurement data
  const removeCustomField = (index: number, key: string) => {
    if (!setValue || !watch) return;

    const currentData = watch(`${fieldPrefix}.${index}.data`) as Record<string, string> | undefined;
    if (currentData) {
      const newData = { ...currentData };
      delete newData[key];
      setValue(`${fieldPrefix}.${index}.data`, newData);
    }
  };

  // Single mode handlers
  const addCustomFieldSingle = (key: string) => {
    if (!onSingleDataChange || !singleData) return;

    onSingleDataChange({
      ...singleData,
      data: {
        ...singleData.data,
        [key]: "",
      },
    });
  };

  const removeCustomFieldSingle = (key: string) => {
    if (!onSingleDataChange || !singleData) return;

    const newData = { ...singleData.data };
    delete newData[key];
    onSingleDataChange({
      ...singleData,
      data: newData,
    });
  };

  const updateSingleField = (field: keyof MeasurementData, value: unknown) => {
    if (!onSingleDataChange || !singleData) return;

    onSingleDataChange({
      ...singleData,
      [field]: value,
    });
  };

  const updateSingleDataField = (key: string, value: string) => {
    if (!onSingleDataChange || !singleData) return;

    onSingleDataChange({
      ...singleData,
      data: {
        ...singleData.data,
        [key]: value,
      },
    });
  };

  // Single Mode Rendering
  if (singleMode && singleData) {
    const dataKeys = Object.keys(singleData.data);
    const isTemplateType = singleData.type === "shirt" || singleData.type === "pant";
    const templateKeys = isTemplateType
      ? Object.keys(defaultMeasurements[singleData.type as MeasurementType])
      : [];

    return (
      <div className="space-y-4">
        {/* Type Selection Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant={singleData.type === "shirt" ? "default" : "outline"}
            onClick={() => {
              onSingleDataChange?.({
                ...singleData,
                type: "shirt",
                data: { ...defaultMeasurements.shirt },
              });
            }}
            className="flex-1"
          >
            Shirt
          </Button>
          <Button
            type="button"
            variant={singleData.type === "pant" ? "default" : "outline"}
            onClick={() => {
              onSingleDataChange?.({
                ...singleData,
                type: "pant",
                data: { ...defaultMeasurements.pant },
              });
            }}
            className="flex-1"
          >
            Pant
          </Button>
        </div>

        {/* Type & Notes */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Type</Label>
            <Input
              value={singleData.type}
              onChange={(e) => updateSingleField("type", e.target.value)}
              placeholder="e.g. shirt, pant"
            />
          </div>
          <div className="grid gap-2">
            <Label>Notes (Optional)</Label>
            <Input
              value={singleData.notes || ""}
              onChange={(e) => updateSingleField("notes", e.target.value)}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        {/* Measurement Fields */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Measurements</Label>
          <div className="grid grid-cols-2 gap-3">
            {dataKeys.map((key) => {
              const isTemplateField = templateKeys.includes(key);
              return (
                <div key={key} className="grid gap-2 relative">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">
                      {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                    {!isTemplateField && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => removeCustomFieldSingle(key)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={singleData.data[key] || ""}
                    onChange={(e) => updateSingleDataField(key, e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
              );
            })}
          </div>

          {/* Add Custom Field */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              const newKey = prompt("Enter field name (e.g., collar, cuff):");
              if (newKey && newKey.trim()) {
                addCustomFieldSingle(newKey.trim().toLowerCase().replace(/\s+/g, "_"));
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Field
          </Button>
        </div>
      </div>
    );
  }

  // Array Mode Rendering (for AddCustomerDialog)
  return (
    <div className="space-y-4">
      {/* Buttons to add a Shirt or Pant card */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => addMeasurementOfType("shirt")}>
          <Plus className="mr-2 h-4 w-4" /> Add Shirt
        </Button>
        <Button type="button" variant="outline" onClick={() => addMeasurementOfType("pant")}>
          <Plus className="mr-2 h-4 w-4" /> Add Pant
        </Button>
      </div>

      {/* Render each measurement card */}
      <div className="space-y-4">
        {fields.map((field, index) => {
          if (!watch || !setValue || !register) return null;

          const typeValue = watch(`${fieldPrefix}.${index}.type`) as string | undefined;
          const dataValue = watch(`${fieldPrefix}.${index}.data`) as
            | Record<string, string>
            | undefined;

          // Auto-populate template data if type matches
          if (
            (!dataValue || Object.keys(dataValue).length === 0) &&
            (typeValue === "shirt" || typeValue === "pant")
          ) {
            setValue(`${fieldPrefix}.${index}.data`, {
              ...defaultMeasurements[typeValue as MeasurementType],
            });
          }

          const dataKeys = dataValue ? Object.keys(dataValue) : [];
          const isTemplateType = typeValue === "shirt" || typeValue === "pant";
          const templateKeys =
            isTemplateType && typeValue
              ? Object.keys(defaultMeasurements[typeValue as MeasurementType])
              : [];

          return (
            <div key={field.id} className="p-4 border rounded-lg space-y-3 relative bg-card">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => remove?.(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid sm:grid-cols-2 gap-3 pr-10">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Input
                    {...register(`${fieldPrefix}.${index}.type`)}
                    placeholder="e.g. shirt, pant"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Input
                    {...register(`${fieldPrefix}.${index}.notes`)}
                    placeholder="Notes (optional)"
                  />
                </div>
              </div>

              {/* Render measurement fields dynamically */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Measurements</Label>
                <div className="grid grid-cols-2 gap-3">
                  {dataKeys.length > 0 ? (
                    dataKeys.map((key) => {
                      const isTemplateField = templateKeys.includes(key);
                      return (
                        <div key={key} className="grid gap-2 relative">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">
                              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Label>
                            {!isTemplateField && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-destructive hover:text-destructive"
                                onClick={() => removeCustomField(index, key)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <Input
                            {...register(`${fieldPrefix}.${index}.data.${key}`)}
                            placeholder="Value"
                            className="h-9"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-sm text-muted-foreground">
                      Click &#34;Add Shirt&#34; or &#34;Add Pant&#34; to get started with template
                      fields.
                    </div>
                  )}
                </div>

                {/* Add Custom Field Button */}
                {dataKeys.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      const newKey = prompt("Enter field name (e.g., collar, cuff):");
                      if (newKey && newKey.trim()) {
                        addCustomField(index, newKey.trim().toLowerCase().replace(/\s+/g, "_"));
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Field
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No measurements added yet</p>
          <p className="text-sm mt-1">
            Click &#34;Add Shirt&#34; or &#34;Add Pant&#34; to get started
          </p>
        </div>
      )}
    </div>
  );
};
