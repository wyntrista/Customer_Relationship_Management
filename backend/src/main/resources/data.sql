-- Insert roles
INSERT IGNORE INTO roles(name) VALUES('ROLE_USER');
INSERT IGNORE INTO roles(name) VALUES('ROLE_ADMIN');
INSERT IGNORE INTO roles(name) VALUES('ROLE_MARKETING');
INSERT IGNORE INTO roles(name) VALUES('ROLE_TELESALES');
INSERT IGNORE INTO roles(name) VALUES('ROLE_SALES');

-- Insert users with hashed passwords (password: admin123 for all)
INSERT IGNORE INTO users (username, email, password, enabled, full_name, permission_level) 
VALUES ('admin', 'admin@crm.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', true, 'System Administrator', 1);

INSERT IGNORE INTO users (username, email, password, enabled, full_name, permission_level) 
VALUES ('marketing', 'marketing@crm.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', true, 'Marketing User', 2);

INSERT IGNORE INTO users (username, email, password, enabled, full_name, permission_level) 
VALUES ('telesales', 'telesales@crm.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', true, 'Telesales User', 3);

INSERT IGNORE INTO users (username, email, password, enabled, full_name, permission_level) 
VALUES ('sales', 'sales@crm.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', true, 'Sales User', 3);

INSERT IGNORE INTO users (username, email, password, enabled, full_name, permission_level) 
VALUES ('user', 'user@crm.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', true, 'Regular User', 0);

-- Associate users with roles
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 2); -- admin -> ROLE_ADMIN
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (2, 3); -- marketing -> ROLE_MARKETING
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (3, 4); -- telesales -> ROLE_TELESALES
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (4, 5); -- sales -> ROLE_SALES
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (5, 1); -- user -> ROLE_USER

-- Insert comprehensive leads data (50 leads)
INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Nguyễn Văn An', 'HA_NOI', '0910000001', 'anvannguyen1@gmail.com', 'Công ty TNHH ABC', 'FACEBOOK', 'CHUA_GOI', 'Khách hàng quan tâm đến sản phẩm CRM', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Trần Thị Bình', 'HO_CHI_MINH', '0910000002', 'binhthitran2@gmail.com', 'Tập đoàn XYZ', 'WEBSITE', 'WARM_LEAD', 'Đã gọi điện, khách quan tâm nhưng chưa quyết định', 1, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Lê Minh Cường', 'DA_NANG', '0910000003', 'cuongminhle3@gmail.com', 'Công ty Cổ phần DEF', 'GOOGLE', 'CHUA_LIEN_HE_DUOC', 'Lead chất lượng cao, đã demo sản phẩm', 2, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Phạm Thị Dũng', 'CAN_THO', '0910000004', 'dungthipham4@yahoo.com', 'Startup GHI', 'REFERRAL', 'CHUA_GOI', 'Khách hàng cá nhân, đã gửi báo giá', 2, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Hoàng Hữu Em', 'HAI_PHONG', '0910000005', 'emhuuhoang5@hotmail.com', 'Doanh nghiệp JKL', 'EMAIL', 'COLD_LEAD', 'Đang thảo luận điều khoản hợp đồng', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Phan Thu Phong', 'THUA_THIEN_HUE', '0910000006', 'phongthuuan6@company.com', 'Công ty MNO', 'PHONE', 'KY_HOP_DONG', 'Đã ký hợp đồng, khách hàng hài lòng', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Vũ Công Giang', 'DONG_NAI', '0910000007', 'giangcongvu7@email.com', 'Tổ chức PQR', 'FACEBOOK', 'TU_CHOI', 'Khách không phù hợp với ngân sách', 3, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đặng Đình Hải', 'BINH_DUONG', '0910000008', 'haidinhang8@gmail.com', 'Nhà máy STU', 'WEBSITE', 'CHUA_GOI', 'Lead mới từ triển lãm', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Bùi Xuân Khoa', 'KHANH_HOA', '0910000009', 'khoaxuanbui9@yahoo.com', 'Xí nghiệp VWX', 'GOOGLE', 'WARM_LEAD', 'Cần tư vấn thêm về giá cả', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đỗ Thanh Long', 'BA_RIA_VUNG_TAU', '0910000010', 'longthanhdo10@hotmail.com', 'Công ty YZ Tech', 'REFERRAL', 'CHUA_LIEN_HE_DUOC', 'Khách hàng tiềm năng cao', 3, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Hồ Văn Mai', 'LONG_AN', '0910000011', 'maivanho11@company.com', 'ABC Solutions', 'EMAIL', 'CHUA_GOI', 'Đã gửi proposal, đang chờ phản hồi', 1, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Ngô Thị Nam', 'TIEN_GIANG', '0910000012', 'namthingo12@email.com', 'XYZ Digital', 'PHONE', 'COLD_LEAD', 'Khách yêu cầu customization', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Dương Minh Oanh', 'AN_GIANG', '0910000013', 'oanhminhduong13@gmail.com', 'Tech Innovate', 'FACEBOOK', 'CHUA_GOI', 'Đang scheduling meeting', 3, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Lý Thu Phúc', 'DONG_THAP', '0910000014', 'phucthuuly14@yahoo.com', 'Smart Systems', 'WEBSITE', 'WARM_LEAD', 'Follow up sau 1 tuần', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Võ Quốc Quân', 'CAN_THO', '0910000015', 'quanquocvo15@hotmail.com', 'Green Energy Co', 'GOOGLE', 'CHUA_LIEN_HE_DUOC', 'Khách quan tâm package premium', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đào Hữu Sơn', 'SOC_TRANG', '0910000016', 'sonhuudao16@company.com', 'Blue Ocean Ltd', 'REFERRAL', 'CHUA_GOI', 'Cần demo chi tiết hơn', 3, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đinh Công Thắng', 'BAC_LIEU', '0910000017', 'thangcongdinh17@email.com', 'Red Dragon Corp', 'EMAIL', 'COLD_LEAD', 'Đã kết nối với decision maker', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Tô Đình Uyên', 'CA_MAU', '0910000018', 'uyendinhtoa18@gmail.com', 'Golden Gate Inc', 'PHONE', 'KY_HOP_DONG', 'Yêu cầu reference từ khách hàng cũ', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Lưu Xuân Vinh', 'KIEN_GIANG', '0910000019', 'vinhxuanluu19@yahoo.com', 'Silver Star Co', 'FACEBOOK', 'TU_CHOI', 'Đang đánh giá với competitor', 3, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Mai Thanh Xuân', 'HAU_GIANG', '0910000020', 'xuanthanhmai20@hotmail.com', 'Diamond Tech', 'WEBSITE', 'CHUA_GOI', 'Hot lead - priority cao', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Nguyễn Thị Yến', 'VINH_LONG', '0910000021', 'yenthinguyen21@company.com', 'Platinum Solutions', 'GOOGLE', 'WARM_LEAD', 'Khách hàng quan tâm đến sản phẩm CRM', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Trần Minh Anh', 'KIEN_GIANG', '0910000022', 'anhminhtran22@email.com', 'Crystal Clear Co', 'REFERRAL', 'CHUA_LIEN_HE_DUOC', 'Đã gọi điện, khách quan tâm nhưng chưa quyết định', 3, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Lê Thu Bảo', 'BEN_TRE', '0910000023', 'baothuule23@gmail.com', 'Bright Future Ltd', 'EMAIL', 'CHUA_GOI', 'Lead chất lượng cao, đã demo sản phẩm', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Phạm Minh Chi', 'TAY_NINH', '0910000024', 'chiminhpham24@yahoo.com', 'New Vision Corp', 'PHONE', 'COLD_LEAD', 'Khách hàng cá nhân, đã gửi báo giá', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Hoàng Quốc Đạt', 'BINH_PHUOC', '0910000025', 'datquochoang25@hotmail.com', 'Global Connect', 'FACEBOOK', 'CHUA_GOI', 'Đang thảo luận điều khoản hợp đồng', 3, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Phan Hữu Hùng', 'DAK_LAK', '0910000026', 'hunghuphan26@company.com', 'Fast Track Co', 'WEBSITE', 'WARM_LEAD', 'Đã ký hợp đồng, khách hàng hài lòng', 1, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Vũ Công Kiệt', 'DAK_NONG', '0910000027', 'kietcongvu27@email.com', 'Dynamic Systems', 'GOOGLE', 'CHUA_LIEN_HE_DUOC', 'Khách không phù hợp với ngân sách', 2, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đặng Đình Linh', 'GIA_LAI', '0910000028', 'linhdinhang28@gmail.com', 'Progressive Tech', 'REFERRAL', 'CHUA_GOI', 'Lead mới từ triển lãm', 3, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Bùi Xuân Minh', 'KON_TUM', '0910000029', 'minhxuanbui29@yahoo.com', 'Advanced Solutions', 'EMAIL', 'COLD_LEAD', 'Cần tư vấn thêm về giá cả', 1, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đỗ Thanh Nhân', 'LAM_DONG', '0910000030', 'nhanthanhdo30@hotmail.com', 'Next Gen Co', 'PHONE', 'KY_HOP_DONG', 'Khách hàng tiềm năng cao', 2, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Hồ Văn Oanh', 'NINH_THUAN', '0910000031', 'oanhvanho31@company.com', 'Quality First Ltd', 'FACEBOOK', 'TU_CHOI', 'Đã gửi proposal, đang chờ phản hồi', 3, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Ngô Thị Phúc', 'BINH_THUAN', '0910000032', 'phucthingo32@email.com', 'Excellence Corp', 'WEBSITE', 'CHUA_GOI', 'Khách yêu cầu customization', 1, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Dương Minh Quân', 'QUANG_NAM', '0910000033', 'quanminhduong33@gmail.com', 'Innovation Hub', 'GOOGLE', 'WARM_LEAD', 'Đang scheduling meeting', 2, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Lý Thu Sơn', 'QUANG_NGAI', '0910000034', 'sonthuuly34@yahoo.com', 'Future Tech Co', 'REFERRAL', 'CHUA_LIEN_HE_DUOC', 'Follow up sau 1 tuần', 3, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Võ Quốc Thắng', 'BINH_DINH', '0910000035', 'thangquocvo35@hotmail.com', 'Success Systems', 'EMAIL', 'CHUA_GOI', 'Khách quan tâm package premium', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đào Hữu Uyên', 'PHU_YEN', '0910000036', 'uyenhuudao36@company.com', 'Growth Partners', 'PHONE', 'COLD_LEAD', 'Cần demo chi tiết hơn', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đinh Công Vinh', 'KHANH_HOA', '0910000037', 'vinhcongdinh37@email.com', 'Peak Performance', 'FACEBOOK', 'CHUA_GOI', 'Đã kết nối với decision maker', 3, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Tô Đình Xuân', 'NINH_THUAN', '0910000038', 'xuandinhtoa38@gmail.com', 'Elite Solutions', 'WEBSITE', 'WARM_LEAD', 'Yêu cầu reference từ khách hàng cũ', 1, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Lưu Xuân Yến', 'LAM_DONG', '0910000039', 'yenxuanluu39@yahoo.com', 'Premier Corp', 'GOOGLE', 'CHUA_LIEN_HE_DUOC', 'Đang đánh giá với competitor', 2, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Mai Thanh Anh', 'DONG_NAI', '0910000040', 'anhthanhmai40@hotmail.com', 'Superior Tech', 'REFERRAL', 'CHUA_GOI', 'Hot lead - priority cao', 3, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Nguyễn Thị Bảo', 'BINH_DUONG', '0910000041', 'baothinguyen41@company.com', 'Master Solutions', 'EMAIL', 'COLD_LEAD', 'Khách hàng quan tâm đến sản phẩm CRM', 1, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Trần Minh Chi', 'TAY_NINH', '0910000042', 'chiminhtran42@email.com', 'Champion Corp', 'PHONE', 'KY_HOP_DONG', 'Đã gọi điện, khách quan tâm nhưng chưa quyết định', 2, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Lê Thu Đạt', 'BINH_PHUOC', '0910000043', 'datthuule43@gmail.com', 'Victory Systems', 'FACEBOOK', 'TU_CHOI', 'Lead chất lượng cao, đã demo sản phẩm', 3, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Phạm Minh Hùng', 'LONG_AN', '0910000044', 'hungminhpham44@yahoo.com', 'Leading Edge Co', 'WEBSITE', 'CHUA_GOI', 'Khách hàng cá nhân, đã gửi báo giá', 1, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Hoàng Quốc Kiệt', 'TIEN_GIANG', '0910000045', 'kietquochoang45@hotmail.com', 'Top Tier Tech', 'GOOGLE', 'WARM_LEAD', 'Đang thảo luận điều khoản hợp đồng', 2, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Phan Hữu Linh', 'AN_GIANG', '0910000046', 'linhhuphan46@company.com', 'Prime Solutions', 'REFERRAL', 'CHUA_LIEN_HE_DUOC', 'Đã ký hợp đồng, khách hàng hài lòng', 3, NULL, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Vũ Công Minh', 'DONG_THAP', '0910000047', 'minhcongvu47@email.com', 'Ultimate Corp', 'EMAIL', 'CHUA_GOI', 'Khách không phù hợp với ngân sách', 1, 1, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đặng Đình Nhân', 'CAN_THO', '0910000048', 'nhandinhang48@gmail.com', 'Perfect Systems', 'PHONE', 'COLD_LEAD', 'Lead mới từ triển lãm', 2, 2, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Bùi Xuân Oanh', 'HAU_GIANG', '0910000049', 'oanhxuanbui49@yahoo.com', 'Optimal Tech', 'FACEBOOK', 'CHUA_GOI', 'Cần tư vấn thêm về giá cả', 3, 3, NOW(), NOW());

INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) 
VALUES ('Đỗ Thanh Phúc', 'SOC_TRANG', '0910000050', 'phucthanhdo50@hotmail.com', 'Supreme Solutions', 'WEBSITE', 'WARM_LEAD', 'Khách hàng tiềm năng cao', 1, NULL, NOW(), NOW());
