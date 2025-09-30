import unittest
import server
from datetime import datetime, date
import json
from unittest.mock import MagicMock, patch
import io
import http.server

class TestHealthHandler(unittest.TestCase):
    def test_health_check(self):
        result = server.HealthHandler.handle_health_check()
        self.assertIn('status', result)
        self.assertEqual(result['status'], 'healthy')
        self.assertIn('timestamp', result)
        self.assertIn('service', result)
        self.assertEqual(result['service'], 'dob-facts-backend')

class MockRFile:
    def __init__(self, content):
        self.content = content
    
    def read(self, length):
        return self.content

class MockWFile:
    def __init__(self):
        self.content = b''
    
    def write(self, content):
        self.content += content if isinstance(content, bytes) else content.encode('utf-8')

class TestDOBFactsHandler(unittest.TestCase):
    def setUp(self):
        self.workflow_engine = server.WorkflowEngine()
        self.handler = server.DOBFactsHandler(None, None, None)
        self.handler.workflow_engine = self.workflow_engine
        self.handler.rfile = None
        self.handler.wfile = MockWFile()
        self.handler.headers = {'Content-Length': '0'}
        self.sent_headers = {}
        
        def mock_send_header(name, value):
            self.sent_headers[name] = value
        self.handler.send_header = mock_send_header
        self.handler.end_headers = lambda: None
        self.handler.send_response = lambda x: None
    
    def test_handle_health_check(self):
        self.handler._handle_health_check()
        response = json.loads(self.handler.wfile.content)
        self.assertEqual(response['status'], 'healthy')
        self.assertEqual(response['service'], 'dob-facts-backend')
    
    def test_handle_analyze(self):
        test_data = json.dumps({'dob': '2000-01-01'}).encode('utf-8')
        self.handler.rfile = MockRFile(test_data)
        self.handler.headers = {'Content-Length': str(len(test_data))}
        
        self.handler._handle_analyze()
        response = json.loads(self.handler.wfile.content)
        self.assertIn('workflow_id', response)

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
    
    def test_calculate_numerology(self):
        workflow = {
            'results': {'validated_dob': '2000-01-01'}
        }
        self.engine._calculate_numerology(workflow)
        numerology_data = workflow['results']['numerology']
        self.assertIn('life_path', numerology_data)
        self.assertIsInstance(numerology_data['life_path'], int)
    
    def test_find_day_of_week(self):
        workflow = {
            'results': {'validated_dob': '2000-01-01'}
        }
        self.engine._find_day_of_week(workflow)
        day_info = workflow['results']['day_info']
        self.assertEqual(day_info['day_of_week'], 'Saturday')
        self.assertEqual(day_info['day_number'], 6)
    
    def test_generate_fun_facts(self):
        workflow = {
            'results': {
                'validated_dob': '2000-01-01',
                'age': {'days': 9000, 'years': 25}
            }
        }
        self.engine._generate_fun_facts(workflow)
        fun_facts = workflow['results']['fun_facts']
        self.assertIn('days_to_next_birthday', fun_facts)
        self.assertIn('estimated_heartbeats', fun_facts)
        self.assertIn('lunar_cycles_lived', fun_facts)
        self.assertIn('seasons_experienced', fun_facts)
        self.assertEqual(fun_facts['seasons_experienced'], 100)  # 25 years * 4 seasons
    
    def test_full_workflow_process(self):
        workflow_id = self.engine.start_workflow('test_full', 'analyze_dob', {'dob': '2000-01-01'})
        # Give some time for the background thread to process
        import time
        time.sleep(2)
        
        status = self.engine.get_workflow_status(workflow_id)
        self.assertEqual(status['status'], 'completed')
        self.assertIn('results', status)
        self.assertIn('validated_dob', status['results'])
        self.assertIn('age', status['results'])
        self.assertIn('zodiac', status['results'])
        self.assertIn('numerology', status['results'])
        self.assertIn('day_info', status['results'])
        self.assertIn('fun_facts', status['results'])

if __name__ == '__main__':
    unittest.main()
