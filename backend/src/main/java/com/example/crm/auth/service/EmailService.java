package com.example.crm.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final String FROM_NAME = "CRM System";

    public void sendVerificationCode(String email, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, FROM_NAME);
            helper.setTo(email);
            helper.setSubject("🔐 Mã xác thực đặt lại mật khẩu - CRM System");
            
            String htmlContent = buildVerificationCodeEmail(code);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            
            System.out.println("=== VERIFICATION CODE EMAIL SENT ===");
            System.out.println("To: " + email);
            System.out.println("Code: " + code);
            System.out.println("===================================");
            
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
            
            // Fallback to console logging
            System.out.println("=== VERIFICATION CODE EMAIL (FALLBACK) ===");
            System.out.println("To: " + email);
            System.out.println("Subject: Verification Code for Password Reset");
            System.out.println("Your verification code is: " + code);
            System.out.println("This code will expire in 10 minutes.");
            System.out.println("Please do not share this code with anyone.");
            System.out.println("=========================================");
        }
    }

    private String buildVerificationCodeEmail(String code) {
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mã xác thực</title>
                <style>
                    body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px 20px; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 40px 30px; text-align: center; }
                    .code-box { background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 10px; padding: 30px; margin: 30px 0; }
                    .code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; }
                    .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; color: #856404; }
                    .footer { background-color: #f8f9fa; text-align: center; padding: 20px; color: #6c757d; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Mã Xác Thực</h1>
                        <p>Đặt lại mật khẩu tài khoản CRM</p>
                    </div>
                    <div class="content">
                        <h2>Chào bạn!</h2>
                        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Sử dụng mã xác thực bên dưới để tiếp tục:</p>
                        
                        <div class="code-box">
                            <div class="code">%s</div>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ Lưu ý quan trọng:</strong><br>
                            • Mã này sẽ hết hạn sau <strong>10 phút</strong><br>
                            • Không chia sẻ mã này với bất kỳ ai<br>
                            • Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này
                        </div>
                        
                        <p>Nếu bạn gặp khó khăn, vui lòng liên hệ bộ phận hỗ trợ.</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 CRM System. All rights reserved.</p>
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(code);
    }

    public void sendPasswordResetEmail(String email, String resetToken) {
        // In a real application, you would send an actual email here
        // For now, we'll just log the reset link
        String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
        
        System.out.println("=== PASSWORD RESET EMAIL ===");
        System.out.println("To: " + email);
        System.out.println("Subject: Password Reset Request");
        System.out.println("Reset URL: " + resetUrl);
        System.out.println("Token: " + resetToken);
        System.out.println("This link will expire in 24 hours.");
        System.out.println("============================");
        
        // TODO: Implement actual email sending using JavaMailSender
        // Example:
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setTo(email);
        // message.setSubject("Password Reset Request");
        // message.setText("Click the following link to reset your password: " + resetUrl);
        // mailSender.send(message);
    }

    public void sendPasswordChangeConfirmation(String email) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, FROM_NAME);
            helper.setTo(email);
            helper.setSubject("✅ Mật khẩu đã được thay đổi thành công - CRM System");
            
            String htmlContent = buildPasswordChangeConfirmationEmail();
            helper.setText(htmlContent, true);

            mailSender.send(message);
            
            System.out.println("=== PASSWORD CHANGE CONFIRMATION SENT ===");
            System.out.println("To: " + email);
            System.out.println("========================================");
            
        } catch (Exception e) {
            System.err.println("Failed to send password change confirmation: " + e.getMessage());
            
            // Fallback to console logging
            System.out.println("=== PASSWORD CHANGED CONFIRMATION (FALLBACK) ===");
            System.out.println("To: " + email);
            System.out.println("Subject: Password Changed Successfully");
            System.out.println("Your password has been changed successfully.");
            System.out.println("===============================================");
        }
    }

    private String buildPasswordChangeConfirmationEmail() {
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mật khẩu đã được thay đổi</title>
                <style>
                    body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; text-align: center; padding: 30px 20px; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 40px 30px; text-align: center; }
                    .success-icon { font-size: 48px; margin: 20px 0; }
                    .info-box { background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 5px; padding: 15px; margin: 20px 0; color: #0c5460; }
                    .footer { background-color: #f8f9fa; text-align: center; padding: 20px; color: #6c757d; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Thành Công!</h1>
                        <p>Mật khẩu đã được thay đổi</p>
                    </div>
                    <div class="content">
                        <div class="success-icon">🎉</div>
                        <h2>Mật khẩu của bạn đã được thay đổi thành công!</h2>
                        <p>Bạn có thể sử dụng mật khẩu mới để đăng nhập vào hệ thống CRM.</p>
                        
                        <div class="info-box">
                            <strong>💡 Mẹo bảo mật:</strong><br>
                            • Không chia sẻ mật khẩu với ai khác<br>
                            • Sử dụng mật khẩu mạnh và duy nhất<br>
                            • Thay đổi mật khẩu định kỳ để đảm bảo an toàn<br>
                            • Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với bộ phận hỗ trợ
                        </div>
                        
                        <p>Cảm ơn bạn đã sử dụng hệ thống CRM của chúng tôi!</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 CRM System. All rights reserved.</p>
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                </div>
            </body>
            </html>
            """;
    }
}
