import locale
from datetime import datetime
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(recipient, subject, html_content):
    sender_email = os.getenv("SMTP_MAIL")
    sender_password = os.getenv("SMTP_PASSWORD")

    message = MIMEMultipart("alternative")
    message["From"] = sender_email
    message["To"] = recipient
    message["Subject"] = subject

    html_part = MIMEText(html_content, "html")
    message.attach(html_part)

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls() 
            server.login(sender_email, sender_password)
            server.send_message(message)
    except Exception as e:
        print(f"Failed to send email: {e}")
        
def generate_food_email(name, description, price, quantity_available, available_date):
    html_template = """
    <html>
    <head>
        <style>
            .email-container {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: auto;
                border: 1px solid #ddd;
                padding: 20px;
                background-color: #f9f9f9;
            }}
            .header {{
                text-align: center;
                background-color: #4CAF50;
                color: white;
                padding: 10px 0;
            }}
            .food-details {{
                margin-top: 20px;
            }}
            .food-details h3 {{
                margin: 0;
                color: #4CAF50;
            }}
            .food-details p {{
                margin: 5px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #aaa;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>New Food Item Available!</h1>
            </div>
            <div class="food-details">
                <h3>{name}</h3>
                <p>{description}</p>
                <p><strong>Price:</strong> ${price}</p>
                <p><strong>Quantity Available:</strong> {quantity_available}</p>
                <p><strong>Available Date:</strong> {available_date}</p>
            </div>
            <div class="footer">
                <p>Thank you for using our service!</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_template.format(
        name=name,
        description=description,
        price=price,
        quantity_available=quantity_available,
        available_date=available_date
    )

def send_food_email(name, description, price, quantity_available, available_date):
    time = datetime.fromtimestamp(available_date / 1000)  
    
    locale.setlocale(locale.LC_TIME, '')  
    current_locale = locale.getlocale(locale.LC_TIME)[0]  
    
    # Choose date format based on the user's locale
    if 'United States' in current_locale or 'Canada' in current_locale:
        date_format = "%m/%d/%Y, %H:%M"  
    else:
        date_format = "%d/%m/%Y, %H:%M" 
    
    formatted_time = time.strftime(date_format)
    html_content = generate_food_email(name, description, price, quantity_available, formatted_time)
    
    from app.models import User
    users = User.query.filter_by(is_approved=True).all()
    
    for user in users:
        send_email(user.email, f"{name} has just been posted!", html_content)

def generate_user_email(email, message):
    html_template = """
    <html>
    <head>
        <style>
            .email-container {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: auto;
                border: 1px solid #ddd;
                padding: 20px;
                background-color: #f9f9f9;
            }}
            .header {{
                text-align: center;
                background-color: #4CAF50;
                color: white;
                padding: 10px 0;
            }}
            .email-details {{
                margin-top: 20px;
            }}
            .email-details h3 {{
                margin: 0;
                color: #4CAF50;
            }}
            .email-details p {{
                margin: 5px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #aaa;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Eathai</h1>
            </div>
            <div class="email-details">
                <p>{message}</p>
            </div>
            <div class="footer">
                <p>Thank you for using our service!</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_template.format(email=email, message=message)

def send_user_email(email, message, subject="Welcome to Eathai!"):
    html_content = generate_user_email(email, message)
    send_email(email, subject, html_content)
    
def generate_registration_template(email, code, url):
    html_template = """
    <html>
    <head>
        <style>
            .email-container {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: auto;
                border: 1px solid #ddd;
                padding: 20px;
                background-color: #f9f9f9;
            }}
            .header {{
                text-align: center;
                background-color: #4CAF50;
                color: white;
                padding: 10px 0;
            }}
            .email-details {{
                margin-top: 20px;
            }}
            .email-details h3 {{
                margin: 0;
                color: #4CAF50;
            }}
            .email-details p {{
                margin: 5px 0;
            }}
            .verify-link {{
                display: block;
                margin: 20px 0;
                text-align: center;
            }}
            .verify-link a {{
                text-decoration: none;
                color: white;
                background-color: #4CAF50;
                padding: 10px 20px;
                border-radius: 5px;
            }}
            .verify-link a:hover {{
                background-color: #45a049;
            }}
            .footer {{
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #aaa;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Verify Your Account</h1>
            </div>
            <div class="email-details">
                <p>Thank you for registering with us!</p>
                <p>Please verify your email address by clicking the link below:</p>
            </div>
            <div class="verify-link">
                <a href="{url}/verify/{code}/{email}" target="_blank">Verify Your Email</a>
            </div>
            <div class="footer">
                <p>If you did not register for this account, you can safely ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_template.format(code=code, url=url, email=email)


def send_registration_email(email, code, url):
    import urllib.parse
    send_email(email, "Welcome to Eathai! Please verify your email address.", generate_registration_template(urllib.parse.quote(email), urllib.parse.quote(code), url))