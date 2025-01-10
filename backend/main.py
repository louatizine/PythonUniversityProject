from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")  # Allow your frontend's origin

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/car'
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
    phone = db.Column(db.String(255), nullable=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="user")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class Rental(db.Model):
    __tablename__ = "rental"
    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer, db.ForeignKey('car.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rental_date = db.Column(db.DateTime, default=datetime.utcnow)
    return_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), nullable=False, default="pending")
    car_picture = db.Column(db.String(255), nullable=False)  # Store car picture URL# New field: pending, approved, rejected
    rental_price = db.Column(db.Float, nullable=False)  # Store rental price
    car = db.relationship('Car', backref=db.backref('rentals', cascade='all, delete-orphan'))
    user = db.relationship('User', backref=db.backref('rentals', cascade='all, delete-orphan'))

    

class Car(db.Model):
    __tablename__ = 'car'
    id = db.Column(db.Integer, primary_key=True)
    marke = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    price_per_day = db.Column(db.Float, nullable=False)
    fuel_type = db.Column(db.String(50), nullable=False)
    picture = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)




# Marshmallow Schemas
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at')

class CarSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Car
        load_instance = True
        fields = ('id', 'marke', 'model', 'year', 'price_per_day', 'fuel_type', 'picture', 'created_at')

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
    phone = data.get('phone')  # Get phone from the request

    # Validate required fields
    if not username or not password or not email or not first_name or not last_name or not phone:
        return jsonify({'message': 'All fields are required'}), 400

    # Check if username or email already exists
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'message': 'Username or email already exists'}), 409

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create a new user with the phone number
    new_user = User(username=username, password=hashed_password, email=email, 
                    first_name=first_name, last_name=last_name, phone=phone)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201



@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=str(user.id))  # Use a string here the best why to remove the 422 error 
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'role': user.role
        }), 200

    return jsonify({'message': 'Invalid email or password'}), 401



@app.route('/listusers', methods=['GET'])
def listusers():
    all_users = User.query.all()
    results = users_schema.dump(all_users)
    return jsonify(results)

@app.route("/listcar", methods=["GET"])
def listcars():
    try:
        all_cars = Car.query.all()
        cars_data = [{
            'id': car.id,
            'marke': car.marke,
            'model': car.model,
            'year': car.year,
            'price_per_day': car.price_per_day,
            'fuel_type': car.fuel_type,
            'picture': car.picture,
            'created_at': car.created_at
        } for car in all_cars]
        return jsonify(cars_data), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred while fetching cars."}), 500

@app.route('/userdetails/<id>', methods=['GET'])
def userdetails(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)


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

    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)


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

@app.route('/api/user', methods=['GET','PUT'])
@jwt_required()
def get_current_user():
    user_identity = get_jwt_identity()
    user = User.query.filter_by(id=int(user_identity)).first()
    
    if user:
        # Make sure phone is included in the response
        return jsonify({
            "id": user.id,
            "phone": user.phone,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "created_at": user.created_at
        })
    return jsonify({"message": "User not found"}), 404






# Cars API
## Car CRUD
@app.route('/cars', methods=['POST'])
def create_car():
    data = request.json
    new_car = Car(**data)
    db.session.add(new_car)
    db.session.commit()
    return jsonify({"message": "Car added", "car_id": new_car.id}), 201

@app.route('/cars/<int:id>', methods=['GET'])
def get_car(id):
    car = Car.query.get_or_404(id)
    return jsonify({"id": car.id, "marke": car.marke, "model": car.model, "price_per_day": car.price_per_day})

@app.route('/cars/<int:id>', methods=['PUT'])
def update_car(id):
    data = request.json
    car = Car.query.get_or_404(id)
    for key, value in data.items():
        setattr(car, key, value)
    db.session.commit()
    return jsonify({"message": "Car updated", "car_id": car.id})

@app.route('/cars/<int:id>', methods=['DELETE'])
def delete_car(id):
    car = Car.query.get_or_404(id)
    db.session.delete(car)
    db.session.commit()
    return jsonify({"message": "Car deleted"})






## Rental Management
@app.route('/rentals', methods=['POST'])
@jwt_required()
def rent_car():
    data = request.json
    car = Car.query.get(data['car_id'])

    if not car:
        return jsonify({"error": "Car not found"}), 404

    rental_date = data.get('rental_date')
    return_date = data.get('return_date')

    if not rental_date or not return_date:
        return jsonify({"error": "Both rental_date and return_date are required"}), 400

    try:
        rental_date = datetime.strptime(rental_date, "%Y-%m-%d")
        return_date = datetime.strptime(return_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    if return_date <= rental_date:
        return jsonify({"error": "Return date must be after the rental date"}), 400

    # Calculate the rental days
    rental_days = (return_date - rental_date).days

    if rental_days <= 0:
        return jsonify({"error": "Rental duration must be greater than 0 days"}), 400

    # Check if the car is already rented during the requested dates
    existing_rental = Rental.query.filter(
        Rental.car_id == car.id,
        Rental.status == 'approved',
        db.or_(
            db.and_(Rental.rental_date <= return_date, Rental.return_date >= rental_date)
        )
    ).first()

    if existing_rental:
        return jsonify({"message": "Sorry, the car is already rented during this period."}), 400

    # Calculate the rental price
    rental_price = rental_days * car.price_per_day

    user_id = int(get_jwt_identity())  # Get the current user's ID
    rental = Rental(
        car_id=car.id,
        user_id=user_id,
        rental_date=rental_date,
        return_date=return_date,
        status="pending",
        car_picture=car.picture,  # Store car's picture in the rental record
        rental_price=rental_price  # Store the calculated rental price
    )
    db.session.add(rental)
    db.session.commit()

    return jsonify({
        "message": "Car rented successfully",
        "car_id": car.id,
        "user_id": user_id,
        "rental_price": rental_price  # Include the rental price in the response
    }), 201




@app.route('/returns', methods=['POST'])
def return_car():
    data = request.json
    rental = Rental.query.filter_by(car_id=data['car_id'], return_date=None).first()
    if rental:
        rental.return_date = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Car returned", "car_id": rental.car_id})
    return jsonify({"error": "Rental not found"}), 404



@app.route('/list_rentals', methods=['GET'])
@jwt_required()
def list_rentals():
    try:
        user_id = int(get_jwt_identity())  # Convert the identity back to an integer
        rentals = Rental.query.filter_by(user_id=user_id).all()

        rentals_data = []
        for rental in rentals:
            rental_date = rental.rental_date
            return_date = rental.return_date

            # Calculate the number of days the car was rented
            if return_date:  # If return date exists, calculate the days
                rental_days = (return_date - rental_date).days
            else:
                rental_days = (datetime.now() - rental_date).days  # If no return date, use today's date

            # Assuming 'Car' model has 'price_per_day'
            car = Car.query.get(rental.car_id)
            if car:
                price_per_day = car.price_per_day
            else:
                price_per_day = 0  # If no car found, set price to 0

            # Check if the price is valid and rental days are valid
            if rental_days < 0 or price_per_day <= 0:
                total_price = 0  # If invalid, set total price to 0
            else:
                total_price = rental_days * price_per_day  # Calculate the total price

            rentals_data.append({
                "id": rental.id,
                "car_id": rental.car_id,
                "rental_date": rental.rental_date,
                "return_date": rental.return_date,
                "status": rental.status,
                "car_picture": rental.car_picture,  # Ensure car_picture is included
                "total_price": total_price  # Include the calculated total price
            })

        return jsonify(rentals_data), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred"}), 422




@app.route('/delete_rental/<int:rental_id>', methods=['DELETE'])
@jwt_required()
def delete_rental(rental_id):
    try:
        user_id = int(get_jwt_identity())  # Get the logged-in user
        rental = Rental.query.filter_by(id=rental_id, user_id=user_id).first()

        if not rental:
            return jsonify({"message": "Rental not found or access denied."}), 404

        db.session.delete(rental)
        db.session.commit()

        return jsonify({"message": "Rental deleted successfully."}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred while deleting the rental."}), 422


######
@app.route('/update_rental/<int:rental_id>', methods=['PUT'])
@jwt_required()
def update_rental(rental_id):
    try:
        # Get the logged-in user ID
        user_id = int(get_jwt_identity())  # Get the logged-in user

        rental = Rental.query.filter_by(id=rental_id, user_id=user_id).first()

        if not rental:
            return jsonify({"message": "Rental not found or access denied."}), 404

        data = request.get_json()

        # Log the received request data for debugging
        print(f"Received data: {data}")

        # Validate the presence of rental_date and return_date
        if not data.get('rental_date') or not data.get('return_date'):
            return jsonify({"message": "Missing rental_date or return_date"}), 400

        # Extract new rental dates from the request body or use current values
        new_rental_date = data.get('rental_date', rental.rental_date)
        new_return_date = data.get('return_date', rental.return_date)

        # Check if new rental dates are provided and if there's a conflict
        if new_rental_date and new_return_date:
            # Check if the new rental dates conflict with any existing rentals
            conflicting_rental = Rental.query.filter(
                Rental.car_id == rental.car_id,
                Rental.status == 'approved',
                db.or_(
                    db.and_(Rental.rental_date <= new_return_date, Rental.return_date >= new_rental_date)
                )
            ).first()

            if conflicting_rental:
                return jsonify({"message": "Sorry, the car is already rented during this period."}), 400

        # Proceed with the update if no conflict
        rental.rental_date = new_rental_date
        rental.return_date = new_return_date

        db.session.commit()

        return jsonify({"message": "Rental updated successfully."}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred while updating the rental."}), 422

###



#admin 
@app.route('/admin/rentals', methods=['GET'])
@jwt_required()
def get_all_rentals():
    """Fetch all rental requests with user and car details."""
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        if current_user.role != "admin":
            return jsonify({"message": "Unauthorized"}), 403

        rentals = Rental.query.all()
        rental_list = [{
            "id": rental.id,
            "username": rental.user.username,
            "car": f"{rental.car.marke} {rental.car.model} ({rental.car.year})",
            "rental_date": rental.rental_date.strftime('%Y-%m-%d'),
            "return_date": rental.return_date.strftime('%Y-%m-%d') if rental.return_date else None,
            "status": rental.status
        } for rental in rentals]

        return jsonify(rental_list), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


@app.route('/admin/rentals/<int:rental_id>/status', methods=['PUT'])
@jwt_required()
def update_rental_status(rental_id):
    """Approve or reject a rental request."""
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)

        if current_user.role != "admin":
            return jsonify({"message": "Unauthorized"}), 403

        rental = Rental.query.get_or_404(rental_id)
        new_status = request.json.get('status')  # Should be 'approved' or 'rejected'

        if new_status not in ['approved', 'rejected']:
            return jsonify({"message": "Invalid status. Use 'approved' or 'rejected'."}), 400

        rental.status = new_status
        db.session.commit()

        return jsonify({"message": f"Rental request {new_status} successfully!"}), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500



# Statistique 


@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    try:
        total_users = User.query.count()
        total_cars = Car.query.count()
        rented_cars = Rental.query.filter(Rental.return_date.is_(None)).count()
        unrented_cars = total_cars - rented_cars

        return jsonify({
            "total_users": total_users,
            "total_cars": total_cars,
            "rented_cars": rented_cars,
            "unrented_cars": unrented_cars
        }), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500



# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
