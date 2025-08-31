#!/usr/bin/env python3
import http.server
import socketserver
import json
import urllib.parse
from datetime import datetime, date
import calendar
import math
import time
import threading
from typing import Dict, Any, List

class HealthHandler:
    @staticmethod
    def handle_health_check():
        return {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'service': 'dob-facts-backend'
        }

class WorkflowEngine:
    def __init__(self):
        self.workflows: Dict[str, Dict] = {}
        self.workflow_steps = {
            'analyze_dob': [
                'validate_date',
                'calculate_age',
                'determine_zodiac',
                'calculate_numerology',
                'find_day_of_week',
                'generate_fun_facts',
                'complete'
            ]
        }
    
    def start_workflow(self, workflow_id: str, workflow_type: str, data: Dict[str, Any]) -> str:
        workflow = {
            'id': workflow_id,
            'type': workflow_type,
            'status': 'running',
            'current_step': 0,
            'steps': self.workflow_steps.get(workflow_type, []),
            'data': data,
            'results': {},
            'started_at': datetime.now().isoformat(),
            'completed_at': None
        }
        self.workflows[workflow_id] = workflow
        
        # Start processing in background
        threading.Thread(target=self._process_workflow, args=(workflow_id,), daemon=True).start()
        return workflow_id
    
    def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        return self.workflows.get(workflow_id, {})
    
    def _process_workflow(self, workflow_id: str):
        workflow = self.workflows[workflow_id]
        
        try:
            for i, step in enumerate(workflow['steps']):
                workflow['current_step'] = i
                time.sleep(0.5)  # Simulate processing time
                
                if step == 'validate_date':
                    self._validate_date(workflow)
                elif step == 'calculate_age':
                    self._calculate_age(workflow)
                elif step == 'determine_zodiac':
                    self._determine_zodiac(workflow)
                elif step == 'calculate_numerology':
                    self._calculate_numerology(workflow)
                elif step == 'find_day_of_week':
                    self._find_day_of_week(workflow)
                elif step == 'generate_fun_facts':
                    self._generate_fun_facts(workflow)
                elif step == 'complete':
                    workflow['status'] = 'completed'
                    workflow['completed_at'] = datetime.now().isoformat()
                    workflow['current_step'] = len(workflow['steps'])
        
        except Exception as e:
            workflow['status'] = 'failed'
            workflow['error'] = str(e)
    
    def _validate_date(self, workflow):
        dob_str = workflow['data']['dob']
        try:
            dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
            today = date.today()
            if dob > today:
                raise ValueError("Date of birth cannot be in the future")
            workflow['results']['validated_dob'] = dob.isoformat()
        except ValueError as e:
            raise ValueError(f"Invalid date format: {e}")
    
    def _calculate_age(self, workflow):
        dob = datetime.strptime(workflow['results']['validated_dob'], '%Y-%m-%d').date()
        today = date.today()
        
        age_years = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        age_days = (today - dob).days
        age_hours = age_days * 24
        age_minutes = age_hours * 60
        
        workflow['results']['age'] = {
            'years': age_years,
            'days': age_days,
            'hours': age_hours,
            'minutes': age_minutes
        }
    
    def _determine_zodiac(self, workflow):
        dob = datetime.strptime(workflow['results']['validated_dob'], '%Y-%m-%d').date()
        month, day = dob.month, dob.day
        
        zodiac_signs = [
            (120, "Capricorn"), (218, "Aquarius"), (320, "Pisces"), (419, "Aries"),
            (520, "Taurus"), (620, "Gemini"), (722, "Cancer"), (822, "Leo"),
            (922, "Virgo"), (1022, "Libra"), (1121, "Scorpio"), (1221, "Sagittarius"),
            (1231, "Capricorn")
        ]
        
        date_key = month * 100 + day
        zodiac = "Capricorn"
        for date_limit, sign in zodiac_signs:
            if date_key <= date_limit:
                zodiac = sign
                break
        
        chinese_zodiac = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", 
                         "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"]
        chinese_sign = chinese_zodiac[dob.year % 12]
        
        workflow['results']['zodiac'] = {
            'western': zodiac,
            'chinese': chinese_sign
        }
    
    def _calculate_numerology(self, workflow):
        dob = datetime.strptime(workflow['results']['validated_dob'], '%Y-%m-%d').date()
        
        # Life path number
        date_sum = sum(int(digit) for digit in dob.strftime('%Y%m%d'))
        while date_sum > 9 and date_sum not in [11, 22, 33]:
            date_sum = sum(int(digit) for digit in str(date_sum))
        
        workflow['results']['numerology'] = {
            'life_path': date_sum
        }
    
    def _find_day_of_week(self, workflow):
        dob = datetime.strptime(workflow['results']['validated_dob'], '%Y-%m-%d').date()
        day_of_week = calendar.day_name[dob.weekday()]
        
        workflow['results']['day_info'] = {
            'day_of_week': day_of_week,
            'day_number': dob.weekday() + 1
        }
    
    def _generate_fun_facts(self, workflow):
        dob = datetime.strptime(workflow['results']['validated_dob'], '%Y-%m-%d').date()
        today = date.today()
        
        # Calculate next birthday
        next_birthday = date(today.year, dob.month, dob.day)
        if next_birthday < today:
            next_birthday = date(today.year + 1, dob.month, dob.day)
        days_to_birthday = (next_birthday - today).days
        
        # Fun calculations
        age_in_seconds = workflow['results']['age']['days'] * 24 * 60 * 60
        heartbeats = age_in_seconds * 1.2  # Average heartbeats per second
        
        workflow['results']['fun_facts'] = {
            'days_to_next_birthday': days_to_birthday,
            'estimated_heartbeats': int(heartbeats),
            'lunar_cycles_lived': workflow['results']['age']['days'] // 29.5,
            'seasons_experienced': workflow['results']['age']['years'] * 4
        }

class DOBFactsHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, workflow_engine=None, **kwargs):
        self.workflow_engine = workflow_engine
        super().__init__(*args, **kwargs)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/analyze':
            self._handle_analyze()
        else:
            self.send_error(404)
    
    def do_GET(self):
        if self.path.startswith('/api/workflow/'):
            workflow_id = self.path.split('/')[-1]
            self._handle_workflow_status(workflow_id)
        elif self.path == '/api/health':
            self._handle_health_check()
        else:
            self.send_error(404)
    
    def _handle_health_check(self):
        try:
            health_data = HealthHandler.handle_health_check()
            self._send_json_response(health_data)
        except Exception as e:
            self._send_error_response(str(e), 500)
    
    def _handle_analyze(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            workflow_id = f"dob_analysis_{int(time.time() * 1000)}"
            self.workflow_engine.start_workflow(workflow_id, 'analyze_dob', data)
            
            response = {'workflow_id': workflow_id}
            self._send_json_response(response)
            
        except Exception as e:
            self._send_error_response(str(e))
    
    def _handle_workflow_status(self, workflow_id):
        try:
            workflow = self.workflow_engine.get_workflow_status(workflow_id)
            if not workflow:
                self.send_error(404)
                return
            
            self._send_json_response(workflow)
            
        except Exception as e:
            self._send_error_response(str(e))
    
    def _send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def _send_error_response(self, error_message, status=400):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_response = {'error': error_message}
        self.wfile.write(json.dumps(error_response).encode('utf-8'))

def create_handler_with_workflow(workflow_engine):
    def handler(*args, **kwargs):
        return DOBFactsHandler(*args, workflow_engine=workflow_engine, **kwargs)
    return handler

if __name__ == '__main__':
    workflow_engine = WorkflowEngine()
    handler = create_handler_with_workflow(workflow_engine)
    
    PORT = 8000
    print(f"Starting DOB Facts API server on port {PORT}")
    print("Workflow engine initialized")
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")