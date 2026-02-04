from flask import Flask, request, send_file
from flask_cors import CORS
from services.pdf_service import gerar_pdf_treino
import os

app = Flask(__name__)
CORS(app) # Permite que seu Next.js (localhost:3000) fale com o Python (localhost:5000)

@app.route('/api/gerar-pdf', methods=['POST'])
def gerar_pdf():
    dados = request.json
    nome_aluno = dados.get('nome', 'Aluno')
    # Aqui viria o texto da IA (você pode passar do front ou chamar a IA aqui no Python mesmo)
    texto_treino = dados.get('treino', '')

    if not texto_treino:
        return {"erro": "Texto do treino não fornecido"}, 400

    # 1. Gera o PDF usando nossa função
    caminho_arquivo = gerar_pdf_treino(texto_treino, nome_aluno)

    if not caminho_arquivo:
        return {"erro": "Falha ao gerar PDF"}, 500

    # 2. Envia o arquivo de volta para o Next.js
    try:
        return send_file(
            caminho_arquivo,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"Treino_{nome_aluno}.pdf"
        )
    except Exception as e:
        return {"erro": str(e)}, 500

if __name__ == '__main__':
    # Roda o servidor na porta 5000
    app.run(port=5000, debug=True)