import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { escapeHtml } from 'src/common/utils/html.util';

@Injectable()
export class AuthMailService {
  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const resetUrl = this.buildPasswordResetUrl(email, token);

    const smtpHost = this.configService.get<string>('MAIL_HOST');
    const smtpPort = Number(this.configService.get<string>('MAIL_PORT', '587'));
    const smtpUser = this.configService.get<string>('MAIL_USER');
    const smtpPass = this.configService.get<string>('MAIL_PASS');
    const mailFrom = this.configService.get<string>(
      'MAIL_FROM',
      'no-reply@ecommerce.test',
    );

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new BadRequestException(
        'Chưa cấu hình SMTP để gửi email đặt lại mật khẩu',
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: mailFrom,
      to: email,
      subject: 'Đặt lại mật khẩu tài khoản Ecom Market',
      html: this.buildPasswordResetEmailHtml(name, resetUrl),
    });
  }

  private buildPasswordResetUrl(email: string, token: string): string {
    const appUrl = this.configService.get<string>(
      'APP_URL',
      'http://localhost:3001',
    );

    const resetUrl = new URL('/reset-password', appUrl);

    resetUrl.searchParams.set('email', email);
    resetUrl.searchParams.set('token', token);

    return resetUrl.toString();
  }

  private buildPasswordResetEmailHtml(name: string, resetUrl: string): string {
    const safeName = escapeHtml(name || 'khách hàng');
    const safeResetUrl = escapeHtml(resetUrl);

    return `
    <div style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f1f5f9;margin:0;padding:0;">
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border-collapse:collapse;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 18px 45px rgba(15,23,42,0.08);">
              
              <tr>
                <td style="padding:28px 32px;background:linear-gradient(135deg,#007a7a,#004949);">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                    <tr>
                      <td>
                        <div style="display:inline-block;width:44px;height:44px;line-height:44px;text-align:center;border-radius:14px;background:rgba(255,255,255,0.16);color:#ffffff;font-size:20px;font-weight:700;">
                          EM
                        </div>
                      </td>
                      <td align="right" style="font-size:13px;color:#ccfbf1;font-weight:600;">
                        Ecom Market
                      </td>
                    </tr>
                  </table>

                  <h1 style="margin:24px 0 8px;font-size:26px;line-height:1.25;color:#ffffff;font-weight:800;">
                    Đặt lại mật khẩu
                  </h1>

                  <p style="margin:0;font-size:14px;line-height:1.7;color:#d1faf5;">
                    Chúng tôi đã nhận được yêu cầu khôi phục quyền truy cập tài khoản của bạn.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:30px 32px 8px;">
                  <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#334155;">
                    Xin chào <strong style="color:#0f172a;">${safeName}</strong>,
                  </p>

                  <p style="margin:0 0 22px;font-size:15px;line-height:1.8;color:#334155;">
                    Vui lòng bấm vào nút bên dưới để tạo mật khẩu mới cho tài khoản của bạn.
                    Liên kết này chỉ có hiệu lực trong thời gian giới hạn.
                  </p>

                  <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 24px;">
                    <tr>
                      <td align="center" style="border-radius:12px;background:#007a7a;">
                        <a
                          href="${safeResetUrl}"
                          target="_blank"
                          style="display:inline-block;padding:13px 22px;border-radius:12px;background:#007a7a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;"
                        >
                          Đặt lại mật khẩu
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="margin:0 0 22px;padding:14px 16px;border-radius:14px;background:#fef3c7;border:1px solid #fde68a;">
                    <p style="margin:0;font-size:13px;line-height:1.7;color:#92400e;">
                      <strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau <strong>30 phút</strong>.
                      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                    </p>
                  </div>

                  <p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#64748b;">
                    Nếu nút không hoạt động, hãy sao chép liên kết sau và dán vào trình duyệt:
                  </p>

                  <div style="margin:0 0 22px;padding:12px 14px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;word-break:break-all;">
                    <a href="${safeResetUrl}" target="_blank" style="font-size:12px;line-height:1.7;color:#007a7a;text-decoration:none;">
                      ${safeResetUrl}
                    </a>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 32px 28px;border-top:1px solid #e2e8f0;background:#f8fafc;">
                  <p style="margin:0 0 6px;font-size:13px;line-height:1.7;color:#64748b;">
                    Email này được gửi tự động từ hệ thống Ecom Market.
                  </p>

                  <p style="margin:0;font-size:12px;line-height:1.7;color:#94a3b8;">
                    Vui lòng không trả lời email này. Nếu cần hỗ trợ, hãy liên hệ bộ phận chăm sóc khách hàng.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
  }
}
