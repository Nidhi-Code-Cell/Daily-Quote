from flask import Flask, jsonify,request
# from flask_cors import CORS , cross_origin
import json
import psycopg2
import requests
import urllib3
from datetime import date, datetime, time
import os
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from pywebpush import webpush, WebPushException

load_dotenv()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_EMAIL = "mailto:you@example.com"


app = Flask(__name__)

@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:5500"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        return response

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:5500"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


def get_db_connection():
    return psycopg2.connect(
        dbname="quote",
        user="postgres",
        password="Nidhi@420",
        host="localhost",
        port="5432"
    )

def get_or_create_today_quote():
    today = date.today()
    conn = get_db_connection()
    cur = conn.cursor()
    print(f"Checking for quote for date: {today}")

    # 1) Check DB
    cur.execute(
        "SELECT content, author FROM daily_quotes WHERE quote_date = %s",
        (today,)
    )
    row = cur.fetchone()

    if row:
        print(f"Found existing quote in database: '{row[0]}' - {row[1]}")
        cur.close()
        conn.close()
        return {"content": row[0], "author": row[1]}

    print("No quote found for today, fetching from API...")

    # 2) Fetch from API
    try:
        response = requests.get("https://api.quotable.io/random", verify=False)
        data = response.json()
        content = data.get("content")
        author = data.get("author")
        quote_id = data.get("_id")
        
        print(f"Fetched quote: '{content}' - {author}")
    except Exception as e:
        print(f"Error fetching quote from API: {e}")
        raise e

    # 3) Insert
    cur.execute(
        """
        INSERT INTO daily_quotes (quote_id, content, author, quote_date)
        VALUES (%s, %s, %s, %s)
        """,
        (quote_id, content, author, today)
    )
    conn.commit()

    cur.close()
    conn.close()

    return {"content": content, "author": author}

@app.route("/api/today-quote", methods=["GET"])
def today_quote():
    quote = get_or_create_today_quote()
    return jsonify(quote)



@app.route("/api/subscribe", methods=["POST"])
def subscribe():
    print("Subscribe endpoint called")
    try:
        data = request.get_json(silent=True)
        print(f"Received data: {data}")
        
        if not data or "subscription" not in data:
            print("Invalid payload")
            return jsonify({"error": "Invalid payload"}), 400

        subscription = data["subscription"]
        print(f"Subscription: {subscription}")

        conn = get_db_connection()
        cur = conn.cursor()

        # Check if subscription already exists
        try:
            cur.execute(
                "SELECT id FROM push_subscriptions WHERE (subscription->>'endpoint') = %s",
                (subscription['endpoint'],)
            )
            existing = cur.fetchone()
        except Exception as db_error:
            print(f"Database query error: {db_error}")
            raise db_error
        
        if not existing:
            print("Inserting new subscription")
            cur.execute(
                """
                INSERT INTO push_subscriptions (subscription, is_active)
                VALUES (%s, TRUE)
                """,
                (json.dumps(subscription),)
            )
        else:
            print("Subscription already exists")

        conn.commit()
        cur.close()
        conn.close()

        print("Subscription saved successfully")
        return jsonify({"message": "Subscription saved"})
        
    except Exception as e:
        print(f"Error in subscribe: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/notification-time", methods=["POST"])
def save_notification_time():
    data = request.get_json(silent=True)
    if not data or "endpoint" not in data or "notify_time" not in data:
        return jsonify({"error": "Invalid payload"}), 400

    endpoint = data["endpoint"]
    notify_time = data["notify_time"]

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "UPDATE push_subscriptions SET notify_time = %s WHERE (subscription->>'endpoint') = %s",
            (notify_time, endpoint)
        )
        conn.commit()
        print(f"Updated notification time to {notify_time} for endpoint {endpoint}")
    except Exception as e:
        print(f"Error updating notification time: {e}")
        return jsonify({"error": "Failed to update notification time"}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({"message": "Notification time saved successfully"})

def send_daily_notifications():
    """Send daily quote notifications to all active subscribers"""
    print("Running daily notification check...")
    
    current_time = datetime.now().strftime("%H:%M")
    today = date.today()
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Get today's quote
        quote = get_or_create_today_quote()
        
        # Find subscribers whose notification time matches current time
        cur.execute(
            """
            SELECT subscription FROM push_subscriptions 
            WHERE is_active = TRUE AND notify_time = %s
            """,
            (current_time,)
        )
        subscribers = cur.fetchall()
        
        print(f"Found {len(subscribers)} subscribers for time {current_time}")
        
        # Send notifications
        for (subscription_data,) in subscribers:
            try:
                message = {
                    "title": "Daily Quote",
                    "body": f"\"{quote['content']}\" - {quote['author']}"
                }
                
                webpush(
                    subscription_info=subscription_data,  # Use the JSON string directly from DB
                    data=json.dumps(message),
                    vapid_private_key=VAPID_PRIVATE_KEY,
                    vapid_claims={"sub": "mailto:you@example.com"}
                )
                print(f"Notification sent successfully")
                
            except WebPushException as e:
                print(f"Failed to send notification: {e}")
            except Exception as e:
                print(f"Error sending to subscriber: {e}")
                
    except Exception as e:
        print(f"Error in notification scheduler: {e}")
    finally:
        cur.close()
        conn.close()

# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(
    func=send_daily_notifications,
    trigger="interval",
    minutes=1,  # Check every minute
    id='daily_notifications'
)
scheduler.start()

if __name__ == "__main__":
    app.run(port=5000,debug=True)
    # CORS(app)   
