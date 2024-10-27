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
            "cover": self.cover
        }

class Lector(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    lastname = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    suscription_date = db.Column(db.String(120), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
  


    def __repr__(self):
        return '<Usuario %r>' % self.email

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "lastname": self.lastname,
            "suscription_date": self.suscription_date,
            "active": self.is_active,
            # do not serialize the password, its a security breach
        }


class Review(db.Model):
    __tablename__ = 'review' 
    id = db.Column(db.Integer, primary_key=True)
    id_critico = db.Column(db.Integer, db.ForeignKey('critico.id'), nullable=True)  
    id_book = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)     
    comentario = db.Column(db.String(255), nullable=False)

    # Definir la relación con Critico
    critico = db.relationship('Critico', backref=db.backref('reviews', lazy=True))

    # Se puede omitir email_critico, ya que se puede acceder a través de la relación
    def __repr__(self):
        return f'<Review {self.comentario}>'

    def serialize(self):
        return {
            "id": self.id,
            "id_critico": self.id_critico,
            "email_critico": self.critico.email if self.critico else None,
            "comentario": self.comentario,
        }
