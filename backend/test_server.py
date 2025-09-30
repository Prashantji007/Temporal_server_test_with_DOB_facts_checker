import unittest
import server

class TestHealthHandler(unittest.TestCase):
    def test_health_check(self):
        result = server.HealthHandler.handle_health_check()
        self.assertIn('status', result)
        self.assertEqual(result['status'], 'healthy')
        self.assertIn('timestamp', result)
        self.assertIn('service', result)

class TestWorkflowEngine(unittest.TestCase):
    def setUp(self):
        self.engine = server.WorkflowEngine()

    def test_start_and_status(self):
        workflow_id = self.engine.start_workflow('test1', 'analyze_dob', {'dob': '2000-01-01'})
        status = self.engine.get_workflow_status(workflow_id)
        self.assertEqual(status['id'], workflow_id)
        self.assertEqual(status['type'], 'analyze_dob')
        self.assertEqual(status['data']['dob'], '2000-01-01')

if __name__ == '__main__':
    unittest.main()
