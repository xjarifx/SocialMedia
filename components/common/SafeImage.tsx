import Image, { ImageProps } from "next/image";

type SafeImageProps = ImageProps & {
  suppressHydrationWarning?: boolean;
};

export default function SafeImage(props: SafeImageProps) {
  return <Image {...props} suppressHydrationWarning />;
}
