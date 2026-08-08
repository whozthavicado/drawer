"use client";

export function DeleteDialog({
  noteTitle,
  onConfirm,
  onCancel,
}: {
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
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
          ¿Borrar esta nota?
        </h3>
        <p className="text-sm text-muted-foreground">
          &ldquo;{noteTitle}&rdquo; se borrará permanentemente. No se puede deshacer.
        </p>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Mantener
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
