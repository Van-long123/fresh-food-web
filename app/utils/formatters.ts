/**
 * Định dạng chuỗi ngày tháng sang kiểu vi-VN (VD: 25 thg 4, 2024)
 */
export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Định dạng số lượng lớn sang kiểu rút gọn (VD: 4500 -> 4.5k+)
 */
export const formatCount = (num: number | undefined) => {
  if (num === undefined) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k+";
  return num.toString();
};
