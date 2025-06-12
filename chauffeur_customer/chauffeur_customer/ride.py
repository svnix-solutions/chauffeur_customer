import frappe
from frappe import _
from frappe.utils import now_datetime
from frappe.model.document import Document

@frappe.whitelist()
def create_ride(
    pickup_location: str,
    dropoff_location: str,
    scheduled_time: str,
    city: str,
    zone: str,
    booking_type: str = "immediate",
    duration: int = None,
    vehicle_type: str = None
):
    """Create a new ride request"""
    try:
        # Validate user
        if not frappe.session.user:
            frappe.throw(_("Please login to create a ride"))

        # Create ride document
        ride = frappe.get_doc({
            "doctype": "Ride",
            "customer": frappe.session.user,
            "pickup_location": pickup_location,
            "dropoff_location": dropoff_location,
            "scheduled_time": scheduled_time,
            "city": city,
            "zone": zone,
            "booking_type": booking_type,
            "duration": duration,
            "vehicle_type": vehicle_type,
            "status": "Pending"
        })
        ride.insert()

        return {
            "status": "success",
            "message": "Ride created successfully",
            "ride_id": ride.name
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Ride Creation Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def get_ride_details(ride_id: str):
    """Get details of a specific ride"""
    try:
        if not frappe.session.user:
            frappe.throw(_("Please login to view ride details"))

        ride = frappe.get_doc("Ride", ride_id)
        
        # Check if user has permission to view this ride
        if ride.customer != frappe.session.user and not frappe.has_permission("Ride", "read"):
            frappe.throw(_("You don't have permission to view this ride"))

        return {
            "status": "success",
            "data": {
                "name": ride.name,
                "status": ride.status,
                "pickup_location": ride.pickup_location,
                "dropoff_location": ride.dropoff_location,
                "scheduled_time": ride.scheduled_time,
                "city": ride.city,
                "zone": ride.zone,
                "driver_name": ride.driver_name,
                "driver_phone": ride.driver_phone,
                "otp": ride.otp if ride.status == "Reached" else None,
                "creation": ride.creation,
                "modified": ride.modified
            }
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Ride Details Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def get_ride_history(
    status: str = None,
    from_date: str = None,
    to_date: str = None,
    limit: int = 20
):
    """Get ride history for the current user"""
    try:
        if not frappe.session.user:
            frappe.throw(_("Please login to view ride history"))

        filters = [
            ["customer", "=", frappe.session.user]
        ]

        if status:
            filters.append(["status", "=", status])
        if from_date:
            filters.append(["creation", ">=", from_date])
        if to_date:
            filters.append(["creation", "<=", to_date])

        rides = frappe.get_all(
            "Ride",
            filters=filters,
            fields=[
                "name", "status", "pickup_location", "dropoff_location",
                "scheduled_time", "driver_name", "creation", "city", "zone"
            ],
            order_by="creation desc",
            limit=limit
        )

        return {
            "status": "success",
            "data": rides
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Ride History Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def download_invoice(ride_id: str):
    """Generate and return invoice download URL for a completed ride"""
    try:
        if not frappe.session.user:
            frappe.throw(_("Please login to download invoice"))

        ride = frappe.get_doc("Ride", ride_id)
        
        # Check if user has permission to download this invoice
        if ride.customer != frappe.session.user and not frappe.has_permission("Ride", "read"):
            frappe.throw(_("You don't have permission to download this invoice"))

        # Check if ride is completed
        if ride.status != "Completed":
            frappe.throw(_("Invoice is only available for completed rides"))

        # Generate invoice
        invoice = frappe.get_doc({
            "doctype": "Sales Invoice",
            "customer": ride.customer,
            "posting_date": now_datetime().date(),
            "due_date": now_datetime().date(),
            "items": [{
                "item_code": "RIDE",
                "qty": 1,
                "rate": ride.total_amount,
                "amount": ride.total_amount
            }]
        })
        invoice.insert()
        invoice.submit()

        # Generate PDF
        pdf = frappe.get_print("Sales Invoice", invoice.name, as_pdf=True)
        
        # Save PDF to public files
        file_name = f"invoice_{ride.name}.pdf"
        file = frappe.get_doc({
            "doctype": "File",
            "file_name": file_name,
            "content": pdf,
            "is_private": 0
        })
        file.insert()

        return {
            "status": "success",
            "file_url": file.file_url
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Invoice Download Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def update_ride_status(ride_id: str, status: str):
    """Update ride status (for internal use)"""
    try:
        if not frappe.has_permission("Ride", "write"):
            frappe.throw(_("You don't have permission to update ride status"))

        ride = frappe.get_doc("Ride", ride_id)
        ride.status = status
        ride.save()

        return {
            "status": "success",
            "message": "Ride status updated successfully"
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Ride Status Update Error")
        return {
            "status": "error",
            "message": str(e)
        } 