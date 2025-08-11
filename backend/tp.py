from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
import sqlite3
import json
import os
from typing import Dict, List, Optional
import requests
import google.generativeai as genai
from dataclasses import dataclass, asdict
import uuid
import hashlib
import jwt
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  # This is the correct CORS for Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'a-very-secret-and-secure-key-that-you-should-change'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)
# Configure CORS properly for Flask
CORS(app, 
     origins="*",  # Allow all origins (tighten for production)
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["*"])
# API Keys
GEMINI_API_KEY =  "AIzaSyDW4BCGnID5zsxrjDX1DNu23-Fn4tkH_Hw"
ORS_KEY =  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjYwNTQ2MTMyMWQ3YjQzOWZhYWFmMmQ5ZDhiMzI0ZWZhIiwiaCI6Im11cm11cjY0In0="

# Initialize Gemini AI
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Data Models
@dataclass
class User:
    id: str
    email: str
    name: str
    password_hash: str
    created_at: str

@dataclass
class TravelPlan:
    id: str
    user_id: str
    destination: str
    budget: float
    duration: int
    interests: List[str]
    start_date: str
    end_date: str
    itinerary: Dict
    total_cost: float
    created_at: str
    updated_at: str

@dataclass
class Activity:
    id: str
    plan_id: str
    name: str
    description: str
    location: Dict
    cost: float
    duration: int
    category: str
    day: int
    time_slot: str

@dataclass
class Expense:
    id: str
    plan_id: str
    category: str
    amount: float
    description: str
    date: str
    created_at: str

# Utility Functions
def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return hash_password(password) == hashed

def generate_token(user_id: str) -> str:
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

# Database Functions
def init_db():
    conn = sqlite3.connect('travel_planner.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
    )''')
    
    # Travel plans table
    cursor.execute('''CREATE TABLE IF NOT EXISTS travel_plans (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        destination TEXT NOT NULL,
        budget REAL NOT NULL,
        duration INTEGER NOT NULL,
        interests TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        itinerary TEXT,
        total_cost REAL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')
    
    # Activities table
    cursor.execute('''CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        plan_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        location TEXT,
        cost REAL,
        duration INTEGER,
        category TEXT,
        day INTEGER,
        time_slot TEXT,
        FOREIGN KEY (plan_id) REFERENCES travel_plans (id)
    )''')
    
    # Expenses table
    cursor.execute('''CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        plan_id TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (plan_id) REFERENCES travel_plans (id)
    )''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect('travel_planner.db')
    conn.row_factory = sqlite3.Row
    return conn

# AI Service
class AIItineraryService:
    def __init__(self):
        self.model = model
    
    def generate_itinerary(self, destination: str, budget: float, duration: int, interests: List[str]) -> Dict:
        interests_str = ", ".join(interests)
        prompt = f"""
        Create a detailed travel itinerary for:
        Destination: {destination}
        Budget: ${budget}
        Duration: {duration} days
        Interests: {interests_str}
        
        Return a JSON response with the following structure:
        {{
            "days": [
                {{
                    "day": 1,
                    "activities": [
                        {{
                            "name": "Activity Name",
                            "description": "Activity Description",
                            "time": "HH:MM",
                            "duration": 2,
                            "cost": 50,
                            "category": "sightseeing/dining/entertainment/shopping/culture",
                            "location": {{"lat": 0.0, "lng": 0.0}}
                        }}
                    ]
                }}
            ],
            "total_estimated_cost": 1500,
            "budget_breakdown": {{
                "accommodation": 600,
                "food": 400,
                "activities": 300,
                "transportation": 200
            }}
        }}
        
        Make sure activities are realistic for the destination and fit within the budget.
        Include 3-4 activities per day with appropriate timing and costs.
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Parse the JSON response
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
            
            return json.loads(response_text)
        except Exception as e:
            print(f"AI Generation Error: {e}")
            # Fallback response
            return self._generate_fallback_itinerary(destination, duration, budget)
    
    def _generate_fallback_itinerary(self, destination: str, duration: int, budget: float) -> Dict:
        """Generate a simple fallback itinerary if AI fails"""
        daily_budget = budget / duration
        activities_per_day = 3
        activity_cost = daily_budget * 0.6 / activities_per_day
        
        days = []
        for day in range(1, duration + 1):
            activities = [
                {
                    "name": f"Morning Exploration - Day {day}",
                    "description": f"Explore popular attractions in {destination}",
                    "time": "09:00",
                    "duration": 3,
                    "cost": round(activity_cost, 2),
                    "category": "sightseeing",
                    "location": {"lat": 40.7128, "lng": -74.0060}
                },
                {
                    "name": f"Lunch & Local Experience - Day {day}",
                    "description": f"Try local cuisine and cultural experiences",
                    "time": "13:00",
                    "duration": 2,
                    "cost": round(activity_cost * 0.8, 2),
                    "category": "dining",
                    "location": {"lat": 40.7589, "lng": -73.9851}
                },
                {
                    "name": f"Evening Activity - Day {day}",
                    "description": f"Evening entertainment or relaxation",
                    "time": "18:00",
                    "duration": 3,
                    "cost": round(activity_cost * 1.2, 2),
                    "category": "entertainment",
                    "location": {"lat": 40.7505, "lng": -73.9934}
                }
            ]
            days.append({"day": day, "activities": activities})
        
        return {
            "days": days,
            "total_estimated_cost": budget * 0.9,
            "budget_breakdown": {
                "accommodation": budget * 0.4,
                "food": budget * 0.3,
                "activities": budget * 0.2,
                "transportation": budget * 0.1
            }
        }

# OpenRoute Service
class OpenRouteService:
    def __init__(self):
        self.api_key = ORS_KEY
        self.base_url = "https://api.openrouteservice.org"
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
    
    def search_places(self, query: str, location: str = None, bbox: List[float] = None) -> List[Dict]:
        """Search for places using OpenRoute geocoding service"""
        url = f"{self.base_url}/geocoding"
        params = {'text': query}
        
        if location:
            params['location'] = location
        if bbox:
            params['bbox'] = ','.join(map(str, bbox))
        
        try:
            response = requests.get(url, params=params, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            places = []
            for feature in data.get('features', []):
                place = {
                    'name': feature['properties']['name'],
                    'address': feature['properties'].get('formatted', ''),
                    'coordinates': {
                        'lat': feature['geometry']['coordinates'][1],
                        'lng': feature['geometry']['coordinates'][0]
                    },
                    'category': feature['properties'].get('category', 'unknown')
                }
                places.append(place)
            
            return places
        except Exception as e:
            print(f"Places search error: {e}")
            return []
    
    def get_directions(self, start: List[float], end: List[float], profile: str = 'driving-car') -> Dict:
        """Get directions between two points"""
        url = f"{self.base_url}/v2/directions/{profile}"
        data = {
            'coordinates': [start, end],
            'format': 'json'
        }
        
        try:
            response = requests.post(url, json=data, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Directions error: {e}")
            return {}

# Initialize services
ai_service = AIItineraryService()
openroute_service = OpenRouteService()

# Routes
@app.route('/')
def index():
    return jsonify({
        'message': 'AI Travel Planner API',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': [
            '/api/users (POST)',
            '/api/auth/login (POST)',
            '/api/auth/me (GET)',
            '/api/travel-plans (GET, POST)',
            '/api/travel-plans/<id> (GET, PUT, DELETE)',
            '/api/generate-itinerary (POST)',
            '/api/places/search (GET)',
            '/api/directions (POST)',
            '/api/activities (POST, PUT, DELETE)',
            '/api/expenses (GET, POST, PUT, DELETE)'
        ]
    })

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                             'favicon.ico', mimetype='image/vnd.microsoft.icon')

# Authentication Routes
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'name', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    user_id = str(uuid.uuid4())
    password_hash = hash_password(data['password'])
    
    user = User(
        id=user_id,
        email=data['email'],
        name=data['name'],
        password_hash=password_hash,
        created_at=datetime.now().isoformat()
    )
    
    conn = get_db_connection()
    try:
        conn.execute('''INSERT INTO users (id, email, name, password_hash, created_at) 
                       VALUES (?, ?, ?, ?, ?)''',
                    (user.id, user.email, user.name, user.password_hash, user.created_at))
        conn.commit()
        
        # Don't return password hash
        user_data = asdict(user)
        del user_data['password_hash']
        
        return jsonify(user_data), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'User already exists'}), 400
    finally:
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(field in data for field in ['email', 'password']):
        return jsonify({'error': 'Email and password required'}), 400
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (data['email'],)).fetchone()
    conn.close()
    
    if not user or not verify_password(data['password'], user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = generate_token(user['id'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name']
        }
    })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (current_user_id,)).fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user['id'],
        'email': user['email'],
        'name': user['name']
    })

# Travel Plans Routes
@app.route('/api/travel-plans', methods=['GET'])
@token_required
def get_travel_plans(current_user_id):
    user_id = request.args.get('user_id', current_user_id)
    
    # Users can only access their own plans
    if user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    plans = conn.execute('''SELECT * FROM travel_plans WHERE user_id = ? 
                           ORDER BY created_at DESC''', (user_id,)).fetchall()
    conn.close()
    
    plans_list = []
    for plan in plans:
        plan_dict = dict(plan)
        plan_dict['interests'] = json.loads(plan_dict['interests'])
        if plan_dict['itinerary']:
            plan_dict['itinerary'] = json.loads(plan_dict['itinerary'])
        plans_list.append(plan_dict)
    
    return jsonify(plans_list)

@app.route('/api/travel-plans', methods=['POST'])
@token_required
def create_travel_plan(current_user_id):
    data = request.get_json()
    
    required_fields = ['destination', 'budget', 'duration', 'interests', 'start_date', 'end_date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    plan_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    
    plan = TravelPlan(
        id=plan_id,
        user_id=current_user_id,
        destination=data['destination'],
        budget=float(data['budget']),
        duration=int(data['duration']),
        interests=data['interests'],
        start_date=data['start_date'],
        end_date=data['end_date'],
        itinerary={},
        total_cost=0.0,
        created_at=now,
        updated_at=now
    )
    
    conn = get_db_connection()
    try:
        conn.execute('''INSERT INTO travel_plans 
                       (id, user_id, destination, budget, duration, interests, 
                        start_date, end_date, itinerary, total_cost, created_at, updated_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (plan.id, plan.user_id, plan.destination, plan.budget, plan.duration,
                     json.dumps(plan.interests), plan.start_date, plan.end_date,
                     json.dumps(plan.itinerary), plan.total_cost, plan.created_at, plan.updated_at))
        conn.commit()
        
        plan_dict = asdict(plan)
        return jsonify(plan_dict), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/travel-plans/<plan_id>', methods=['GET'])
@token_required
def get_travel_plan(current_user_id, plan_id):
    conn = get_db_connection()
    plan = conn.execute('SELECT * FROM travel_plans WHERE id = ? AND user_id = ?',
                       (plan_id, current_user_id)).fetchone()
    conn.close()
    
    if not plan:
        return jsonify({'error': 'Travel plan not found'}), 404
    
    plan_dict = dict(plan)
    plan_dict['interests'] = json.loads(plan_dict['interests'])
    if plan_dict['itinerary']:
        plan_dict['itinerary'] = json.loads(plan_dict['itinerary'])
    
    return jsonify(plan_dict)

@app.route('/api/travel-plans/<plan_id>', methods=['PUT'])
@token_required
def update_travel_plan(current_user_id, plan_id):
    data = request.get_json()
    
    conn = get_db_connection()
    
    # Verify ownership
    existing = conn.execute('SELECT id FROM travel_plans WHERE id = ? AND user_id = ?',
                           (plan_id, current_user_id)).fetchone()
    if not existing:
        conn.close()
        return jsonify({'error': 'Travel plan not found'}), 404
    
    # Update fields
    update_fields = []
    params = []
    
    allowed_fields = ['destination', 'budget', 'duration', 'interests', 'start_date', 'end_date', 'itinerary', 'total_cost']
    for field in allowed_fields:
        if field in data:
            if field in ['interests', 'itinerary']:
                update_fields.append(f'{field} = ?')
                params.append(json.dumps(data[field]))
            else:
                update_fields.append(f'{field} = ?')
                params.append(data[field])
    
    if update_fields:
        update_fields.append('updated_at = ?')
        params.append(datetime.now().isoformat())
        params.append(plan_id)
        params.append(current_user_id)
        
        query = f'UPDATE travel_plans SET {", ".join(update_fields)} WHERE id = ? AND user_id = ?'
        conn.execute(query, params)
        conn.commit()
    
    # Return updated plan
    plan = conn.execute('SELECT * FROM travel_plans WHERE id = ? AND user_id = ?',
                       (plan_id, current_user_id)).fetchone()
    conn.close()
    
    plan_dict = dict(plan)
    plan_dict['interests'] = json.loads(plan_dict['interests'])
    if plan_dict['itinerary']:
        plan_dict['itinerary'] = json.loads(plan_dict['itinerary'])
    
    return jsonify(plan_dict)

@app.route('/api/travel-plans/<plan_id>', methods=['DELETE'])
@token_required
def delete_travel_plan(current_user_id, plan_id):
    conn = get_db_connection()
    
    # Verify ownership and delete
    result = conn.execute('DELETE FROM travel_plans WHERE id = ? AND user_id = ?',
                         (plan_id, current_user_id))
    
    if result.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Travel plan not found'}), 404
    
    # Also delete related activities and expenses
    conn.execute('DELETE FROM activities WHERE plan_id = ?', (plan_id,))
    conn.execute('DELETE FROM expenses WHERE plan_id = ?', (plan_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Travel plan deleted successfully'})

# AI Itinerary Generation
@app.route('/api/generate-itinerary', methods=['POST'])
@token_required
def generate_itinerary(current_user_id):
    data = request.get_json()
    
    required_fields = ['destination', 'budget', 'duration', 'interests']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        itinerary = ai_service.generate_itinerary(
            destination=data['destination'],
            budget=float(data['budget']),
            duration=int(data['duration']),
            interests=data['interests']
        )
        
        return jsonify(itinerary)
    except Exception as e:
        return jsonify({'error': f'Failed to generate itinerary: {str(e)}'}), 500

# Places and Directions
@app.route('/api/places/search', methods=['GET'])
def search_places():
    query = request.args.get('query')
    location = request.args.get('location')
    bbox = request.args.get('bbox')
    
    if not query:
        return jsonify({'error': 'Query parameter required'}), 400
    
    bbox_list = None
    if bbox:
        try:
            bbox_list = [float(x) for x in bbox.split(',')]
        except ValueError:
            return jsonify({'error': 'Invalid bbox format'}), 400
    
    places = openroute_service.search_places(query, location, bbox_list)
    return jsonify(places)

@app.route('/api/directions', methods=['POST'])
def get_directions():
    data = request.get_json()
    
    if not all(field in data for field in ['start', 'end']):
        return jsonify({'error': 'Start and end coordinates required'}), 400
    
    profile = data.get('profile', 'driving-car')
    directions = openroute_service.get_directions(data['start'], data['end'], profile)
    
    return jsonify(directions)

# Activities
@app.route('/api/activities', methods=['POST'])
@token_required
def create_activity(current_user_id):
    data = request.get_json()
    
    # Verify plan ownership
    plan_id = data.get('plan_id')
    if not plan_id:
        return jsonify({'error': 'plan_id required'}), 400
    
    conn = get_db_connection()
    plan = conn.execute('SELECT id FROM travel_plans WHERE id = ? AND user_id = ?',
                       (plan_id, current_user_id)).fetchone()
    if not plan:
        conn.close()
        return jsonify({'error': 'Travel plan not found'}), 404
    
    activity_id = str(uuid.uuid4())
    activity = Activity(
        id=activity_id,
        plan_id=plan_id,
        name=data['name'],
        description=data.get('description', ''),
        location=data.get('location', {}),
        cost=float(data.get('cost', 0)),
        duration=int(data.get('duration', 1)),
        category=data.get('category', 'other'),
        day=int(data.get('day', 1)),
        time_slot=data.get('time_slot', '09:00')
    )
    
    try:
        conn.execute('''INSERT INTO activities 
                       (id, plan_id, name, description, location, cost, duration, category, day, time_slot)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (activity.id, activity.plan_id, activity.name, activity.description,
                     json.dumps(activity.location), activity.cost, activity.duration,
                     activity.category, activity.day, activity.time_slot))
        conn.commit()
        
        return jsonify(asdict(activity)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Expenses
@app.route('/api/expenses', methods=['GET'])
@token_required
def get_expenses(current_user_id):
    plan_id = request.args.get('plan_id')
    if not plan_id:
        return jsonify({'error': 'plan_id parameter required'}), 400
    
    conn = get_db_connection()
    
    # Verify plan ownership
    plan = conn.execute('SELECT id FROM travel_plans WHERE id = ? AND user_id = ?',
                       (plan_id, current_user_id)).fetchone()
    if not plan:
        conn.close()
        return jsonify({'error': 'Travel plan not found'}), 404
    
    expenses = conn.execute('SELECT * FROM expenses WHERE plan_id = ? ORDER BY date DESC',
                           (plan_id,)).fetchall()
    conn.close()
    
    return jsonify([dict(expense) for expense in expenses])

@app.route('/api/expenses', methods=['POST'])
@token_required
def create_expense(current_user_id):
    data = request.get_json()
    
    required_fields = ['plan_id', 'category', 'amount', 'description', 'date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verify plan ownership
    plan_id = data['plan_id']
    conn = get_db_connection()
    plan = conn.execute('SELECT id FROM travel_plans WHERE id = ? AND user_id = ?',
                       (plan_id, current_user_id)).fetchone()
    if not plan:
        conn.close()
        return jsonify({'error': 'Travel plan not found'}), 404
    
    expense_id = str(uuid.uuid4())
    expense = Expense(
        id=expense_id,
        plan_id=plan_id,
        category=data['category'],
        amount=float(data['amount']),
        description=data['description'],
        date=data['date'],
        created_at=datetime.now().isoformat()
    )
    
    try:
        conn.execute('''INSERT INTO expenses 
                       (id, plan_id, category, amount, description, date, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?)''',
                    (expense.id, expense.plan_id, expense.category, expense.amount,
                     expense.description, expense.date, expense.created_at))
        conn.commit()
        
        return jsonify(asdict(expense)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)