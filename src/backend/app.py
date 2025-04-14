from flask import Flask, request, jsonify
import json
import random
from flask_cors import CORS


app = Flask(__name__)
# Allow requests from http://localhost:3000
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load data from JSON files
with open("testimonials.json") as f:
    testimonials = json.load(f)

with open("courses.json") as f:
    courses = json.load(f)

# In-memory storage for registered students
students = []
student_id_counter = 1

@app.route("/register", methods=["POST"])
def register():
    global student_id_counter
    data = request.get_json()
    username = data.get("username")
    if any(s["username"] == username for s in students):
        return jsonify({"message": "Username already taken."}), 409
    student = {
        "id": student_id_counter,
        "username": username,
        "password": data.get("password"),
        "email": data.get("email"),
        "enrolled_courses": []
    }
    students.append(student)
    student_id_counter += 1
    return jsonify({"message": "Registration successful."}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    for student in students:
        if student["username"] == data.get("username") and student["password"] == data.get("password"):
            return jsonify({"message": "Login successful.", "student_id": student["id"]}), 200
    return jsonify({"message": "Invalid username or password."}), 401

@app.route("/testimonials", methods=["GET"])
def get_testimonials():
    return jsonify(random.sample(testimonials, 2)), 200

@app.route("/enroll/<int:student_id>", methods=["POST"])
def enroll_course(student_id):
    data = request.get_json()
    course_id = data.get("course_id")
    for student in students:
        if student["id"] == student_id:
            if course_id not in student["enrolled_courses"]:
                student["enrolled_courses"].append(course_id)
                return jsonify({"message": "Course enrolled successfully."}), 200
            else:
                return jsonify({"message": "Already enrolled in this course."}), 400
    return jsonify({"message": "Student not found."}), 404

@app.route("/drop/<int:student_id>", methods=["DELETE"])
def drop_course(student_id):
    data = request.get_json()
    course_id = data.get("course_id")
    for student in students:
        if student["id"] == student_id:
            if course_id in student["enrolled_courses"]:
                student["enrolled_courses"].remove(course_id)
                return jsonify({"message": "Course dropped successfully."}), 200
            else:
                return jsonify({"message": "Course not found in student's list."}), 400
    return jsonify({"message": "Student not found."}), 404

@app.route("/courses", methods=["GET"])
def get_courses():
    return jsonify(courses), 200

@app.route("/student_courses/<int:student_id>", methods=["GET"])
def get_student_courses(student_id):
    for student in students:
        if student["id"] == student_id:
            return jsonify(student["enrolled_courses"]), 200
    return jsonify([]), 200

@app.route('/fetch_courses', methods=['GET'])
def fetch_courses():
    try:
        with open('courses.json', 'r') as file:
            courses = json.load(file)
        return jsonify(courses), 200
    except FileNotFoundError:
        return jsonify({"error": "courses.json not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding courses.json"}), 500
    
@app.route('/fetch_testimonials', methods=['GET'])
def fetch_testimonials():
    try:
        with open('testimonials.json', 'r') as file:
            testimonials = json.load(file)
        return jsonify(testimonials), 200
    except FileNotFoundError:
        return jsonify({"error": "testimonials.json not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding testimonials.json"}), 500


if __name__ == "__main__":
    app.run(debug=True)