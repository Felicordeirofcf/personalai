from flask import Flask, request, send_file
from flask_cors import CORS  # <--- IMPORTANTE: Importar o CORS
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, black, white
import io
import textwrap

app = Flask(__name__)
CORS(app) # <--- IMPORTANTE: Isso libera o acesso para o seu site

# Configurações de Cores
COR_PRIMARIA = HexColor("#B91C1C") 
COR_SECUNDARIA = HexColor("#F3F4F6") 
COR_TEXTO = HexColor("#1F2937")

def draw_header(c, width, height, nome_aluno):
    # Fundo do Header
    c.setFillColor(COR_SECUNDARIA)
    c.rect(0, height - 120, width, 120, fill=1, stroke=0)
    
    # Texto do Header
    c.setFillColor(COR_PRIMARIA)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(40, height - 50, "PLANEJAMENTO DE TREINO")
    
    c.setFillColor(COR_TEXTO)
    c.setFont("Helvetica", 12)
    c.drawString(40, height - 80, f"Aluno(a): {nome_aluno}")
    c.drawString(40, height - 100, "Consultoria Online - Felipe Ferreira")
    
    c.setStrokeColor(COR_PRIMARIA)
    c.setLineWidth(3)
    c.line(30, height - 120, 30, height) 

@app.route('/api/gerar-pdf', methods=['POST'])
def gerar_pdf():
    try:
        data = request.json
        nome_aluno = data.get('nome', 'Aluno')
        texto_treino = data.get('treino', '')

        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        draw_header(c, width, height, nome_aluno)

        y = height - 160
        x = 50
        margem_direita = 50
        largura_util = width - (x + margem_direita)
        
        c.setFont("Helvetica", 11)
        c.setFillColor(COR_TEXTO)

        linhas = texto_treino.split('\n')
        
        for linha in linhas:
            linha = linha.strip()
            if not linha: continue

            # 1. Se for Título de Treino (### Treino A...)
            if "###" in linha or "Treino " in linha[:7]: 
                y -= 30 
                c.setFillColor(COR_PRIMARIA)
                c.rect(x - 10, y - 8, largura_util + 20, 25, fill=True, stroke=False)
                
                c.setFillColor(white)
                c.setFont("Helvetica-Bold", 14)
                texto_limpo = linha.replace("#", "").upper().strip()
                c.drawString(x, y, texto_limpo)
                
                c.setFillColor(COR_TEXTO)
                c.setFont("Helvetica", 11)
                y -= 25

            # 2. Se for Nome do Exercício
            elif linha[0].isdigit() and "." in linha[:3]:
                y -= 15
                c.setFont("Helvetica-Bold", 11)
                
                if c.stringWidth(linha, "Helvetica-Bold", 11) > largura_util - 70:
                    c.drawString(x, y, linha)
                else:
                    c.drawString(x, y, linha)
                    c.setFillColor(HexColor("#FF0000"))
                    c.setFont("Helvetica-Bold", 8)
                    c.drawString(width - 120, y, "▶ VER VÍDEO")
                    c.setFillColor(COR_TEXTO)

                c.setFont("Helvetica", 10) 
                
                c.setStrokeColor(HexColor("#E5E7EB"))
                c.setLineWidth(1)
                c.line(x, y - 5, width - margem_direita, y - 5)
                y -= 5

            # 3. Texto Normal
            else:
                c.setFont("Helvetica", 10)
                wrapped_lines = textwrap.wrap(linha, width=85)
                for w_line in wrapped_lines:
                    y -= 14
                    c.drawString(x, y, w_line)

            if y < 50:
                c.showPage()
                draw_header(c, width, height, nome_aluno)
                y = height - 150
                c.setFont("Helvetica", 11)

        c.save()
        buffer.seek(0)
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"Treino_{nome_aluno.replace(' ', '_')}.pdf",
            mimetype='application/pdf'
        )

    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    # O Render usa a variável PORT, mas localmente usamos 5000
    app.run(host='0.0.0.0', port=5000)