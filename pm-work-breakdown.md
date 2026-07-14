# Tài Liệu Dev Triển Khai Tính Năng Kế Toán (Code Ngay Không Cần Hỏi)

## 1. Mục tiêu tài liệu
- Tài liệu này là bản đặc tả kỹ thuật để FE/BE/QA code trực tiếp.
- Mỗi chức năng đều có: API cần làm, dữ liệu cần lưu, rule nghiệp vụ, ví dụ input/output, checklist test.
- Phạm vi bao phủ đủ 17 chức năng đã thống nhất với PM/BA.

## 2. Quy ước kỹ thuật chung (áp dụng cho tất cả chức năng)

### 2.1 Chuẩn dữ liệu
- Tiền tệ lưu kiểu số nguyên theo đơn vị nhỏ nhất (VND: đồng).
- Ngày giờ lưu UTC, hiển thị theo múi giờ VN.
- Mọi API ghi dữ liệu phải có `requestId` để chống ghi trùng (idempotency).
- Không cho sửa dữ liệu đã nằm trong kỳ khóa sổ.

### 2.2 Chuẩn response API
- Thành công: `{"success": true, "data": ..., "meta": ...}`
- Thất bại nghiệp vụ: `{"success": false, "errorCode": "ACC_PERIOD_LOCKED", "message": "Kỳ đã khóa"}`
- Mã lỗi dùng chung:
- `ACC_PERIOD_LOCKED`: thao tác trong kỳ khóa.
- `ACC_INVALID_ACCOUNT`: tài khoản không hợp lệ hoặc không cho hạch toán trực tiếp.
- `ACC_UNBALANCED_JE`: bút toán không cân Nợ/Có.
- `ACC_DUPLICATE_NUMBER`: trùng số chứng từ/số hóa đơn.

### 2.3 Bảng dữ liệu lõi tối thiểu
- `accounts(id, code, name, parent_id, is_postable, status)`
- `periods(id, year, month, lock_date, is_locked, locked_by, locked_at)`
- `vouchers(id, voucher_no, voucher_type, branch_id, voucher_date, posting_date, status, total_amount, currency)`
- `voucher_lines(id, voucher_id, account_id, debit, credit, customer_id, vendor_id, item_id, vat_rate)`
- `journal_entries(id, je_no, source_type, source_id, posting_date, branch_id, status)`
- `journal_lines(id, je_id, account_id, debit, credit, object_type, object_id)`
- `audit_logs(id, module, action, before_json, after_json, reason, actor, created_at)`

### 2.4 Thuật toán hạch toán chuẩn (dùng cho mọi chứng từ)
1. Validate payload + phân quyền + kỳ kế toán.
2. Build danh sách dòng bút toán theo rule nghiệp vụ.
3. Kiểm tra tổng Nợ = tổng Có.
4. Insert `vouchers`, `voucher_lines`, `journal_entries`, `journal_lines` trong 1 transaction DB.
5. Ghi `audit_logs`.
6. Trả mã chứng từ và số bút toán.

## 3. Đặc tả theo từng chức năng

## 3.1 Danh mục tài khoản kế toán
### API cần code
- `GET /api/accounts/tree`
- `POST /api/accounts`
- `PUT /api/accounts/{id}`
- `POST /api/accounts/{id}/deactivate`

### Rule bắt buộc
- Không cho tạo trùng `code`.
- Không cho đổi `code` nếu tài khoản đã phát sinh bút toán.
- Tài khoản cha `is_postable=false`.

### Ví dụ
- Request tạo tài khoản:
```json
{
  "code": "6421",
  "name": "Chi phí nhân viên quản lý",
  "parentCode": "642",
  "isPostable": true
}
```
- Kết quả: tạo thành công, xuất hiện trong cây tài khoản và dùng được khi lập phiếu.

### Checklist test
- Tạo mới hợp lệ.
- Chặn trùng mã.
- Chặn sửa mã tài khoản đã phát sinh.

## 3.2 Mở sổ/khóa sổ
### API cần code
- `POST /api/periods/{year}/{month}/lock`
- `POST /api/periods/{year}/{month}/unlock`
- `GET /api/periods/status?year=2026`

### Rule bắt buộc
- Chỉ role `chief_accountant` mới được unlock.
- Unlock phải có `reason`.
- Mọi create/update/delete chứng từ trong kỳ khóa trả `ACC_PERIOD_LOCKED`.

### Ví dụ
- Request khóa tháng 07/2026:
```json
{
  "lockDate": "2026-07-05",
  "reason": "Khóa sổ định kỳ"
}
```
- Kết quả: `periods.is_locked=true`, log audit được ghi.

### Checklist test
- Khóa kỳ thành công.
- Chặn thêm phiếu trong kỳ đã khóa.
- Unlock đúng quyền và bắt buộc lý do.

## 3.3 Sổ nhật ký chung
### API cần code
- `GET /api/reports/journal?fromDate=&toDate=&accountCode=&branchId=&page=&pageSize=`
- `GET /api/reports/journal/export?format=xlsx|pdf`

### Rule bắt buộc
- Hỗ trợ lọc theo ngày, loại chứng từ, chi nhánh, tài khoản.
- Sắp xếp mặc định `posting_date asc, je_no asc`.

### Ví dụ
- Query:
`/api/reports/journal?fromDate=2026-07-01&toDate=2026-07-31&accountCode=1111&page=1&pageSize=50`
- Kết quả: trả danh sách bút toán tài khoản 1111 trong tháng 7.

### Checklist test
- Đúng dữ liệu theo bộ lọc.
- Phân trang đúng tổng bản ghi.
- Export khớp số với màn hình.

## 3.4 Sổ chi tiết tài khoản
### API cần code
- `GET /api/reports/ledger?accountCode=&fromDate=&toDate=&branchId=`

### Rule bắt buộc
- Công thức: `ending = opening + debit - credit`.
- Cho drill-down từ dòng sổ chi tiết về chứng từ gốc.

### Ví dụ
- Nếu opening=100, debit=40, credit=10 thì ending=130.
- API trả cả `voucherId` để FE mở chứng từ.

### Checklist test
- Công thức đúng mọi tài khoản.
- Drill-down mở đúng chứng từ.

## 3.5 Bảng cân đối kế toán
### API cần code
- `GET /api/reports/balance-sheet?date=2026-07-31&branchId=`
- `POST /api/reports/balance-sheet/rebuild-mapping`

### Rule bắt buộc
- Mapping tài khoản -> chỉ tiêu phải cấu hình được.
- Cảnh báo khi `totalAssets != totalLiabilitiesAndEquity`.

### Ví dụ
- Nếu tài sản 10,000 và nguồn vốn 9,950 thì trả cảnh báo lệch 50.

### Checklist test
- Mapping đúng chỉ tiêu.
- Cảnh báo lệch xuất hiện đúng.

## 3.6 Kết chuyển cuối kỳ
### API cần code
- `POST /api/closing/run`
- `POST /api/closing/reverse`
- `GET /api/closing/history?year=&month=`

### Rule bắt buộc
- Chống chạy lặp cùng kỳ (idempotent theo kỳ).
- Chỉ chạy khi backlog chứng từ chưa hạch toán = 0.

### Ví dụ
- Input kỳ 07/2026.
- Engine sinh bút toán kết chuyển doanh thu/chi phí vào 911 và lãi lỗ vào 421.

### Checklist test
- Chạy lần 1 thành công.
- Chạy lần 2 báo đã kết chuyển.
- Reverse được khi có quyền.

## 3.7 Công nợ khách hàng (131)
### API cần code
- `GET /api/ar/aging?asOfDate=&customerId=`
- `GET /api/ar/statement?customerId=&fromDate=&toDate=`

### Rule bắt buộc
- Tính đúng opening, phát sinh tăng/giảm, closing.
- Phân bucket tuổi nợ: `0-30, 31-60, 61-90, >90`.

### Ví dụ
- Hóa đơn 100, đã thu 40 => dư nợ 60.
- Nằm bucket theo số ngày quá hạn.

### Checklist test
- Khớp với phiếu thu và hóa đơn bán.

## 3.8 Công nợ nhà cung cấp (331)
### API cần code
- `GET /api/ap/aging?asOfDate=&vendorId=`
- `GET /api/ap/statement?vendorId=&fromDate=&toDate=`

### Rule bắt buộc
- Có logic đối trừ khi vừa mua vừa trả/hoàn ứng.

### Ví dụ
- Hóa đơn mua 200, đã chi 120 => còn phải trả 80.

### Checklist test
- Khớp với phiếu chi và hóa đơn mua.

## 3.9 Đối soát
### API cần code
- `POST /api/reconciliation/run?period=2026-07`
- `GET /api/reconciliation/issues?status=open|closed&type=`
- `POST /api/reconciliation/issues/{id}/resolve`

### Rule bắt buộc
- Bắt các loại lệch: kho, công nợ, VAT, nhật ký-sổ chi tiết.
- Mỗi issue có trạng thái: `open, in_progress, resolved`.

### Ví dụ
- Kho báo 100, kế toán báo 98 => tạo issue lệch 2.

### Checklist test
- Run đối soát tạo đúng issue.
- Resolve issue lưu người xử lý + thời gian.

## 3.10 Hạch toán chứng từ thu
### API cần code
- `POST /api/vouchers/receipt`
- `GET /api/vouchers/receipt/{id}`

### Rule bắt buộc
- Không cho posting_date trong kỳ khóa.
- Tổng tiền phiếu = tổng các dòng hạch toán.

### Ví dụ định khoản
- Thu công nợ khách hàng 50:
- Nợ 1111: 50
- Có 131: 50

### Ví dụ request
```json
{
  "voucherDate": "2026-07-10",
  "postingDate": "2026-07-10",
  "customerId": "C001",
  "lines": [
    {"debitAccount": "1111", "creditAccount": "131", "amount": 50000000}
  ]
}
```

### Checklist test
- Sinh đúng bút toán.
- Chặn ngày trong kỳ khóa.

## 3.11 Hạch toán chứng từ chi
### API cần code
- `POST /api/vouchers/payment`

### Rule bắt buộc
- Validate hạn mức và đối tượng nhận chi.

### Ví dụ định khoản
- Chi trả NCC 30:
- Nợ 331: 30
- Có 1111: 30

### Checklist test
- Bút toán cân.
- Khớp công nợ NCC.

## 3.12 Hạch toán chứng từ nhập
### API cần code
- `POST /api/vouchers/purchase-receipt`

### Rule bắt buộc
- Cập nhật tồn kho đồng bộ với bút toán.
- VAT đầu vào tách riêng 1331.

### Ví dụ định khoản
- Nhập hàng giá trước VAT 100, VAT 10%, chưa thanh toán:
- Nợ 156: 100
- Nợ 1331: 10
- Có 331: 110

### Checklist test
- Tồn kho tăng đúng.
- 1331 và 331 đúng số.

## 3.13 Hạch toán chứng từ xuất
### API cần code
- `POST /api/vouchers/sales-issue`

### Rule bắt buộc
- Một lần xuất phải sinh 2 cặp bút toán:
- Ghi nhận doanh thu + VAT.
- Ghi nhận giá vốn + giảm kho.
- Chặn âm kho.

### Ví dụ định khoản
- Bán giá chưa VAT 150, VAT 10%, giá vốn 90, bán công nợ:
- Nợ 131: 165
- Có 511: 150
- Có 33311: 15
- Nợ 632: 90
- Có 156: 90

### Checklist test
- Chặn âm kho.
- Doanh thu, VAT, giá vốn khớp.

## 3.14 Hóa đơn mua vào
### API cần code
- `POST /api/purchase-invoices`
- `POST /api/purchase-invoices/{id}/link-voucher`
- `GET /api/purchase-invoices?status=unposted|posted`

### Rule bắt buộc
- Không cho trùng số hóa đơn + NCC + ngày.
- Trạng thái: `new, linked, posted`.

### Ví dụ
- Tạo hóa đơn mua vào rồi link sang phiếu nhập số `NK-000123`.

### Checklist test
- Link đúng chứng từ.
- Đối chiếu được 1331 và 331.

## 3.15 Hóa đơn bán ra
### API cần code
- `POST /api/sales-invoices`
- `POST /api/sales-invoices/{id}/link-voucher`
- `GET /api/sales-invoices?status=unposted|posted`

### Rule bắt buộc
- Số hóa đơn duy nhất theo mẫu ký hiệu + số.
- Theo dõi trạng thái thanh toán: `unpaid, partial, paid`.

### Ví dụ
- Hóa đơn bán ra link phiếu xuất `XK-000456`, tự gợi ý công nợ KH.

### Checklist test
- Khớp 511, 33311, 131.

## 3.16 Danh sách chứng từ chưa hạch toán
### API cần code
- `GET /api/unposted-documents?type=&fromDate=&toDate=&assignee=`
- `POST /api/unposted-documents/{id}/assign`
- `POST /api/unposted-documents/{id}/post`

### Rule bắt buộc
- Tiêu chí `unposted`: chưa có journal entry hợp lệ.
- Khóa sổ không cho phép backlog > 0.

### Ví dụ
- Trước khóa tháng, gọi API trả 12 chứng từ unposted.
- PM bắt buộc xử lý về 0 rồi mới chạy khóa sổ.

### Checklist test
- Đổi trạng thái đúng.
- Chặn khóa kỳ khi backlog > 0.

## 3.17 Cấu hình kỳ kế toán
### API cần code
- `GET /api/accounting-config`
- `PUT /api/accounting-config`

### Rule bắt buộc
- Trường cấu hình: năm tài chính, ngày bắt đầu kỳ, ngày khóa mặc định, cho phép mở khóa hay không.
- Mọi module đọc từ 1 nguồn cấu hình duy nhất.

### Ví dụ
- Config `defaultLockDay=5` => hệ thống gợi ý khóa ngày 05 cho từng tháng.

### Checklist test
- Đổi config có hiệu lực cho lock/kết chuyển/báo cáo.

## 4. Gợi ý tổ chức code để dev làm ngay

## 4.1 Cấu trúc module BE
- `modules/accounts`
- `modules/periods`
- `modules/vouchers`
- `modules/reports`
- `modules/closing`
- `modules/reconciliation`
- `modules/invoices`

Mỗi module gồm:
- `controller.ts`
- `service.ts`
- `repository.ts`
- `validator.ts`
- `routes.ts`

## 4.2 Pseudo code service hạch toán
```ts
async function postVoucher(payload, actor) {
  validatePayload(payload);
  assertPeriodOpen(payload.postingDate);

  const journalLines = buildJournalLines(payload);
  assertBalanced(journalLines);

  return db.transaction(async (tx) => {
    const voucher = await tx.vouchers.insert(payload);
    const je = await tx.journalEntries.insert(fromVoucher(voucher));
    await tx.journalLines.bulkInsert(toJournalRows(je.id, journalLines));
    await tx.auditLogs.insert(buildAudit(actor, payload));
    return { voucherId: voucher.id, jeId: je.id };
  });
}
```

## 4.3 Checklist Done Definition cho từng chức năng
- Có API + validate + unit test service.
- Có migration/index DB cần thiết.
- Có audit log cho thao tác quan trọng.
- Có integration test case thành công + case lỗi nghiệp vụ.
- Có test dữ liệu kỳ khóa.
- Có tài liệu ví dụ request/response cập nhật theo code thật.

## 5. Kế hoạch triển khai theo sprint (dev có thể bám ngay)
- Sprint 1: 3.1, 3.2, 3.10, 3.11
- Sprint 2: 3.12, 3.13, 3.3
- Sprint 3: 3.4, 3.5, 3.14, 3.15
- Sprint 4: 3.7, 3.8, 3.16, 3.17
- Sprint 5: 3.6, 3.9, hardening, UAT

## 6. Ma trận giao việc để dev code ngay

| Chức năng | BE phải làm | FE phải làm | DB/Index cần có | Test tối thiểu |
|---|---|---|---|---|
| 3.1 Tài khoản | CRUD + validate code/parent | Cây tài khoản + form thêm/sửa | unique index `accounts.code` | tạo/sửa/chặn trùng |
| 3.2 Khóa sổ | lock/unlock + permission + audit | màn hình tháng/năm + ngày khóa | index `periods(year,month)` | chặn ghi trong kỳ khóa |
| 3.3 Nhật ký | query có lọc + paging + export | lưới dữ liệu + bộ lọc | index `journal_entries(posting_date,branch_id)` | lọc đúng + export đúng |
| 3.4 Sổ chi tiết | tính opening/debit/credit/ending | màn hình ledger + drill-down | index `journal_lines(account_id)` | công thức số dư đúng |
| 3.5 Cân đối | aggregate theo mapping | layout báo cáo + cảnh báo lệch | bảng mapping chỉ tiêu | tài sản = nguồn vốn |
| 3.6 Kết chuyển | engine run/reverse + idempotent | nút chạy + lịch sử chạy | bảng `closing_runs` | chống chạy lặp |
| 3.7 AR 131 | statement + aging | báo cáo tuổi nợ KH | index `journal_lines(object_id)` | khớp hóa đơn/phiếu thu |
| 3.8 AP 331 | statement + aging + offset | báo cáo tuổi nợ NCC | index object + kỳ | khớp hóa đơn/phiếu chi |
| 3.9 Đối soát | run rules + issue workflow | queue issue + resolve | bảng `recon_issues` | tạo và đóng issue |
| 3.10 Phiếu thu | post receipt + JE | form phiếu thu nhiều dòng | index `vouchers(voucher_no)` | Nợ 111/112 Có 131 |
| 3.11 Phiếu chi | post payment + JE | form phiếu chi nhiều dòng | index voucher type/date | Nợ 331 Có 111/112 |
| 3.12 Nhập kho | post purchase + stock update | form nhập + VAT | index item/warehouse/date | N156/N133 C331 |
| 3.13 Xuất kho | post sale + COGS + stock out | form xuất + cảnh báo âm kho | index tồn kho realtime | 2 cặp bút toán chuẩn |
| 3.14 HĐ mua | CRUD + link voucher | danh sách hóa đơn vào | unique invoice key | khớp 1331,331 |
| 3.15 HĐ bán | CRUD + link voucher | danh sách hóa đơn ra | unique invoice key | khớp 511,33311,131 |
| 3.16 Chưa hạch toán | query backlog + assign + post | màn hình queue xử lý | index status/type/date | backlog về 0 trước khóa |
| 3.17 Config kỳ | get/update config + cache | màn cấu hình + cảnh báo ảnh hưởng | bảng `accounting_config` | config có hiệu lực toàn hệ |

## 7. Phân rã nhân sự theo vai trò Quốc, Thông, Trạng

## 7.1 Vai trò cố định
- Quốc: owner core kế toán + cố vấn nghiệp vụ + reviewer bắt buộc trước merge các rule hạch toán.
- Thông: fullstack (làm được cả BE và FE), owner chính nhóm Thu/Chi + công nợ + đối soát + hóa đơn mua.
- Trạng: fullstack (làm được cả BE và FE), owner chính nhóm Nhập/Xuất + sổ sách + hóa đơn bán + backlog chứng từ.
- Quy ước phân công: mỗi chức năng có 1 owner chính chịu trách nhiệm end-to-end (BE + FE), 1 người phối hợp làm backup.
- Nguyên tắc cân tải: phần chức năng ngoài core của Quốc được chia đều Thông 6 chức năng và Trạng 6 chức năng.

## 7.2 Ma trận owner theo chức năng (owner end-to-end)

| Chức năng | Owner chính | Phối hợp | Vai trò Quốc trong chức năng |
|---|---|---|---|
| 3.1 Danh mục tài khoản | Quốc | Trạng | Chốt cây tài khoản, rule khóa sửa, duyệt schema/accounts API |
| 3.2 Mở sổ/Khóa sổ | Quốc | Thông, Trạng | Chốt quy tắc lock/unlock, quyền mở khóa, chuẩn audit |
| 3.3 Sổ nhật ký | Trạng | Thông | Chốt logic đối chiếu journal với chứng từ |
| 3.4 Sổ chi tiết | Trạng | Thông | Chốt công thức opening/debit/credit/ending |
| 3.5 Bảng cân đối | Quốc | Trạng | Chốt mapping chỉ tiêu và rule cảnh báo lệch |
| 3.6 Kết chuyển cuối kỳ | Quốc | Thông | Chốt rule 911, 421, chống chạy lặp |
| 3.7 Công nợ KH 131 | Thông | Trạng | Cố vấn bucket tuổi nợ và chuẩn đối chiếu |
| 3.8 Công nợ NCC 331 | Thông | Trạng | Cố vấn logic đối trừ và hạn thanh toán |
| 3.9 Đối soát | Thông | Trạng | Chốt bộ rule sai lệch bắt buộc |
| 3.10 Chứng từ thu | Thông | Trạng | Duyệt matrix định khoản thu |
| 3.11 Chứng từ chi | Thông | Trạng | Duyệt matrix định khoản chi |
| 3.12 Chứng từ nhập | Trạng | Thông | Duyệt VAT đầu vào + đồng bộ tồn kho |
| 3.13 Chứng từ xuất | Trạng | Thông | Duyệt doanh thu/VAT/giá vốn và chặn âm kho |
| 3.14 Hóa đơn mua vào | Thông | Trạng | Cố vấn rule khấu trừ VAT và liên kết voucher |
| 3.15 Hóa đơn bán ra | Trạng | Thông | Cố vấn rule doanh thu/VAT/công nợ |
| 3.16 Chứng từ chưa hạch toán | Trạng | Thông | Chốt tiêu chí backlog về 0 trước khóa |
| 3.17 Cấu hình kỳ | Quốc | Trạng | Chốt tham số kỳ, defaultLockDay, phạm vi ảnh hưởng |

## 7.3 Kế hoạch giao việc theo sprint cho 3 người (fullstack)

| Sprint | Quốc | Thông | Trạng |
|---|---|---|---|
| Sprint 1 | Chốt core 3.1, 3.2; review thiết kế API/UX | Owner end-to-end 3.10, 3.11 (BE + FE), phối hợp 3.1, 3.2 | Owner end-to-end 3.1, 3.2 (BE + FE), phối hợp 3.10, 3.11 |
| Sprint 2 | Duyệt rule kho và VAT cho 3.12, 3.13 | Phối hợp nghiệp vụ kho và review API cho 3.12, 3.13 | Owner end-to-end 3.3, 3.12, 3.13 |
| Sprint 3 | Chốt mapping 3.5, review số liệu 3.4 | Owner end-to-end 3.14; phối hợp 3.4, 3.5 | Owner end-to-end 3.4, 3.15; phối hợp 3.14 |
| Sprint 4 | Chốt rule kỳ kế toán 3.17 | Owner end-to-end 3.7, 3.8, 3.9 | Owner end-to-end 3.16, 3.17; phối hợp 3.7, 3.8, 3.9 |
| Sprint 5 | Chốt nghiệp vụ 3.6, sign-off go-live | Owner end-to-end 3.6 + hardening | Owner end-to-end FE đối soát 3.9 + hardening/UAT fixes |

## 7.4 Đầu việc cụ thể theo người (giao ngay)

### Quốc
- Chốt tài liệu rule nghiệp vụ chuẩn cho 3.1, 3.2, 3.5, 3.6, 3.17.
- Review PR bắt buộc các chức năng có ảnh hưởng số liệu chốt kỳ.
- Tạo checklist kiểm tra trước khóa sổ và trước kết chuyển.
- Duyệt test scenario các case sai lệch lớn: lệch Nợ/Có, lệch VAT, âm kho.

### Thông
- Fullstack owner cân tải 6 chức năng: 3.7, 3.8, 3.9, 3.10, 3.11, 3.14.
- Viết unit test service BE và integration test API cho toàn bộ luồng post chứng từ.
- Tối ưu transaction và idempotency cho run kết chuyển/đối soát.
- Fix bug mức P1 liên quan sai định khoản trong vòng 24h.

### Trạng
- Fullstack owner cân tải 6 chức năng: 3.3, 3.4, 3.12, 3.13, 3.15, 3.16.
- Phối hợp Thông hoàn thiện contract request/response và trực tiếp xử lý BE khi cần chia tải.
- Chuẩn hóa UX validation cho form chứng từ và trạng thái lỗi nghiệp vụ.
- Viết e2e test cho luồng từ tạo chứng từ đến lên báo cáo.

## 7.5 Quy tắc phối hợp để không nghẽn việc
- PR nghiệp vụ chỉ merge khi có approval của Quốc với các chức năng 3.1, 3.2, 3.5, 3.6, 3.17.
- Thông và Trạng bắt buộc chốt API contract trước khi code FE.
- Daily 15 phút theo format: hôm qua done gì, hôm nay làm gì, blocker cần Quốc quyết.
- Cut-off thay đổi nghiệp vụ trước cuối sprint 2 ngày để QA regression.

## 8. Báo cáo PM hằng tuần (mẫu chuẩn)
- Tiến độ: % hoàn thành từng chức năng 3.1 -> 3.17.
- Chất lượng: số bug mở, bug nghiêm trọng, tỉ lệ pass test.
- Vận hành: số chứng từ unposted, số issue đối soát open.
- Rủi ro cần PM quyết định: thay đổi rule nghiệp vụ, đổi phạm vi sprint, điều phối nguồn lực.
