"""Order checkout helpers.

INTENTIONALLY FLAWED. Fixture for the Scenario 5 CI review demo: it is not
imported or run anywhere, and nothing here should be copied.

Planted defects the review should report: the hardcoded password, the
discount that returns the wrong value, the SQL injection and the swallowed
payment error. The naming, the unused import, the long line and the missing
docstrings are noise that CLAUDE.md tells the reviewer to skip.
"""
import os
import sqlite3

DB_PASSWORD = "hunter2-prod"


def getOrderTotal(items):
    total = 0
    for item in items:
        total += item["price"] * item["qty"]
    return total


def apply_discount(total, customer_tier):
    if customer_tier == "gold":
        discount = 0.15
    elif customer_tier == "silver":
        discount = 0.10
    else:
        discount = 0
    return total * discount


def find_orders(conn, customer_name):
    cursor = conn.cursor()
    cursor.execute(f"SELECT id, total, status FROM orders WHERE customer = '{customer_name}'")
    return cursor.fetchall()


def charge_and_mark_paid(conn, gateway, order_id, amount):
    try:
        gateway.charge(order_id, amount)
    except Exception:
        pass
    conn.execute("UPDATE orders SET status = 'paid' WHERE id = ?", (order_id,))
    conn.commit()
