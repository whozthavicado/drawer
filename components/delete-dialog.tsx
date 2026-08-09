"use client";

import { useLanguage } from "./language-provider";

export function DeleteDialog({
  noteTitle,
  onConfirm,
  onCancel,
}: {
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useLanguage();
  const [before, after] = t("notes.deleteDialogBody", { title: "\0" }).split("\0");

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="delete-dialog-title" className="text-lg font-medium">
          {t("notes.deleteDialogTitle")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {before}
          {noteTitle}
          {after}
        </p>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {t("notes.keep")}
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {t("notes.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
