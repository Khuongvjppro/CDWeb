const IMAGE_FILES = [
  "Cappuccino Nóng.png",
  "Cà Phê Sữa Tươi.png",
  "Cà Phê Đen.png",
  "Espresso Chuẩn Ý.png",
  "Freeze Cà Phê.png",
  "Freeze Kem Cà Phê.png",
  "Freeze Sô Cô La.png",
  "Freeze Trà Xanh.png",
  "Freeze Trà Đào.png",
  "Latte Mượt Mà.png",
  "Mocha Socola.png",
  "Trà Hồng Nhài.png",
  "Trà Xanh Chanh.png",
  "Trà Ô Long Đậm.png",
  "Trà Ô Long ĐậmTrà Đào Kem Chese.png",
  "Trà Đào Tươi.png",
];

const DEFAULT_IMAGE = "Cà Phê Đen.png";

const buildPublicImagePath = (fileName) => {
  const base = `${process.env.PUBLIC_URL || ""}/Image product/${fileName}`;
  return encodeURI(base);
};

const normalizeName = (value) => {
  if (!value) {
    return "";
  }
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
};

const findImageByName = (name) => {
  const target = normalizeName(name);
  if (!target) {
    return null;
  }

  const exactMatch = IMAGE_FILES.find((file) => {
    const baseName = file.replace(/\.[^.]+$/, "");
    return normalizeName(baseName) === target;
  });

  if (exactMatch) {
    return exactMatch;
  }

  return (
    IMAGE_FILES.find((file) => {
      const baseName = file.replace(/\.[^.]+$/, "");
      const normalizedBase = normalizeName(baseName);
      return normalizedBase.includes(target) || target.includes(normalizedBase);
    }) || null
  );
};

export const getDefaultImageSrc = () => buildPublicImagePath(DEFAULT_IMAGE);

export const getProductImageSrc = (product) => {
  if (!product) {
    return getDefaultImageSrc();
  }

  const matched = findImageByName(product.name || "");
  if (matched) {
    return buildPublicImagePath(matched);
  }

  if (product.image) {
    return product.image;
  }

  return getDefaultImageSrc();
};
