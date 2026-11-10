import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "GSSSIETW GATE ECE Portal")
PORTAL_URL = os.getenv("PORTAL_URL", "http://localhost:5173")

def is_smtp_configured() -> bool:
    return bool(SMTP_USER and SMTP_PASSWORD and SMTP_PASSWORD.strip())

def send_email(to_email: str, subject: str, html_body: str, text_body: str) -> bool:
    """
    Sends an email using configured SMTP credentials.
    If SMTP credentials are not set, logs the email content to stdout for testing.
    """
    if not is_smtp_configured():
        print(f"\n==================== [SIMULATED EMAIL DISPATCH] ====================")
        print(f"TO: {to_email}")
        print(f"FROM: {SMTP_FROM_NAME} <{SMTP_USER or 'gsss.gate.ece@gmail.com'}>")
        print(f"SUBJECT: {subject}")
        print(f"BODY:\n{text_body}")
        print(f"====================================================================\n")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_USER}>"
        msg["To"] = to_email

        part1 = MIMEText(text_body, "plain", "utf-8")
        part2 = MIMEText(html_body, "html", "utf-8")
        msg.attach(part1)
        msg.attach(part2)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, [to_email], msg.as_string())
        
        logger.info(f"Email successfully delivered to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        print(f"[EMAIL ERROR] Could not deliver to {to_email}: {e}")
        return False

def send_password_reset_otp(to_email: str, full_name: str, otp_code: str) -> bool:
    subject = f"Your Password Reset Code: {otp_code} — GSSSIETW GATE ECE"
    
    text_body = f"""Hello {full_name},

You requested to reset your password for the GSSSIETW GATE ECE Learning & Assessment Portal.

Your verification code is: {otp_code}

This code will expire in 15 minutes. If you did not request this password reset, please ignore this email.

Department of Electronics & Communication Engineering
GSSS Institute of Engineering and Technology for Women, Mysuru
{PORTAL_URL}
"""

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf5f5; margin: 0; padding: 20px; }}
        .card {{ max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #f2d6dc; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
        .header {{ background: #701a2b; color: #ffffff; padding: 24px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px; }}
        .header p {{ margin: 4px 0 0; font-size: 11px; color: #f9d5dc; }}
        .content {{ padding: 28px 24px; color: #2c2523; }}
        .otp-box {{ background: #fff5f6; border: 2px dashed #701a2b; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }}
        .otp-code {{ font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #701a2b; }}
        .footer {{ background: #fafafa; border-top: 1px solid #f0f0f0; padding: 16px 24px; font-size: 11px; color: #78716c; text-align: center; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>GSSSIETW MYSURU</h1>
          <p>Department of Electronics &amp; Communication Engineering &bull; GATE Portal</p>
        </div>
        <div class="content">
          <p style="font-size: 14px; margin-top: 0;">Hello <strong>{full_name}</strong>,</p>
          <p style="font-size: 13px; line-height: 1.5; color: #57534e;">
            You requested to reset your password for the GATE ECE Portal. Use the 6-digit verification code below to proceed:
          </p>
          <div class="otp-box">
            <div style="font-size: 11px; color: #8e2137; font-weight: bold; margin-bottom: 4px; text-transform: uppercase;">Password Reset Code</div>
            <div class="otp-code">{otp_code}</div>
            <div style="font-size: 11px; color: #78716c; margin-top: 6px;">Valid for the next 15 minutes</div>
          </div>
          <p style="font-size: 12px; color: #78716c; line-height: 1.5;">
            If you did not make this request, you can safely disregard this email. Your current password remains unchanged.
          </p>
        </div>
        <div class="footer">
          GSSS Institute of Engineering &amp; Technology for Women, Mysuru<br>
          <a href="{PORTAL_URL}" style="color: #701a2b; text-decoration: none; font-weight: 600;">Open GATE ECE Portal</a>
        </div>
      </div>
    </body>
    </html>
    """
    
    return send_email(to_email, subject, html_body, text_body)

def send_welcome_credentials(
    to_email: str,
    full_name: str,
    role: str,
    identifier: str,
    default_password: str,
    portal_url: Optional[str] = None
) -> bool:
    url = portal_url or PORTAL_URL
    subject = f"Your Login Credentials — GSSSIETW GATE ECE Portal"
    
    id_label = "University Seat Number (USN)" if role.lower() == "student" else "Registered Contact / Phone"

    text_body = f"""Welcome to GSSSIETW GATE ECE Learning & Assessment Platform!

Hello {full_name},

Your account has been officially created on the GSSSIETW GATE ECE Portal.
Here are your initial login credentials:

- Role: {role.title()}
- {id_label}: {identifier}
- Registered Email: {to_email}
- Default Password: {default_password}

Login URL: {url}/login

You can log in anytime using your credentials. After logging in, you can update your password using the "Forgot Password" option on the login page or through your profile.

Best wishes for your GATE preparation!
Department of Electronics & Communication Engineering
GSSS Institute of Engineering and Technology for Women, Mysuru
"""

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf5f5; margin: 0; padding: 20px; }}
        .card {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #f2d6dc; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
        .header {{ background: #701a2b; color: #ffffff; padding: 24px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px; }}
        .header p {{ margin: 4px 0 0; font-size: 11px; color: #f9d5dc; }}
        .content {{ padding: 28px 24px; color: #2c2523; }}
        .cred-box {{ background: #fff9f9; border: 1px solid #f3d8dd; border-radius: 12px; padding: 18px; margin: 18px 0; }}
        .cred-row {{ display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #fbeeee; }}
        .cred-row:last-child {{ border-bottom: none; }}
        .cred-label {{ color: #78716c; font-weight: 500; }}
        .cred-val {{ font-weight: 700; color: #1c1917; }}
        .pass-highlight {{ color: #701a2b; font-family: monospace; font-size: 15px; background: #fee8eb; padding: 2px 8px; rounded: 4px; }}
        .cta-btn {{ display: block; text-align: center; background: #701a2b; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 13px; margin: 20px 0; }}
        .footer {{ background: #fafafa; border-top: 1px solid #f0f0f0; padding: 16px 24px; font-size: 11px; color: #78716c; text-align: center; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>GSSSIETW MYSURU</h1>
          <p>Department of Electronics &amp; Communication Engineering &bull; GATE Portal</p>
        </div>
        <div class="content">
          <p style="font-size: 15px; margin-top: 0;">Welcome, <strong>{full_name}</strong>!</p>
          <p style="font-size: 13px; line-height: 1.5; color: #57534e;">
            Your account has been officially registered on the <strong>GSSSIETW GATE ECE Preparation &amp; Assessment Platform</strong>. Please find your login credentials below:
          </p>
          
          <div class="cred-box">
            <div class="cred-row">
              <span class="cred-label">Account Role:</span>
              <span class="cred-val">{role.title()}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">{id_label}:</span>
              <span class="cred-val">{identifier}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Registered Email:</span>
              <span class="cred-val">{to_email}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Default Password:</span>
              <span class="pass-highlight">{default_password}</span>
            </div>
          </div>

          <a href="{url}/login" class="cta-btn">Log In to GATE ECE Portal &rarr;</a>

          <p style="font-size: 12px; color: #78716c; line-height: 1.5;">
            <strong>Important Tip:</strong> You can change your password anytime after logging in, or by clicking "Forgot Password?" on the login screen.
          </p>
        </div>
        <div class="footer">
          GSSS Institute of Engineering &amp; Technology for Women, Mysuru<br>
          KRS Road, Metagalli, Mysuru - 570016
        </div>
      </div>
    </body>
    </html>
    """

    return send_email(to_email, subject, html_body, text_body)
