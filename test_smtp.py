import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# SMTP details
smtp_host = "smtp.gmail.com"
smtp_port = 587
sender_email = "vasujagan382@gmail.com"
app_password = "uckbrokhcdhigyuu"  # no spaces

print(f"Connecting to SMTP server {smtp_host}:{smtp_port}...")

try:
    # 1. Create message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = sender_email
    msg['Subject'] = "EcoSphere SMTP Connection Test"
    body = "Congratulations! Your SMTP connection and App Password are functioning perfectly."
    msg.attach(MIMEText(body, 'plain'))

    # 2. Connect to SMTP server
    server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
    server.starttls()  # Upgrade connection to secure TLS
    
    print("Logging into SMTP server...")
    server.login(sender_email, app_password)
    
    print("Sending test email...")
    server.sendmail(sender_email, sender_email, msg.as_string())
    
    server.quit()
    print("SUCCESS: Test email sent successfully to your inbox!")
except Exception as e:
    print(f"FAILED: SMTP connection failed with error:\n{e}")
