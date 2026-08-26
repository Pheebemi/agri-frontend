"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/input";
import { errorMessage } from "@/lib/api/errors";
import { createFarm, updateFarm } from "@/lib/api/farms";
import type { Farm } from "@/lib/api/types";

export function FarmFormDialog({
  open,
  onClose,
  farm,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  farm?: Farm | null;
  onSaved: () => void;
}) {
  const isEdit = Boolean(farm);
  const [name, setName] = useState(farm?.name ?? "");
  const [crops, setCrops] = useState(farm?.crops ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      if (isEdit && farm) {
        await updateFarm(farm.id, { name, crops });
        toast.success("Farm updated");
      } else {
        await createFarm({ name, crops });
        toast.success("Farm added");
      }
      onSaved();
      onClose();
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't save that farm"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? "Edit farm" : "Add a farm"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Farm name" htmlFor="farm-name">
          <Input
            id="farm-name"
            required
            placeholder="Farm A"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        <Field
          label="Crops"
          htmlFor="farm-crops"
          hint="One crop per line, e.g. Maize / Cassava / Yam."
        >
          <Textarea
            id="farm-crops"
            placeholder={"Maize\nCassava"}
            value={crops}
            onChange={(event) => setCrops(event.target.value)}
          />
        </Field>
        <Button type="submit" block loading={saving}>
          {isEdit ? "Save changes" : "Add farm"}
        </Button>
      </form>
    </Dialog>
  );
}
