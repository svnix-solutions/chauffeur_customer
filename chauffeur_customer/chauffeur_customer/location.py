import frappe
from frappe import _

@frappe.whitelist()
def get_cities():
    """Get list of all available cities"""
    try:
        cities = frappe.get_all(
            "Serviceable City",
            fields=["name", "state", "country"],
            order_by="name"
        )
        return {
            "status": "success",
            "data": cities
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Get Cities Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def get_zones(city: str):
    """Get list of zones for a specific city"""
    try:
        zones = frappe.get_all(
            "Serviceable Zone",
            filters={"city": city},
            fields=["name", "description"],
            order_by="name"
        )
        return {
            "status": "success",
            "data": zones
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Get Zones Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def save_favorite_location(
    name: str,
    address: str,
    city: str,
    zone: str,
    latitude: float = None,
    longitude: float = None,
    is_home: bool = False,
    is_work: bool = False
):
    """Save a favorite location for the current user"""
    try:
        if not frappe.session.user:
            frappe.throw(_("Please login to save favorite locations"))

        # Check if location with same name exists
        existing = frappe.get_all(
            "Favorite Location",
            filters={
                "user": frappe.session.user,
                "name": name
            }
        )
        if existing:
            frappe.throw(_("A location with this name already exists"))

        # Create favorite location
        location = frappe.get_doc({
            "doctype": "Favorite Location",
            "user": frappe.session.user,
            "name": name,
            "address": address,
            "city": city,
            "zone": zone,
            "latitude": latitude,
            "longitude": longitude,
            "is_home": is_home,
            "is_work": is_work
        })
        location.insert()

        return {
            "status": "success",
            "message": "Location saved successfully",
            "location_id": location.name
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Save Favorite Location Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def get_favorite_locations():
    """Get list of favorite locations for the current user"""
    try:
        if not frappe.session.user:
            frappe.throw(_("Please login to view favorite locations"))

        locations = frappe.get_all(
            "Favorite Location",
            filters={"user": frappe.session.user},
            fields=[
                "name", "address", "city", "zone",
                "latitude", "longitude", "is_home", "is_work"
            ],
            order_by="is_home desc, is_work desc, name"
        )
        return {
            "status": "success",
            "data": locations
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Get Favorite Locations Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def delete_favorite_location(location_id: str):
    """Delete a favorite location"""
    try:
        if not frappe.session.user:
            frappe.throw(_("Please login to delete favorite locations"))

        location = frappe.get_doc("Favorite Location", location_id)
        
        # Check if user owns this location
        if location.user != frappe.session.user:
            frappe.throw(_("You don't have permission to delete this location"))

        location.delete()

        return {
            "status": "success",
            "message": "Location deleted successfully"
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Delete Favorite Location Error")
        return {
            "status": "error",
            "message": str(e)
        }