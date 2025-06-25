import frappe
from frappe import _
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@frappe.whitelist(allow_guest=True)
def calculate_price(
    booking_type,
    pickup_location,
    drop_location,
    date,
    time,
    duration,
    vehicle_type,
    serviceable_city=None,
    serviceable_zone=None
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

    # Calculate distance using haversine formula
    pickup_lat = pickup_location.get("lat")
    pickup_lng = pickup_location.get("lng")
    drop_lat = drop_location.get("lat")
    drop_lng = drop_location.get("lng")
    if None not in (pickup_lat, pickup_lng, drop_lat, drop_lng):
        distance_km = haversine(pickup_lat, pickup_lng, drop_lat, drop_lng)
        if distance_km < 1:
            distance_km = 1
    else:
        distance_km = 0

    # 2. Fetch zone/city pricing
    base_price = 100
    price_per_km = 15
    price_per_hour = 50
    vehicle_multiplier = 1.0
    peak_hour_multiplier = 1.0

    # Try to get zone-specific pricing
    if serviceable_zone:
        try:
            zone_doc = frappe.get_doc("Serviceable Zone", serviceable_zone)
            base_price = zone_doc.base_price or base_price
            price_per_km = zone_doc.distance_multiplier or price_per_km
            price_per_hour = zone_doc.time_multiplier or price_per_hour
        except Exception:
            pass

    # Vehicle type multiplier
    if vehicle_type:
        vehicle_multiplier = {
            "sedan": 1.0,
            "suv": 1.2,
            "hatchback": 0.9,
            "premium": 1.5,
        }.get(vehicle_type, 1.0)

    # TODO: Add peak hour logic based on time

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
        "pricePerHour": round(price_per_hour, 2),
        "pricePerKm": round(price_per_km, 2),
        "duration": int(duration),
        "total": round(total, 2),
        "distanceKm": round(distance_km, 2)
    }

def get_supplier_for_zone(zone, city):
    """
    Get the supplier for a given zone or city.
    """
    try:
        # First try to find supplier by zone
        if zone:
            suppliers = frappe.get_all(
                "Supplier",
                filters={"custom_serviceable_zone": zone},
                fields=["name"],
                limit=1
            )
            if suppliers:
                return suppliers[0].name
        
        # If no supplier found by zone, try by city
        if city:
            suppliers = frappe.get_all(
                "Supplier",
                filters={"custom_serviceable_city": city},
                fields=["name"],
                limit=1
            )
            if suppliers:
                return suppliers[0].name
        
        return None
    except Exception:
        return None

def get_customer_for_user(user):
    """
    Get the Customer record where user field equals the given user.
    """
    try:
        customers = frappe.get_all(
            "Customer",
            filters={"custom_user": user},
            fields=["name"],
            limit=1
        )
        if customers:
            return customers[0].name
        return None
    except Exception:
        return None

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
        # Calculate price using the same logic as PricingStep
        price_breakdown = calculate_price(
            booking_type=booking_type,
            pickup_location=pickup_location,
            drop_location=drop_location,
            date=date,
            time=time,
            duration=duration,
            vehicle_type=vehicle_type,
            serviceable_city=city,
            serviceable_zone=zone
        )

        # Create the ride document
        ride = frappe.get_doc({
            "doctype": "Ride",
            "user": frappe.session.user,
            "customer": get_customer_for_user(frappe.session.user),
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
            "status": "Pending",
            "base_price": price_breakdown["basePrice"],
            "distance_price": price_breakdown["distancePrice"],
            "time_price": price_breakdown["timePrice"],
            "vehicle_multiplier": price_breakdown["vehicleMultiplier"],
            "peak_hour_multiplier": price_breakdown["peakHourMultiplier"],
            "total_amount": price_breakdown["total"]
        })
        ride.insert()

        # Return in the expected format, including price breakdown
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
                "zone": zone,
                "price_breakdown": price_breakdown
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
