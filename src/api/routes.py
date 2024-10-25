"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Critico, Book, Lector, Category
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/critico', methods=['GET'])
def get_critico():

    all_critico = Critico.query.all()
    results = list(map(lambda critical: critical.serialize(), all_critico))
    

    return jsonify(results), 200


@api.route('/critico', methods=['POST'])
def add_critico():
    body = request.get_json()  

    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400

    required_fields = ['nombre', 'apellido', 'genero', 'acerca_de_mi', 'email', 'password']
    missing_fields = [field for field in required_fields if field not in body]
    if missing_fields:
        return jsonify({"msg": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    nuevo_critico = Critico(
        nombre=body['nombre'],
        apellido=body['apellido'],
        genero=body['genero'],
        acerca_de_mi=body['acerca_de_mi'],
        email=body['email'],
        password=body['password'], 
        
    )

    try:
        db.session.add(nuevo_critico)
        db.session.commit() 
    except Exception as e:
        return jsonify({"msg": "Este Critico ya fue creado"}), 500

    response_body = {
        "msg": "Crítico creado exitosamente",
        "critico": nuevo_critico.serialize() 
    }
    
    return jsonify(response_body), 201  

@api.route('/critico/<int:critico_id>', methods=['DELETE'])
def delete_critico(critico_id):
    critico = Critico.query.filter_by(id=critico_id).first()
    
    if critico is None:
        return jsonify({"error": "Crítico no encontrado"}), 404
    
    critico_data = critico.serialize()
    db.session.delete(critico)
    db.session.commit()
    return jsonify(critico_data), 200

@api.route("/loginCritico", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = Critico.query.filter_by(email=email).first()

    if user == None:
        return jsonify({"msg": "Could not find you email"}), 401

    if email != user.email or password != user.password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)


@api.route('/book', methods=['GET'])
def get_books():
    all_books = Book.query.all()
    results = list(map(lambda book: book.serialize(), all_books))
    return jsonify(results), 200

@api.route('/book', methods=['POST'])
def add_book():
    body = request.get_json()  

    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400

    required_fields = ['titulo', 'cantidad_paginas', 'genero', 'year', 'autor', 'cover']
    missing_fields = [field for field in required_fields if field not in body]
    if missing_fields:
        return jsonify({"msg": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    nuevo_libro = Book(
        titulo=body['titulo'],
        cantidad_paginas=body['cantidad_paginas'],
        genero=body['genero'],
        year=body['year'],
        autor=body['autor'],
        cover=body['cover']
    )

    try:
        db.session.add(nuevo_libro)
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Error al crear el libro"}), 500

    return jsonify({"msg": "Libro creado exitosamente", "book": nuevo_libro.serialize()}), 201  

@api.route('/book/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    body = request.get_json()
    book = Book.query.get(book_id)

    if book is None:
        return jsonify({"msg": "Libro no encontrado"}), 404

    for key, value in body.items():
        setattr(book, key, value)

    db.session.commit()
    return jsonify({"msg": "Libro actualizado exitosamente", "book": book.serialize()}), 200

@api.route('/book/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get(book_id)
    if book is None:
        return jsonify({"msg": "Libro no encontrado"}), 404
    return jsonify({"book": book.serialize()}), 200



@api.route('/book/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.filter_by(id=book_id).first()

    if book is None:
        return jsonify({"error": "Libro no encontrado"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"msg": "Libro eliminado exitosamente"}), 200

@api.route('/lector', methods=['GET'])
def get_lector():

    all_lector = Lector.query.all()
    results = list(map(lambda reader: reader.serialize(), all_lector))
    

    return jsonify(results), 200

@api.route('/signupLector', methods=['POST'])
def add_lector():
    body = request.get_json()  

    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400

    required_fields = ['name', 'lastname', 'email', 'password', 'suscription_date', 'is_active']
    missing_fields = [field for field in required_fields if field not in body]
    if missing_fields:
        return jsonify({"msg": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    nuevo_lector = Lector(
        name=body['name'],
        lastname=body['lastname'],
        email=body['email'],
        password=body['password'], 
        suscription_date=body['suscription_date'],
        is_active=body['is_active']
    )

    try:
        db.session.add(nuevo_lector)
        db.session.commit() 
    except Exception as e:
        return jsonify({"msg": "Este Lector ya fue creado"}), 500

    response_body = {
        "msg": "Lector creado exitosamente",
        "lector": nuevo_lector.serialize() 
    }
    
    return jsonify(response_body), 201  

@api.route('/lector/<int:lector_id>', methods=['PUT'])
def edit_lector(lector_id):
    body = request.get_json()
    reader = Lector.query.get(lector_id)

    if not lector_id or lector_id=="":
        return jsonify({"error": "lector_id is required"}),400
    
    lector_actualizado = Lector(
    name=body['name'],
    lastname=body['lastname'],
    email=body['email'],
    password=body['password'], 
    suscription_date=body['suscription_date'],
    is_active=body['is_active']
    )

    db.session.commit()
    return jsonify({
        "msg": "Lector actualizado exitosamente",
          "lector": lector_actualizado.serialize()
    }), 200


@api.route('/lector/<int:lector_id>', methods=['DELETE'])
def delete_lector(lector_id):
    lector = Lector.query.filter_by(id=lector_id).first()
    
    if lector is None:
        return jsonify({"error": "Lector no encontrado"}), 404
    

    
    db.session.delete(lector)
    db.session.commit()

    response_body={
        "msg": "Se elimino lector"
    }

    return jsonify(response_body), 200

@api.route('/loginLector', methods=['POST'])
def login_lector():
    body = request.get_json()

    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400

    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({"msg": "Faltan los campos 'email' o 'password'"}), 400

    lector = Lector.query.filter_by(email=email).first()

    if not lector or lector.password != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=lector.id)

    response_body = {
        "msg": "Inicio de sesión exitoso",
        "access_token": access_token
    }

    return jsonify(response_body), 200


@api.route('/category', methods=['GET'])
def get_category():

    all_categories = Category.query.all()
    results = list(map(lambda category: category.serialize(), all_categories))
    

    return jsonify(results), 200

@api.route('/category', methods=['POST'])
def add_category():

    body = request.get_json()
    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400
    new_category = Category(
        name= body['name']
    )
    
    try:
        db.session.add(new_category)
        db.session.commit() 
    except Exception as e:
        return jsonify({"msg": "Esta Categoria ya fue creada"}), 500

    response_body = {
        "msg": "Categoria creada exitosamente",
        "critico": new_category.serialize() 
    }
    
    return jsonify(response_body), 201  

@api.route('/category/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.filter_by(id=category_id).first()
    
    if category is None:
        return jsonify({"error": "Categoria no encontrada"}), 404
    
    
    db.session.delete(category)
    db.session.commit()

    response_body={
        "msg": "Se elimino categoria"
    }

    return jsonify(response_body), 200

@api.route('/category/<int:category_id>', methods=['PUT'])
def edit_category(category_id):
    body = request.get_json()
    category = Category.query.get(category_id)

    if not category:
        return jsonify({"error": "category is required"}),400
    
    if 'name' not in body or body['name']=="":
        return jsonify({"error": "name is required"}),400
    
    category.name=body['name']
   

    db.session.commit()
    return jsonify({
        "msg": "Categoria actualizado exitosamente",
          "categoria": category.serialize()
    }), 200
