# Email Configuration Guide

## Cấu hình gửi email thực tế cho hệ thống CRM

### 1. Gmail Setup (Khuyến nghị)

#### Bước 1: Tạo App Password cho Gmail
1. Đăng nhập Gmail → Quản lý tài khoản Google
2. Bảo mật → Xác minh 2 bước (phải bật)
3. Tìm "Mật khẩu ứng dụng" → Tạo mật khẩu mới
4. Chọn "Ứng dụng khác" → Nhập "CRM System"
5. Copy mật khẩu 16 ký tự được tạo

#### Bước 2: Cập nhật application.properties
```properties
# Thay thế trong file: backend/src/main/resources/application.properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-digit-app-password
```

### 2. Alternative Email Providers

#### Outlook/Hotmail
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
```

#### Yahoo Mail
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
```

### 3. Ví dụ cấu hình hoàn chỉnh

```properties
# Gmail Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=crm.system.demo@gmail.com
spring.mail.password=abcd efgh ijkl mnop
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

### 4. Test Email Configuration

Sau khi cấu hình xong:
1. Restart backend application
2. Thử chức năng "Forgot Password"
3. Kiểm tra email inbox và spam folder

### 5. Troubleshooting

#### Lỗi "Authentication failed"
- Kiểm tra username/password
- Đảm bảo đã bật 2-factor authentication cho Gmail
- Sử dụng App Password thay vì password thường

#### Lỗi "Mail server connection failed"
- Kiểm tra internet connection
- Verify SMTP host và port
- Kiểm tra firewall settings

#### Email không được gửi
- Kiểm tra console log để xem lỗi chi tiết
- Gmail có thể block nếu gửi quá nhiều email
- Thử với email provider khác

### 6. Production Recommendations

Cho môi trường production:
- Sử dụng SMTP relay service (SendGrid, AWS SES, MailGun)
- Thiết lập SPF, DKIM, DMARC records
- Sử dụng domain email chính thức
- Monitor email delivery rates

### 7. Security Notes

- Không commit email credentials vào Git
- Sử dụng environment variables trong production
- Thường xuyên rotate app passwords
- Monitor for unusual email activity
