from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    

class Critico(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), unique=True, nullable=False)
    apellido = db.Column(db.String(80), unique=False, nullable=False)
    genero = db.Column(db.String(80), unique=False, nullable=False)
    acerca_de_mi = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
   

    def __repr__(self):
        return '<Critico %r>' % self.email

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "genero": self.genero,
            "acerca_de_mi": self.acerca_de_mi,
            "email": self.email,
           
            # do not serialize the password, its a security breach
        }


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)  
    cantidad_paginas = db.Column(db.Integer, nullable=False)
    genero = db.Column(db.String(80), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    autor = db.Column(db.String(120), nullable=False)
    cover = db.Column(db.String(200), nullable=False)
    book_categories = db.relationship('Book_Category', back_populates='book',lazy=True)

    def __repr__(self):
        return f'<Libro {self.autor} - {self.genero}>'

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "cantidad_paginas": self.cantidad_paginas,
            "genero": self.genero,
            "year": self.year,
            "autor": self.autor,
            "cover": self.cover,
            "categories": [category.serialize() for category in self.book_categories] if len(self.book_categories) > 0 else []
        }

class Lector(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    lastname = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
  


    def __repr__(self):
        return '<Usuario %r>' % self.email

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "lastname": self.lastname
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    book_categories = db.relationship('Book_Category', back_populates='category',lazy=True)

    def __repr__(self):
        return '<Category %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            # do not serialize the password, its a security breach
        }

class Book_Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)  
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)  
    book = db.relationship(Book)
    category = db.relationship(Category)

    def __repr__(self):
        return '<Book_Category %r>' % self.name

    def serialize(self):
        return self.category.serialize()

class Autor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)


    def __repr__(self):
        return '<Autor %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            # do not serialize the password, its a security breach
        }

class BooksyAdmin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    lastname = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
  


    def __repr__(self):
        return '<BooksyAdmin %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "lastname": self.lastname
        }