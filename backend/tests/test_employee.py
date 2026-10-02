import unittest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

class TestEmployeeAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_get_all_employees(self):
        res = self.client.get("/api/v1/employees")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
        self.assertEqual(data[0]["employee_id"], "EMP-1042")

    def test_search_employees(self):
        res = self.client.get("/api/v1/employees/search?query=Arambh")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Arambh Srivastava")

    def test_badge_ocr_search(self):
        # Test badge image upload OCR endpoint
        file_content = b"fake image content"
        res = self.client.post(
            "/api/v1/employees/ocr-search",
            files={"file": ("EMP-1042_badge.jpg", file_content, "image/jpeg")}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["ocr_extracted"]["employee_id"], "EMP-1042")
        self.assertEqual(len(data["matches"]), 1)
        self.assertEqual(data["matches"][0]["name"], "Arambh Srivastava")

    def test_send_email_unconfigured_error(self):
        # Test error handling when SMTP credentials are unconfigured
        settings.SMTP_HOST = ""
        settings.SMTP_USER = ""
        settings.SMTP_PASSWORD = ""
        payload = {
            "employee_id": "EMP-1042",
            "recipient_email": "admin@historian.ai",
            "search_method": "Employee Badge/Image → OCR → Employee Directory"
        }
        res = self.client.post("/api/v1/employees/send-result-email", json=payload)
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertEqual(data["detail"]["code"], "EMAIL_SERVICE_NOT_CONFIGURED")

    @patch("smtplib.SMTP")
    def test_send_employee_result_email_success(self, mock_smtp_cls):
        # Test real SMTP dispatch when credentials are set
        settings.SMTP_HOST = "smtp.gmail.com"
        settings.SMTP_PORT = 587
        settings.SMTP_USER = "test@gmail.com"
        settings.SMTP_PASSWORD = "test-app-password"

        mock_smtp_instance = MagicMock()
        mock_smtp_cls.return_value.__enter__.return_value = mock_smtp_instance

        payload = {
            "employee_id": "EMP-1042",
            "recipient_email": "admin@historian.ai",
            "search_method": "Employee Badge/Image → OCR → Employee Directory"
        }
        res = self.client.post("/api/v1/employees/send-result-email", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["employee_id"], "EMP-1042")
        self.assertEqual(data["recipient"], "admin@historian.ai")
        self.assertIn("a***n@historian.ai", data["masked_email"])

        # Reset settings after test
        settings.SMTP_HOST = ""
        settings.SMTP_USER = ""
        settings.SMTP_PASSWORD = ""

    def test_send_email_invalid_employee(self):
        # Test error handling when employee ID does not exist
        payload = {
            "employee_id": "EMP-9999",
            "recipient_email": "admin@historian.ai"
        }
        res = self.client.post("/api/v1/employees/send-result-email", json=payload)
        self.assertEqual(res.status_code, 404)

if __name__ == "__main__":
    unittest.main()
