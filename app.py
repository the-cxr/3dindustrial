from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# ADICIONE ESTA LINHA ABAIXO PARA A SEGURANÇA FUNCIONAR:
from werkzeug.security import generate_password_hash, check_password_hash

@app.route('/')
def home():
    return render_template('index.html')

app = Flask(__name__)
CORS(app) 

# 1. Configuração do Banco de Dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 2. Definindo o 'db'
db = SQLAlchemy(app)

# 3. Modelo do Usuário
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    senha = db.Column(db.String(200))

# 4. Criar o banco de dados automaticamente
with app.app_context():
    db.create_all()

@app.route('/registrar', methods=['POST'])
def registrar():
    data = request.json
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    if not nome or not email or not senha:
        return jsonify({"message": "Erro: Preencha todos os campos."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Erro: Este e-mail já está cadastrado."}), 400
    
    # Gerando a senha protegida
    senha_hash = generate_password_hash(senha, method='pbkdf2:sha256')
    novo_usuario = User(nome=nome, email=email, senha=senha_hash)
    
    try:
        db.session.add(novo_usuario)
        db.session.commit()
        return jsonify({"message": "Conta criada com sucesso!"}), 201
    except Exception as e:
        return jsonify({"message": f"Erro ao salvar no banco: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    usuario = User.query.filter_by(email=data.get('email')).first()
    
    if usuario and check_password_hash(usuario.senha, data.get('senha')):
        return jsonify({"message": "Login realizado!", "user": usuario.nome}), 200
    
    return jsonify({"message": "E-mail ou senha incorretos."}), 401

if __name__ == '__main__':
    app.run(debug=True)