// Mock seller data generator
export const sellerNames = [
  "Nguyễn Văn An",
  "Trần Thị Bình",
  "Lê Minh Châu",
  "Phạm Thị Dung",
  "Hoàng Văn Em",
  "Vũ Thị Hoa",
  "Đặng Minh Tuấn",
  "Ngô Thị Lan",
  "Bùi Văn Nam",
  "Dương Thị Mai",
  "Trương Văn Phong",
  "Lý Thị Quỳnh",
  "Phan Văn Sơn",
  "Võ Thị Thảo",
  "Đinh Văn Tú",
  "Mai Thị Uyên",
  "Đỗ Văn Vũ",
  "Tô Thị Xuân",
  "Hồ Văn Yên",
  "Chu Thị Zoe",
];

export const locations = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "Biên Hòa",
  "Nha Trang",
  "Huế",
  "Vũng Tàu",
  "Buôn Ma Thuột",
];

export const postedDates = [
  "Hôm nay",
  "1 ngày trước",
  "2 ngày trước",
  "3 ngày trước",
  "4 ngày trước",
  "5 ngày trước",
  "1 tuần trước",
  "2 tuần trước",
  "3 tuần trước",
  "1 tháng trước",
];

export const conditions = ["Như mới", "Tốt", "Rất tốt"];

export const getRandomSeller = (index = 0) => {
  const nameIndex = index % sellerNames.length;
  return {
    name: sellerNames[nameIndex],
    avatar: null,
    rating: (4.0 + Math.random() * 1.0).toFixed(1),
    totalSales: Math.floor(Math.random() * 100) + 10,
  };
};

export const getRandomLocation = (index = 0) => {
  return locations[index % locations.length];
};

export const getRandomPostedDate = (index = 0) => {
  return postedDates[index % postedDates.length];
};

export const getRandomBatteryHealth = () => {
  return Math.floor(Math.random() * 15) + 85; // 85-99%
};

export const getRandomUsageYears = () => {
  return Math.floor(Math.random() * 4) + 1; // 1-4 years
};

export const getRandomCondition = () => {
  return conditions[Math.floor(Math.random() * conditions.length)];
};
