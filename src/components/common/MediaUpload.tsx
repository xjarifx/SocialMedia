import { Image } from "lucide-react";
import { useCallback } from "react";

interface MediaUploadProps {
  onFileSelect: (file: File | null) => void;
  maxSizeBytes?: number;
  accept?: string;
  className?: string;
}

export function MediaUpload({
  onFileSelect,
  maxSizeBytes = 50 * 1024 * 1024,
  accept = "image/*,video/*",
  className = "",
}: MediaUploadProps) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        alert("Please select an image or video file");
        event.target.value = "";
        return;
      }

      if (file.size > maxSizeBytes) {
        alert(`File size exceeds ${maxSizeBytes / (1024 * 1024)} MB limit`);
        event.target.value = "";
        return;
      }

      onFileSelect(file);
      event.target.value = "";
    },
    [maxSizeBytes, onFileSelect],
  );

  return (
    <label
      className={`cursor-pointer ${className}`}
      aria-label="Upload media"
      title="Upload media"
    >
      <Image className="h-4 w-4" />
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
}
