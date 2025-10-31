// Utility function to get provinces from CSV data
export function getProvincesFromCSV() {
  // This would normally parse the CSV file, but for now we'll use the known provinces
  // In a real implementation, you'd parse the vietnam.csv file
  const provinces = [
    { id: 1, code: "11", name: "Hà Nội", nameEn: "Ha Noi", type: "city" },
    { id: 2, code: "12", name: "Hồ Chí Minh", nameEn: "Ho Chi Minh", type: "city" },
    { id: 3, code: "13", name: "Đà Nẵng", nameEn: "Da Nang", type: "city" },
    { id: 4, code: "14", name: "Hải Phòng", nameEn: "Hai Phong", type: "city" },
    { id: 5, code: "15", name: "Cần Thơ", nameEn: "Can Tho", type: "city" },
    { id: 6, code: "16", name: "Huế", nameEn: "Hue", type: "city" },
    { id: 7, code: "17", name: "An Giang", nameEn: "An Giang", type: "province" },
    { id: 8, code: "18", name: "Bắc Ninh", nameEn: "Bac Ninh", type: "province" },
    { id: 9, code: "19", name: "Cà Mau", nameEn: "Ca Mau", type: "province" },
    { id: 10, code: "20", name: "Cao Bằng", nameEn: "Cao Bang", type: "province" },
    { id: 11, code: "21", name: "Đắk Lắk", nameEn: "Dak Lak", type: "province" },
    { id: 12, code: "22", name: "Điện Biên", nameEn: "Dien Bien", type: "province" },
    { id: 13, code: "23", name: "Đồng Nai", nameEn: "Dong Nai", type: "province" },
    { id: 14, code: "24", name: "Đồng Tháp", nameEn: "Dong Thap", type: "province" },
    { id: 15, code: "25", name: "Gia Lai", nameEn: "Gia Lai", type: "province" },
    { id: 16, code: "26", name: "Hà Tĩnh", nameEn: "Ha Tinh", type: "province" },
    { id: 17, code: "27", name: "Hưng Yên", nameEn: "Hung Yen", type: "province" },
    { id: 18, code: "28", name: "Khánh Hòa", nameEn: "Khanh Hoa", type: "province" },
    { id: 19, code: "29", name: "Lai Châu", nameEn: "Lai Chau", type: "province" },
    { id: 20, code: "30", name: "Lâm Đồng", nameEn: "Lam Dong", type: "province" },
    { id: 21, code: "31", name: "Lạng Sơn", nameEn: "Lang Son", type: "province" },
    { id: 22, code: "32", name: "Lào Cai", nameEn: "Lao Cai", type: "province" },
    { id: 23, code: "33", name: "Nghệ An", nameEn: "Nghe An", type: "province" },
    { id: 24, code: "34", name: "Ninh Bình", nameEn: "Ninh Binh", type: "province" },
    { id: 25, code: "35", name: "Phú Thọ", nameEn: "Phu Tho", type: "province" },
    { id: 26, code: "36", name: "Quảng Ngãi", nameEn: "Quang Ngai", type: "province" },
    { id: 27, code: "37", name: "Quảng Ninh", nameEn: "Quang Ninh", type: "province" },
    { id: 28, code: "38", name: "Quảng Trị", nameEn: "Quang Tri", type: "province" },
    { id: 29, code: "39", name: "Sơn La", nameEn: "Son La", type: "province" },
    { id: 30, code: "40", name: "Tây Ninh", nameEn: "Tay Ninh", type: "province" },
    { id: 31, code: "41", name: "Thái Nguyên", nameEn: "Thai Nguyen", type: "province" },
    { id: 32, code: "42", name: "Thanh Hóa", nameEn: "Thanh Hoa", type: "province" },
    { id: 33, code: "43", name: "Tuyên Quang", nameEn: "Tuyen Quang", type: "province" },
    { id: 34, code: "44", name: "Vĩnh Long", nameEn: "Vinh Long", type: "province" },
  ];

  return provinces;
}