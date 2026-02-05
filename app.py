from flask import Flask, request, send_file
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, black, white, Color
from reportlab.lib.utils import ImageReader
import io
import textwrap

app = Flask(__name__)

# Configurações de Cores
COR_PRIMARIA = HexColor("#B91C1C") # Vermelho Escuro (Identidade Visual)
COR_SECUNDARIA = HexColor("#F3F4F6") # Cinza Claro para fundos
COR_TEXTO = HexColor("#1F2937")

def draw_header(c, width, height, nome_aluno):
    # Fundo do Header
    c.setFillColor(COR_SECUNDARIA)
    c.rect(0, height - 120, width, 120, fill=1, stroke=0)
    
    # Tentar colocar Logo (se tiver url ou arquivo local)
    # c.drawImage("logo.png", 30, height - 100, width=80, height=80, mask='auto')
    
    # Texto do Header
    c.setFillColor(COR_PRIMARIA)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(40, height - 50, "PLANEJAMENTO DE TREINO")
    
    c.setFillColor(COR_TEXTO)
    c.setFont("Helvetica", 12)
    c.drawString(40, height - 80, f"Aluno(a): {nome_aluno}")
    c.drawString(40, height - 100, "Consultoria Online - Felipe Ferreira")
    
    # Linha divisória decorativa
    c.setStrokeColor(COR_PRIMARIA)
    c.setLineWidth(3)
    c.line(30, height - 120, 30, height) # Linha vertical lateral estilo capa

@app.route('/api/gerar-pdf', methods=['POST'])
def gerar_pdf():
    try:
        data = request.json
        nome_aluno = data.get('nome', 'Aluno')
        texto_treino = data.get('treino', '')

        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # Desenha o cabeçalho fixo
        draw_header(c, width, height, nome_aluno)

        # Configurações iniciais de texto
        y = height - 160
        x = 50
        margem_direita = 50
        largura_util = width - (x + margem_direita)
        
        c.setFont("Helvetica", 11)
        c.setFillColor(COR_TEXTO)

        # Processa o texto linha por linha
        linhas = texto_treino.split('\n')
        
        for linha in linhas:
            linha = linha.strip()
            if not linha: continue

            # --- LÓGICA DO LAYOUT ---

            # 1. Se for Título de Treino (### Treino A...)
            if "###" in linha or "Treino " in linha[:7]: 
                y -= 30 # Espaço extra antes do bloco
                
                # Desenha Retângulo de Fundo para o Título
                c.setFillColor(COR_PRIMARIA)
                c.rect(x - 10, y - 8, largura_util + 20, 25, fill=True, stroke=False)
                
                # Texto do Título (Branco)
                c.setFillColor(white)
                c.setFont("Helvetica-Bold", 14)
                texto_limpo = linha.replace("#", "").upper().strip()
                c.drawString(x, y, texto_limpo)
                
                # Reseta cor para o próximo texto
                c.setFillColor(COR_TEXTO)
                c.setFont("Helvetica", 11)
                y -= 25 # Pula linha após o título

            # 2. Se for Nome do Exercício (Começa com número "1.", "2.")
            elif linha[0].isdigit() and "." in linha[:3]:
                y -= 15
                c.setFont("Helvetica-Bold", 11)
                
                # Verifica se cabe na linha
                if c.stringWidth(linha, "Helvetica-Bold", 11) > largura_util - 70:
                    # Se for muito longo, quebra
                    c.drawString(x, y, linha) # Simplificado, ideal seria wrap
                else:
                    c.drawString(x, y, linha)
                    
                    # Adiciona "Botão" Ver Vídeo (Simulado visualmente)
                    c.setFillColor(HexColor("#FF0000"))
                    c.setFont("Helvetica-Bold", 8)
                    c.drawString(width - 120, y, "▶ VER VÍDEO")
                    c.setFillColor(COR_TEXTO) # Volta pro preto

                c.setFont("Helvetica", 10) # Volta fonte normal para obs
                
                # Linha fina separadora embaixo do exercício
                c.setStrokeColor(HexColor("#E5E7EB"))
                c.setLineWidth(1)
                c.line(x, y - 5, width - margem_direita, y - 5)
                y -= 5

            # 3. Texto Normal (Obs, Introdução, Cardio)
            else:
                c.setFont("Helvetica", 10)
                # Quebra de linha automática (Text Wrap)
                wrapped_lines = textwrap.wrap(linha, width=85) # Ajuste 85 chars por linha
                for w_line in wrapped_lines:
                    y -= 14
                    c.drawString(x, y, w_line)

            # --- CONTROLE DE PAGINAÇÃO ---
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
    app.run(host='0.0.0.0', port=5000)