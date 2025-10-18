import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-neutral-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-neutral-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-800">
                <h3 className="text-xl font-bold text-white">{title}</h3>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-neutral-900/50 flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                  size="sm"
                >
                  {cancelText}
                </Button>
                <Button
                  variant={
                    confirmVariant === "danger" ? "secondary" : "primary"
                  }
                  onClick={handleConfirm}
                  disabled={isLoading}
                  size="sm"
                  className={
                    confirmVariant === "danger"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : ""
                  }
                >
                  {isLoading ? "Processing..." : confirmText}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
