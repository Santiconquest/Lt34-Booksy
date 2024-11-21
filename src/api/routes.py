"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Critico, Book, Lector, Review
from api.models import db, User, Critico, Book, Lector, Category, Autor, BooksyAdmin, Book_Category, FavoriteBook, WishlistBook,Chat,  Message
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import boto3 
from botocore.exceptions import NoCredentialsError

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

import os
import openai
from dotenv import load_dotenv
load_dotenv()  # Cargar las variables de entorno del archivo .env

# Establecer tu clave de API de OpenAI desde la variable de entorno


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

    #
    nuevo_critico = Critico(
        nombre=body['nombre'],
        apellido=body['apellido'],
        genero=body['genero'],
        acerca_de_mi=body['acerca_de_mi'],
        email=body['email'],
        password=body['password'],
        images=body.get('images', "default_image.jpg") 
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

@api.route('/critico/<int:id>', methods=['PUT'])
def update_critico(id):
    body = request.get_json()

    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400

    
    critico = Critico.query.get(id)
    if not critico:
        return jsonify({"msg": "Crítico no encontrado"}), 404

    if 'nombre' in body:
        critico.nombre = body['nombre']
    if 'apellido' in body:
        critico.apellido = body['apellido']
    if 'genero' in body:
        critico.genero = body['genero']
    if 'acerca_de_mi' in body:
        critico.acerca_de_mi = body['acerca_de_mi']
    if 'email' in body:
        critico.email = body['email']
    if 'password' in body:
        critico.password = body['password']
    if 'images' in body:
        critico.images = body['images']
    
    try:
        db.session.commit() 
    except Exception as e:
        return jsonify({"msg": "Error al actualizar el crítico"}), 500

    response_body = {
        "msg": "Crítico actualizado exitosamente",
        "critico": critico.serialize()
    }
    
    return jsonify(response_body), 200

 

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
    return jsonify(access_token=access_token, id=user.id)


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

    required_fields = ['titulo', 'cantidad_paginas', 'genero', 'year', 'autor', 'cover','book_categories']
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
        db.session.refresh(nuevo_libro)

        for category_id in body['book_categories']:
            new_book_category = Book_Category(book_id=nuevo_libro.id,category_id=category_id)
            db.session.add(new_book_category)
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

    required_fields = ['name', 'lastname', 'email', 'password']
    missing_fields = [field for field in required_fields if field not in body]
    if missing_fields:
        return jsonify({"msg": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    nuevo_lector = Lector(
    name=body['name'],
    lastname=body['lastname'],
    email=body['email'],
    password=body['password'],
    images=body.get('images', "default_image.jpg")
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

    # Verificar si se ha proporcionado información
    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400

    # Buscar el lector por ID
    reader = Lector.query.get(lector_id)
    if not reader:
        return jsonify({"msg": "Lector no encontrado"}), 404

    # Actualizar campos si están presentes en el cuerpo de la solicitud
    if 'name' in body:
        reader.name = body['name']
    if 'lastname' in body:
        reader.lastname = body['lastname']
    if 'email' in body:
        reader.email = body['email']
    if 'password' in body:
        reader.password = body['password']
    if 'images' in body:
        reader.images = body['images']

    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Error al actualizar el lector", "error": str(e)}), 500

    response_body = {
        "msg": "Lector actualizado exitosamente",
        "lector": reader.serialize()
    }
    
    return jsonify(response_body), 200


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

@api.route('/lector/<int:lector_id>', methods=['GET'])
def get_lector_by_id(lector_id):
    lector = Lector.query.get(lector_id)
    
    if lector is None:
        return jsonify({"error": "Lector no encontrado"}), 404
    
    return jsonify(lector.serialize()), 200

@api.route('/critico/<int:critico_id>', methods=['GET'])
def get_critico_by_id(critico_id):
    critico = Critico.query.get(critico_id)
    
    if critico is None:
        return jsonify({"error": "Lector no encontrado"}), 404
    
    return jsonify(critico.serialize()), 200


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
        "access_token": access_token,
        "id": lector.id, 
        "name": lector.name  
    }

    return jsonify(response_body), 200

@api.route('/lector/<int:lector_id>/favorites/<int:book_id>', methods=['POST'])
def add_favorite(lector_id, book_id):
    
    lector = Lector.query.get(lector_id)
    book = Book.query.get(book_id)

    if lector is None:
        return jsonify({"msg": "Lector no encontrado"}), 404
    if book is None:
        return jsonify({"msg": "Libro no encontrado"}), 404

    new_favorite = FavoriteBook(lector_id=lector_id, book_id=book_id)
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"msg": "Libro agregado a favoritos"}), 201

@api.route('/lector/<int:lector_id>/favorites', methods=['GET'])
def get_favorites(lector_id):
    
    lector = Lector.query.get(lector_id)
    if lector is None:
        return jsonify({"msg": "Lector no encontrado"}), 404

    
    favorites = FavoriteBook.query.filter_by(lector_id=lector_id).all()
    
    
    favorite_books = []
    for fav in favorites:
        favorite_books.append({
            "book_id": fav.book_id,
            "titulo": fav.book.titulo,  
            "autor": fav.book.autor,   
            "genero": fav.book.genero   
        })

    return jsonify(favorite_books), 200



@api.route('/lector/<int:lector_id>/favorites/<int:book_id>', methods=['DELETE'])
def remove_favorite(lector_id, book_id):
    favorite = FavoriteBook.query.filter_by(lector_id=lector_id, book_id=book_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"msg": "Libro eliminado de favoritos"}), 200
    return jsonify({"msg": "Favorito no encontrado"}), 404

openai.api_key = "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"

@api.route('/lector/<int:lector_id>/recommendations', methods=['POST'])
def get_recommendations(lector_id):
    
    favorites = FavoriteBook.query.filter_by(lector_id=lector_id).all()
    favorite_books = [
        {
            "book_id": fav.book_id,
            "titulo": fav.book.titulo,
            "autor": fav.book.autor,
            "genero": fav.book.genero
        }
        for fav in favorites
    ]

    if not favorite_books:
        return jsonify({"msg": "No hay libros favoritos para recomendar."}), 400

    favorite_titles = ', '.join([f"{book['titulo']} de {book['autor']}, genero {book['genero']}" for book in favorite_books])
    prompt = f"Basado en los siguientes libros favoritos: {favorite_titles}, recomiéndame dos libros similares y uno diferente, y explica por qué es una buena opción. Asegúrate de dar respuestas concisas. No los enumeres"

    try:
       
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=300  
        )

        recommendations = response['choices'][0]['message']['content'].strip()

        recommendations = recommendations.replace("Basándome en tus libros favoritos, te recomendaría los siguientes libros:", "").strip()
        
        recommendations = recommendations.lstrip("0123456789.").strip()

        return jsonify({"recommendation": recommendations}), 200

    except openai.error.OpenAIError as e:
        return jsonify({"msg": "Error al obtener recomendaciones.", "error": str(e)}), 500
    
    

@api.route('/lector/<int:lector_id>/wishlist/<int:book_id>', methods=['POST'])
def add_wishlist(lector_id, book_id):
    lector = Lector.query.get(lector_id)
    book = Book.query.get(book_id)

    if lector is None:
        return jsonify({"msg": "Lector no encontrado"}), 404
    if book is None:
        return jsonify({"msg": "Libro no encontrado"}), 404

    new_wishlist_item = WishlistBook(lector_id=lector_id, book_id=book_id)
    db.session.add(new_wishlist_item)
    db.session.commit()
    return jsonify({"msg": "Libro agregado a la wishlist"}), 201



@api.route('/lector/<int:lector_id>/wishlist', methods=['GET'])
def get_wishlist(lector_id):
    # Verificar si el lector existe
    lector = Lector.query.get(lector_id)
    if lector is None:
        return jsonify({"msg": "Lector no encontrado"}), 404

    # Obtener los libros de la wishlist del lector
    wishlist_items = WishlistBook.query.filter_by(lector_id=lector_id).all()
    
    # Preparar la respuesta con la lista de libros en la wishlist
    wishlist_books = []
    for item in wishlist_items:
        wishlist_books.append({
            "book_id": item.book_id,
            "titulo": item.book.titulo,  
            "autor": item.book.autor      
        })

    return jsonify(wishlist_books), 200



@api.route('/lector/<int:lector_id>/wishlist/<int:book_id>', methods=['DELETE'])
def remove_from_wishlist(lector_id, book_id):
    wishlist_item = WishlistBook.query.filter_by(lector_id=lector_id, book_id=book_id).first()
    if wishlist_item:
        db.session.delete(wishlist_item)
        db.session.commit()
        return jsonify({"msg": "Libro eliminado de la wishlist"}), 200
    return jsonify({"msg": "Libro no encontrado en la wishlist"}), 404



@api.route('/reviews', methods=['GET'])
def get_reviews():

    all_reviews = Review.query.all()
    results = list(map(lambda review: review.serialize(), all_reviews))
    

    return jsonify(results), 200


@api.route('/reviews', methods=['POST'])
def add_review():
    body = request.get_json()  

    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400

    required_fields = ['id_critico', 'id_book', 'comentario']
    missing_fields = [field for field in required_fields if field not in body]
    if missing_fields:
        return jsonify({"msg": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    nueva_review = Review(
        id_critico=body['id_critico'],
        id_book=body['id_book'],
        comentario=body['comentario'],
    )

    try:
        db.session.add(nueva_review)
        db.session.commit() 
    except Exception as e:
        return jsonify({"msg": "Error al crear la reseña"}), 500

    response_body = {
        "msg": "Reseña creada exitosamente",
        "review": nueva_review.serialize() 
    }
    
    return jsonify(response_body), 201

@api.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    review = Review.query.filter_by(id=review_id).first()
    
    if review is None:
        return jsonify({"error": "Reseña no encontrada"}), 404
    
    db.session.delete(review)
    db.session.commit()
    
    return jsonify({"msg": "Reseña eliminada exitosamente"}), 200


@api.route('/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    body = request.get_json()
    review = Review.query.get(review_id)
    
    if review is None:
        return jsonify({"error": "Reseña no encontrada"}), 404

    # Actualizar campos de la reseña
    review.comentario = body.get('comentario', review.comentario)
    
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Error al actualizar la reseña"}), 500

    response_body = {
        "msg": "Reseña actualizada exitosamente",
        "review": review.serialize()
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
        "category": new_category.serialize() 
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

@api.route('/autor', methods=['GET'])
def get_autor():

    all_autores = Autor.query.all()
    results = list(map(lambda autor: autor.serialize(), all_autores))
    

    return jsonify(results), 200

@api.route('/autor', methods=['POST'])
def add_autor():

    body = request.get_json()
    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400
    new_autor = Autor(
        name= body['name']
    )
    
    try:
        db.session.add(new_autor)
        db.session.commit() 
    except Exception as e:
        return jsonify({"msg": "Este Autor ya fue creado"}), 500

    response_body = {
        "msg": "Autor creada exitosamente",
        "autor": new_autor.serialize() 
    }
    
    return jsonify(response_body), 201  

@api.route('/autor/<int:autor_id>', methods=['DELETE'])
def delete_autor(autor_id):
    autor = Autor.query.filter_by(id=autor_id).first()
    
    if autor is None:
        return jsonify({"error": "Autor no encontrado"}), 404
    
    
    db.session.delete(autor)
    db.session.commit()

    response_body={
        "msg": "Se elimino autor"
    }

    return jsonify(response_body), 200

@api.route('/autor/<int:autor_id>', methods=['PUT'])
def edit_autor(autor_id):
    body = request.get_json()
    autor = Autor.query.get(autor_id)

    if not autor:
        return jsonify({"error": "autor is required"}),400
    
    if 'name' not in body or body['name']=="":
        return jsonify({"error": "name is required"}),400
    
    autor.name=body['name']
   

    db.session.commit()
    return jsonify({
        "msg": "Autor actualizado exitosamente",
        "autor": autor.serialize()
    }), 200

@api.route('/booksyAdmin', methods=['GET'])
def get_administrador():

    all_admins = BooksyAdmin.query.all()
    results = list(map(lambda booksyAdmin: booksyAdmin.serialize(), all_admins))

    return jsonify(results), 200

@api.route('/booksyAdmin', methods=['POST'])
def add_administrador():

    body = request.get_json()
    if not body:
        return jsonify({"msg": "No se proporcionó información"}), 400
    
    new_administrador = BooksyAdmin(
        name= body['name'],
        lastname=body['lastName'],
        email=body['email'],
        password=body['password']
    )
    
    try:
        db.session.add(new_administrador)
        db.session.commit() 
    except Exception as e:
        return jsonify({"msg": "Este Administrador ya fue creado"}), 500

    response_body = {
        "msg": "Administrador creada exitosamente",
        "category": new_administrador.serialize() 
    }
    
    return jsonify(response_body), 201  

@api.route('/booksyAdmin/<int:booksyAdmin_id>', methods=['DELETE'])
def delete_administrador(booksyAdmin_id):
    administrador = BooksyAdmin.query.filter_by(id=booksyAdmin_id).first()
    
    if administrador is None:
        return jsonify({"error": "Administrador no encontrado"}), 404
    
    
    db.session.delete(administrador)
    db.session.commit()

    response_body={
        "msg": "Se elimino adminisitrador"
    }

    return jsonify(response_body), 200

@api.route('/booksyAdmin/<int:booksyAdmin_id>', methods=['PUT'])
def edit_administrador(booksyAdmin_id):
    body = request.get_json()
    administrador = BooksyAdmin.query.get(booksyAdmin_id)

    if not administrador:
        return jsonify({"error": "administrador is required"}),400
    
    administrador.name=body['name'],
    administrador.lastname=body['lastname'],
    administrador.email=body['email'],
    administrador.password=body['password']


    db.session.commit()
    return jsonify({
        "msg": "Administrador actualizado exitosamente",
        "administrador": administrador.serialize()
    }), 200


@api.route("/loginAdmin", methods=["POST"])
def login_admin():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    admin = BooksyAdmin.query.filter_by(email=email).first()

    if admin is None:
        return jsonify({"msg": "Could not find your email"}), 401

    if email != admin.email or password != admin.password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)

    return jsonify(access_token=access_token, id=admin.id), 200


@api.route('/chat', methods=['GET'])
def get_chats():
    all_chats = Chat.query.all()
    results = list(map(lambda chat: chat.serialize(), all_chats))
    return jsonify(results), 200

@api.route('/chat/<int:chat_id>', methods=['GET'])
def get_chat_by_id(chat_id):
    chat = Chat.query.get(chat_id)
    
    if chat is None:
        return jsonify({"error": "chat no encontrado"}), 404
    
    return jsonify(chat.serialize()), 200

@api.route('/chat', methods=['POST'])
def add_chat():
    body = request.get_json()

    if not body or 'id_lector_1' not in body or 'id_lector_2' not in body:
        return jsonify({"msg": "Faltan campos requeridos"}), 400

    new_chat = Chat(
        id_lector_1=body['id_lector_1'],
        id_lector_2=body['id_lector_2']
    )

    try:
        db.session.add(new_chat)
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Error al crear el chat"}), 500

    return jsonify({"msg": "Chat creado exitosamente", "chat": new_chat.serialize()}), 201

@api.route('/chat/<int:id>', methods=['PUT'])
def update_chat(id):
    body = request.get_json()
    chat = Chat.query.get(id)

    if not chat:
        return jsonify({"msg": "Chat no encontrado"}), 404

    if 'id_lector_1' in body:
        chat.id_lector_1 = body['id_lector_1']
    if 'id_lector_2' in body:
        chat.id_lector_2 = body['id_lector_2']

    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Error al actualizar el chat"}), 500

    return jsonify({"msg": "Chat actualizado exitosamente", "chat": chat.serialize()}), 200

@api.route('/chat/<int:id>', methods=['DELETE'])
def delete_chat(id):
    chat = Chat.query.get(id)

    if not chat:
        return jsonify({"msg": "Chat no encontrado"}), 404

    db.session.delete(chat)
    db.session.commit()
    return jsonify({"msg": "Chat eliminado exitosamente"}), 200


@api.route('/message', methods=['GET'])
def get_messages():
    chat_id = request.args.get('chat_id', type=int)
    
    if chat_id:
        messages = Message.query.filter_by(chat_id=chat_id).all()
    else:
        messages = Message.query.all()
    
    results = [message.serialize() for message in messages]
    return jsonify(results), 200

@api.route('/message/chat/<int:chat_id>', methods=['GET'])
def get_messages_by_chat_id(chat_id):
    messages = Message.query.filter_by(chat_id=chat_id).all()

    if not messages:
        return jsonify({"error": "No messages found for this chat"}), 404

    results = [message.serialize() for message in messages]
    
    return jsonify(results), 200



@api.route('/message', methods=['POST'])
def add_message():
    body = request.get_json()

    required_fields = ['id_lector_1', 'id_lector_2', 'chat_id', 'origin', 'message', 'date', 'hour']
    missing_fields = [field for field in required_fields if field not in body]
    if missing_fields:
        return jsonify({"msg": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    new_message = Message(
        id_lector_1=body['id_lector_1'],
        id_lector_2=body['id_lector_2'],
        chat_id=body['chat_id'],
        origin=body['origin'],
        message=body['message'],
        date=body['date'],
        hour=body['hour']
    )

    try:
        db.session.add(new_message)
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Error al crear el mensaje"}), 500

    return jsonify({"msg": "Mensaje creado exitosamente", "message": new_message.serialize()}), 201

@api.route('/message/<int:id>', methods=['PUT'])
def update_message(id):
    body = request.get_json()
    message = Message.query.get(id)

    if not message:
        return jsonify({"msg": "Mensaje no encontrado"}), 404

    if 'message' in body:
        message.message = body['message']
    if 'date' in body:
        message.date = body['date']
    if 'hour' in body:
        message.hour = body['hour']

    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Error al actualizar el mensaje"}), 500

    return jsonify({"msg": "Mensaje actualizado exitosamente", "message": message.serialize()}), 200

@api.route('/message/<int:id>', methods=['DELETE'])
def delete_message(id):
    message = Message.query.get(id)

    if not message:
        return jsonify({"msg": "Mensaje no encontrado"}), 404

    db.session.delete(message)
    db.session.commit()
    return jsonify({"msg": "Mensaje eliminado exitosamente"}), 200

