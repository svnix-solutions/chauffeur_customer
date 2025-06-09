import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def calculate_price(
    booking_type,
    pickup_location,
    drop_location,
    date,
    time,
    duration,
    vehicle_type
):
    """
    Calculate the price for a booking based on input parameters.
    """
    import json

    # Parse locations if they are JSON strings
    if isinstance(pickup_location, str):
        pickup_location = frappe.parse_json(pickup_location)
    if isinstance(drop_location, str):
        drop_location = frappe.parse_json(drop_location)

    # Example: Calculate distance (replace with Google Maps API if needed)
    # For now, let's use a dummy distance
    distance_km = 10

    # Pricing logic
    base_price = 100  # base fare
    price_per_km = 15
    price_per_hour = 50
    vehicle_multiplier = {
        "sedan": 1.0,
        "suv": 1.2,
        "hatchback": 0.9,
        "premium": 1.5,
    }.get(vehicle_type, 1.0)
    peak_hour_multiplier = 1.0  # You can add logic for peak hours

    # Calculate price
    distance_price = distance_km * price_per_km
    time_price = int(duration) * price_per_hour
    subtotal = base_price + distance_price + time_price
    total = subtotal * vehicle_multiplier * peak_hour_multiplier

    return {
        "basePrice": base_price,
        "distancePrice": distance_price,
        "timePrice": time_price,
        "vehicleMultiplier": vehicle_multiplier,
        "peakHourMultiplier": peak_hour_multiplier,
        "total": round(total, 2),
    }

@frappe.whitelist(allow_guest=False)
def create_booking(
    booking_type,
    pickup_location,
    drop_location,
    date,
    time,
    duration,
    vehicle_type,
    customer_name=None,
    customer_email=None
):
    """
    Dummy API to create a booking. Returns a mock booking confirmation.
    """
    import random
    import string
    import json

    # Parse locations if they are JSON strings
    if isinstance(pickup_location, str):
        pickup_location = frappe.parse_json(pickup_location)
    if isinstance(drop_location, str):
        drop_location = frappe.parse_json(drop_location)

    # Generate a random booking ID
    booking_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

    # Return a mock confirmation
    return {
        "booking_id": booking_id,
        "status": "confirmed",
        "booking": {
            "booking_type": booking_type,
            "pickup_location": pickup_location,
            "drop_location": drop_location,
            "date": date,
            "time": time,
            "duration": duration,
            "vehicle_type": vehicle_type,
            "customer_name": customer_name,
            "customer_email": customer_email
        }
    }

@frappe.whitelist(allow_guest=True)
def get_booking(booking_id):
    """
    Dummy API to retrieve a booking by booking_id. Returns a mock booking object.
    """
    # Mock booking data
    booking = {
        "booking_id": booking_id,
        "status": "confirmed",
        "booking": {
            "booking_type": "standard",
            "pickup_location": {"lat": 12.9716, "lng": 77.5946, "address": "Yashwantpur, Bangalore"},
            "drop_location": {"lat": 13.0827, "lng": 80.2707, "address": "123, Clock Tower, Chennai"},
            "date": "2023-10-01",
            "time": "10:00 AM",
            "duration": 2,
            "vehicle_type": "sedan",
            "customer_name": "John Doe",
            "customer_email": "john.doe@example.com"
        }
    }
    return booking
