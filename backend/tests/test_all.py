import os
import unittest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestHistorianBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sample_pdf_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "sample_students.pdf")

    def test_01_health_check(self):
        """1. Health API Check"""
        res = client.get("/api/v1/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["app"], "Historian")

    def test_02_invalid_file_type_upload(self):
        """2. Upload Invalid File Type Validation"""
        res = client.post(
            "/api/v1/data/upload",
            files={"file": ("invalid_text.txt", b"Invalid content", "text/plain")}
        )
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertIn("INVALID_FILE_TYPE", str(data))

    def test_03_pdf_data_upload(self):
        """3. Valid PDF Data Upload Endpoint"""
        with open(self.sample_pdf_path, "rb") as f:
            res = client.post(
                "/api/v1/data/upload",
                files={"file": ("sample_students.pdf", f, "application/pdf")}
            )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertGreaterEqual(data["records_extracted"], 10)

    def test_04_run_analysis_pipeline(self):
        """4. Run Complete ML Pipeline"""
        res = client.post("/api/v1/analysis/run")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "completed")
        self.assertGreaterEqual(data["records_analyzed"], 10)
        self.assertIn("high_risk", data)
        self.assertIn("anomalies", data)

    def test_05_dashboard_api(self):
        """5. Dashboard Analytics API"""
        res = client.get("/api/v1/dashboard")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["students_analyzed"], 0)
        self.assertIn("risk_distribution", data)
        self.assertIn("ai_performance_score", data)

    def test_06_students_api(self):
        """6. Students List & Detail API"""
        res = client.get("/api/v1/students")
        self.assertEqual(res.status_code, 200)
        students = res.json()
        self.assertGreater(len(students), 0)

        sample_id = students[0]["student_id"]
        detail_res = client.get(f"/api/v1/students/{sample_id}")
        self.assertEqual(detail_res.status_code, 200)
        detail = detail_res.json()
        self.assertIn("profile", detail)
        self.assertIn("analytics", detail)
        self.assertIn("recommendation", detail)

    def test_07_predictions_api(self):
        """7. Predictions API"""
        res = client.get("/api/v1/predictions")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(len(data), 0)

    def test_08_anomalies_api(self):
        """8. Anomalies API"""
        res = client.get("/api/v1/anomalies")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json(), list)

    def test_09_clusters_api(self):
        """9. Clusters API"""
        res = client.get("/api/v1/clusters")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json(), list)

    def test_10_recommendations_api(self):
        """10. Recommendations API"""
        res = client.get("/api/v1/recommendations")
        self.assertEqual(res.status_code, 200)
        self.assertGreater(len(res.json()), 0)

    def test_11_harvey_chat_api(self):
        """11. HARVEY AI Assistant Chat API"""
        # Question 1: High risk students
        res1 = client.post(
            "/api/v1/harvey/chat",
            json={"message": "Which students are high risk?"}
        )
        self.assertEqual(res1.status_code, 200)
        data1 = res1.json()
        self.assertIn("session_id", data1)
        self.assertIn("high-risk", data1["message"].lower())

        session_id = data1["session_id"]

        # Question 2: Why is Rahul at high risk?
        res2 = client.post(
            "/api/v1/harvey/chat",
            json={"message": "Why is Rahul at high risk?", "session_id": session_id}
        )
        self.assertEqual(res2.status_code, 200)
        data2 = res2.json()
        self.assertIn("rahul", data2["message"].lower())

        # Check conversations history endpoint
        conv_res = client.get("/api/v1/harvey/conversations")
        self.assertEqual(conv_res.status_code, 200)
        self.assertGreater(len(conv_res.json()), 0)

if __name__ == "__main__":
    unittest.main()
