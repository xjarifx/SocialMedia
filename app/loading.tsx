import { Spinner } from "@/components/common/Spinner";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner size="lg" />
    </div>
  );
}
