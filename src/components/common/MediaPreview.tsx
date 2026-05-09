interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
}

export function MediaPreview({ file, onRemove }: MediaPreviewProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
      <p className="truncate text-xs text-text-primary">{file.name}</p>
      <button
        type="button"
        onClick={onRemove}
        className="ml-3 shrink-0 text-[12px] text-accent hover:text-accent-hover"
      >
        Remove
      </button>
    </div>
  );
}
