# Kế Toán Dễ Dàng - Checklist Yêu Cầu

## ✅ Giao diện và UX/UI
- [x] Thiết kế đơn giản, tối giản (Glassmorphism style)
- [x] Màu sắc trực quan (Xanh lá - Thu/Doanh thu, Đỏ - Chi/Chi phí)
- [x] Thanh điều hướng (Sidebar) để chuyển module không load trang
- [x] Tách biệt từng loại phiếu thành module riêng
- [x] Gợi ý/hướng dẫn nhanh bằng ngôn ngữ bình dân ở mỗi module
- [x] Custom scrollbar và hiệu ứng Dark Mode hoàn thiện

## ✅ Module 1: Hệ thống tài khoản
- [x] Hiển thị danh sách tài khoản cơ bản
- [x] Phân loại rõ ràng (Tài sản, Nợ phải trả, Vốn, Doanh thu, Chi phí)
- [x] Giải thích dễ hiểu cho mỗi tài khoản
- [x] Tính năng thêm tài khoản mới

## ✅ Module 2: Định khoản tự động (Phiếu Thu, Chi, Nhập, Xuất)
- [x] Tách từng phiếu thành module riêng biệt
- [x] **Phiếu Thu**: Điền từ ai, lý do, số tiền → tự động Nợ/Có
- [x] **Phiếu Chi**: Điền lý do, diễn giải, số tiền → tự động Nợ/Có
- [x] **Phiếu Nhập Kho**: Nhập nhiều mặt hàng cùng lúc (tên, SL, đơn giá), tính tổng tiền tự động
- [x] **Phiếu Xuất Kho**: Xuất nhiều mặt hàng cùng lúc (tên, SL, đơn giá), tính tổng tiền tự động
- [x] Lưu phiếu và render ngay vào Sổ Nhật Ký

## ✅ Module 3: Sổ Nhật Ký Chung
- [x] Hiển thị tất cả giao dịch theo thời gian
- [x] Bộ lọc theo loại phiếu (Tất cả/Thu/Chi/Nhập/Xuất)
- [x] Hiển thị đầy đủ thông tin (Ngày, Số CT, Diễn giải, TK Nợ, TK Có, Số tiền)

## ✅ Module 4: Sổ Chi Tiết Tài Khoản
- [x] Dropdown chọn tài khoản
- [x] Hiển thị lịch sử biến động
- [x] Tính số dư đầu kỳ, phát sinh Nợ/Có, số dư cuối kỳ

## ✅ Module 5: Kết Chuyển Cuối Kỳ
- [x] Nút xử lý kết chuyển
- [x] Giải thích trực quan
- [x] Hiển thị Tổng Doanh Thu - Tổng Chi Phí = Lợi Nhuận Thuần
- [x] Thông báo Lời/Lỗ rõ ràng

## ✅ Module 6: Bảng Cân Đối Kế Toán
- [x] 2 cột: TÀI SẢN (Những gì bạn đang có) và NGUỒN VỐN (Tiền đó từ đâu ra)
- [x] Kiểm tra Tổng Tài Sản = Tổng Nguồn Vốn
- [x] Hiển thị trạng thái "Hệ thống Cân Đối (Hợp lệ)" màu xanh lá nếu khớp

## ✅ Mock Data
- [x] Khởi tạo sẵn danh mục tài khoản
- [x] 8 giao dịch mẫu (đầy đủ Thu, Chi, Nhập, Xuất)

## ✅ Công nghệ
- [x] HTML thuần, không cần framework
- [x] Tailwind CSS từ CDN
- [x] Vanilla JavaScript thuần
- [x] Không cần cài đặt, chạy được ngay trên trình duyệt
