import unittest
import server
from datetime import datetime, date
import json
from unittest.mock import MagicMock

class TestHealthHandler(unittest.TestCase):
    def test_health_check(self):
        result = server.HealthHandler.handle_health_check()
        self.assertIn('status', result)
        self.assertEqual(result['status'], 'healthy')
        self.assertIn('timestamp', result)
        self.assertIn('service', result)
        self.assertEqual(result['service'], 'dob-facts-backend')

class TestWorkflowEngine(unittest.TestCase):
    def setUp(self):
        self.engine = server.WorkflowEngine()

    def test_start_and_status(self):
        workflow_id = self.engine.start_workflow('test1', 'analyze_dob', {'dob': '2000-01-01'})
        status = self.engine.get_workflow_status(workflow_id)
        self.assertEqual(status['id'], workflow_id)
        self.assertEqual(status['type'], 'analyze_dob')
        self.assertEqual(status['data']['dob'], '2000-01-01')
        
    def test_validate_date(self):
        workflow = {
            'data': {'dob': '2000-01-01'},
            'results': {}
        }
        self.engine._validate_date(workflow)
        self.assertEqual(workflow['results']['validated_dob'], '2000-01-01')
        
        # Test invalid date
        workflow['data']['dob'] = 'invalid-date'
        with self.assertRaises(ValueError):
            self.engine._validate_date(workflow)
            
        # Test future date
        future_date = (date.today().replace(year=date.today().year + 1)).isoformat()
        workflow['data']['dob'] = future_date
        with self.assertRaises(ValueError):
            self.engine._validate_date(workflow)
    
    def test_calculate_age(self):
        workflow = {
            'results': {'validated_dob': '2000-01-01'}
        }
        self.engine._calculate_age(workflow)
        self.assertIn('age', workflow['results'])
        age_data = workflow['results']['age']
        self.assertGreater(age_data['years'], 20)  # As of 2025
        self.assertIn('days', age_data)
        self.assertIn('hours', age_data)
        self.assertIn('minutes', age_data)
    
    def test_determine_zodiac(self):
        workflow = {
            'results': {'validated_dob': '2000-01-01'}
        }
        self.engine._determine_zodiac(workflow)
        zodiac_data = workflow['results']['zodiac']
        self.assertIn('western', zodiac_data)
        self.assertIn('chinese', zodiac_data)
        self.assertEqual(zodiac_data['western'], 'Capricorn')
        self.assertEqual(zodiac_data['chinese'], 'Dragon')

if __name__ == '__main__':
    unittest.main()
