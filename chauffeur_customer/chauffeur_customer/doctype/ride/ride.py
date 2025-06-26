# Copyright (c) 2024, Your Company and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Ride(Document):
    def validate(self):
        """Validate the ride document"""
        self.validate_received_amount()
    
    def validate_received_amount(self):
        """Validate received amount if provided"""
        if self.received_amount and self.total_amount:
            if self.received_amount < 0:
                frappe.throw("Received amount cannot be negative")
            
            # Optionally, you can add validation to ensure received amount is not less than total amount
            # if self.received_amount < self.total_amount:
            #     frappe.throw("Received amount cannot be less than total amount")
    
    def on_update(self):
        """Called after the document is updated"""
        if self.received_amount and self.status == "Completed":
            # Update payment status based on received amount
            if self.received_amount >= self.total_amount:
                self.payment_status = "Paid"
            else:
                self.payment_status = "Pending" 