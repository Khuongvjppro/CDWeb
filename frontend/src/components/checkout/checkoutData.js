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
