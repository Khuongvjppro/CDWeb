export const VIETNAM_PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

export const getShippingInfoByProvince = (province) => {
  if (province === "Hà Nội" || province === "TP. Hồ Chí Minh") {
    return {
      label: "Nội thành",
      fee: 15000,
      note: "Giao nhanh trong khu vực trung tâm",
    };
  }

  if (
    [
      "Đà Nẵng",
      "Hải Phòng",
      "Cần Thơ",
      "Bình Dương",
      "Đồng Nai",
      "Long An",
      "Bà Rịa - Vũng Tàu",
    ].includes(province)
  ) {
    return {
      label: "Khu vực lân cận",
      fee: 25000,
      note: "Áp dụng cho các tỉnh/thành gần",
    };
  }

  if (
    [
      "Quảng Ninh",
      "Hưng Yên",
      "Hải Dương",
      "Bắc Ninh",
      "Thái Nguyên",
      "Nam Định",
      "Ninh Bình",
      "Thừa Thiên Huế",
      "Khánh Hòa",
      "Lâm Đồng",
      "Quảng Nam",
      "Quảng Ngãi",
      "Thanh Hóa",
      "Nghệ An",
      "Hà Tĩnh",
    ].includes(province)
  ) {
    return {
      label: "Khu vực trung bình",
      fee: 35000,
      note: "Phù hợp các tỉnh thành còn lại",
    };
  }

  return {
    label: "Khu vực xa",
    fee: 45000,
    note: "Áp dụng cho các khu vực xa trung tâm",
  };
};

export const VN_HIERARCHY = {
  "Hà Nội": {
    "Quận Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Hàng Đào", "Phường Tràng Tiền", "Phường Lý Thái Tổ"],
    "Quận Ba Đình": ["Phường Trúc Bạch", "Phường Cống Vị", "Phường Kim Mã", "Phường Giảng Võ"],
    "Quận Tây Hồ": ["Phường Quảng An", "Phường Bưởi", "Phường Nhật Tân", "Phường Thuỵ Khuê"],
    "Quận Cầu Giấy": ["Phường Dịch Vọng", "Phường Quan Hoa", "Phường Nghĩa Tân", "Phường Mai Dịch"],
    "Quận Đống Đa": ["Phường Láng Hạ", "Phường Cát Linh", "Phường Văn Miếu", "Phường Khương Thượng"]
  },
  "TP. Hồ Chí Minh": {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Phạm Ngũ Lão", "Phường Đa Kao"],
    "Quận 3": ["Phường Võ Thị Sáu", "Phường 1", "Phường 2", "Phường 3"],
    "Quận 5": ["Phường 1", "Phường 2", "Phường 3", "Phường 4"],
    "Quận Bình Thạnh": ["Phường 15", "Phường 25", "Phường 26", "Phường 27"],
    "Thành phố Thủ Đức": ["Phường Thảo Điền", "Phường An Phú", "Phường Bình An", "Phường Thủ Thiêm"]
  },
  "Đà Nẵng": {
    "Quận Hải Châu": ["Phường Thạch Thang", "Phường Hải Châu I", "Phường Hải Châu II", "Phường Hòa Thuận Tây"],
    "Quận Thanh Khê": ["Phường Vĩnh Trung", "Phường Tân Chính", "Phường Thạc Gián", "Phường Chính Gián"],
    "Quận Sơn Trà": ["Phường An Hải Tây", "Phường An Hải Bắc", "Phường Phước Mỹ", "Phường Thọ Quang"],
    "Quận Ngũ Hành Sơn": ["Phường Mỹ An", "Phường Khuê Mỹ", "Phường Hòa Hải", "Phường Hòa Quý"]
  }
};

export const getDistrictsByProvince = (province) => {
  if (VN_HIERARCHY[province]) {
    return Object.keys(VN_HIERARCHY[province]);
  }
  // Fallback cho các tỉnh khác để giao diện vẫn hoạt động mượt mà
  return [`Thành phố ${province}`, `Huyện/Thị xã thuộc ${province}`];
};

export const getWardsByDistrict = (province, district) => {
  if (VN_HIERARCHY[province] && VN_HIERARCHY[province][district]) {
    return VN_HIERARCHY[province][district];
  }
  // Fallback cho các tỉnh khác để giao diện vẫn hoạt động mượt mà
  return ["Phường Trung tâm", "Xã Trung tâm", "Phường/Xã khác"];
};
