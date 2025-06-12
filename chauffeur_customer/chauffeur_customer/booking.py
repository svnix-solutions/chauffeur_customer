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
    customer_email=None,
    city=None,
    zone=None
):
    """
    Create a new booking and return confirmation in the expected format.
    """
    import json

    # Parse locations if they are JSON strings
    if isinstance(pickup_location, str):
        pickup_location = frappe.parse_json(pickup_location)
    if isinstance(drop_location, str):
        drop_location = frappe.parse_json(drop_location)

    try:
        # Create the ride document
        ride = frappe.get_doc({
            "doctype": "Ride",
            "customer": frappe.session.user,
            "pickup_location": pickup_location.get("address", ""),
            "dropoff_location": drop_location.get("address", ""),
            "pickup_lat": pickup_location.get("lat"),
            "pickup_lng": pickup_location.get("lng"),
            "dropoff_lat": drop_location.get("lat"),
            "dropoff_lng": drop_location.get("lng"),
            "scheduled_time": f"{date} {time}",
            "booking_type": booking_type,
            "duration": duration,
            "vehicle_type": vehicle_type,
            "serviceable_city": city,
            "serviceable_zone": zone,
            "status": "Pending"
        })
        ride.insert()

        # Return in the expected format
        return {
            "booking_id": ride.name,
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
                "customer_email": customer_email,
                "city": city,
                "zone": zone
            }
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Booking Creation Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist(allow_guest=True)
def get_booking(booking_id):
    """
    Get booking details in the expected format.
    """
    try:
        ride = frappe.get_doc("Ride", booking_id)
        
        # Return in the expected format
        return {
            "booking_id": ride.name,
            "status": ride.status,
            "booking": {
                "booking_type": ride.booking_type,
                "pickup_location": {
                    "lat": ride.pickup_lat,
                    "lng": ride.pickup_lng,
                    "address": ride.pickup_location
                },
                "drop_location": {
                    "lat": ride.dropoff_lat,
                    "lng": ride.dropoff_lng,
                    "address": ride.dropoff_location
                },
                "date": ride.scheduled_time.split()[0],
                "time": ride.scheduled_time.split()[1],
                "duration": ride.duration,
                "vehicle_type": ride.vehicle_type,
                "customer_name": ride.customer_name,
                "customer_email": ride.customer_email,
                "serviceable_city": ride.serviceable_city,
                "serviceable_zone": ride.serviceable_zone
            }
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Get Booking Error")
        return {
            "status": "error",
            "message": str(e)
        }
