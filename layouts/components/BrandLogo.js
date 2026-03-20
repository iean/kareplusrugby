import config from "@config/config.json";
import Image from "next/image";
import Link from "next/link";

const variants = {
  horizontal: {
    src: config.site.logo || "/images/logos/kare-plus-horizontal.svg",
    width: 760,
    height: 210,
  },
  stacked: {
    src: "/images/logos/kare-plus-stacked.svg",
    width: 860,
    height: 840,
  },
};

const BrandLogo = ({
  variant = "horizontal",
  linked = true,
  className = "",
  imageClassName = "",
  priority = false,
}) => {
  const { base_url, title } = config.site;
  const selectedVariant = variants[variant] || variants.horizontal;

  const logoImage = (
    <Image
      src={selectedVariant.src}
      alt={title}
      width={selectedVariant.width}
      height={selectedVariant.height}
      className={imageClassName}
      priority={priority}
    />
  );

  if (!linked) {
    return <div className={className}>{logoImage}</div>;
  }

  return (
    <Link href={base_url} className={className}>
      {logoImage}
    </Link>
  );
};

export default BrandLogo;
