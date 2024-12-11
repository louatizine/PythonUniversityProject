from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/carproject'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
ma = Marshmallow(app)

# Models
class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="user")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Car(db.Model):
    __tablename__ = "car"
    id = db.Column(db.Integer, primary_key=True)
    marke = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    price_per_day = db.Column(db.Float, nullable=False)
    picture = db.Column(db.String(200), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
# Marshmallow Schemas
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at')
class CarSchema(ma.Schema):
    class Meta:
        fields = ('id', 'make', 'model', 'year', 'price_per_day', 'picture', 'owner_id', 'created_at')
user_schema = UserSchema()
users_schema = UserSchema(many=True)
car_schema = CarSchema()
cars_schema = CarSchema(many=True)
# Routes
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Car Rental API!"})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not username or not password or not email or not first_name or not last_name:
        return jsonify({'message': 'All fields are required'}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'message': 'Username or email already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password, email=email, first_name=first_name, last_name=last_name)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity={'id': user.id, 'email': user.email, 'role': user.role})
        return jsonify({'message': 'Login successful', 'access_token': access_token, 'role': user.role}), 200

    return jsonify({'message': 'Invalid email or password'}), 401

@app.route('/listusers', methods=['GET'])
def listusers():
    all_users = User.query.all()
    results = users_schema.dump(all_users)
    return jsonify(results)

@app.route('/userdetails/<id>', methods=['GET'])
def userdetails(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)

@app.route('/userupdate/<id>', methods=['PUT'])
def userupdate(id):
    user = User.query.get(id)
    username = request.json.get('username')
    email = request.json.get('email')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    role = request.json.get('role')

    if username:
        user.username = username
    if email:
        user.email = email
    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    if role:
        user.role = role

    db.session.commit()

    return user_schema.jsonify(user)

@app.route('/userdelete/<id>', methods=['DELETE'])
def userdelete(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)

@app.route('/useradd', methods=['POST'])
def useradd():
    username = request.json.get('username')
    email = request.json.get('email')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    role = request.json.get('role', 'user')
    password = request.json.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, first_name=first_name, last_name=last_name, role=role, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user)

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_current_user():
    user_identity = get_jwt_identity()
    user = User.query.filter_by(id=user_identity['id']).first()
    if user:
        return user_schema.jsonify(user)
    return jsonify({"message": "User not found"}), 404


#Cars Api




# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
