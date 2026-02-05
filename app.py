from flask import Flask, request, send_file
from flask_cors import CORS
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
import io
import textwrap
import urllib.parse # Necessário para criar o link do YouTube

app = Flask(__name__)
CORS(app)

# --- CORES E CONFIGURAÇÕES ---
COR_PRIMARIA = HexColor("#B91C1C") # Vermelho Marca
COR_SECUNDARIA = HexColor("#F3F4F6") # Cinza Fundo
COR_TEXTO = HexColor("#1F2937")

def draw_header(c, width, height, nome_aluno):
    """Desenha o cabeçalho padrão em todas as páginas"""
    # Fundo
    c.setFillColor(COR_SECUNDARIA)
    c.rect(0, height - 120, width, 120, fill=1, stroke=0)
    
    # Texto
    c.setFillColor(COR_PRIMARIA)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(40, height - 50, "PLANEJAMENTO DE TREINO")
    
    c.setFillColor(COR_TEXTO)
    c.setFont("Helvetica", 12)
    c.drawString(40, height - 80, f"Aluno(a): {nome_aluno}")
    c.drawString(40, height - 100, "Consultoria Online - Felipe Ferreira")
    
    # Linha decorativa
    c.setStrokeColor(COR_PRIMARIA)
    c.setLineWidth(3)
    c.line(30, height - 120, 30, height)

def draw_glossary(c, width, height):
    """Cria a página de Legenda Técnica no final"""
    c.showPage() # Força nova página
    draw_header(c, width, height, "GUIA TÉCNICO") # Cabeçalho diferente
    
    y = height - 150
    x = 50
    
    # Título da Seção
    c.setFillColor(COR_PRIMARIA)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(x, y, "ENTENDENDO SUA FICHA")
    y -= 30
    
    # Lista de Termos
    termos = [
        ("RIR (Repetições na Reserva)", "Significa quantas repetições você 'sobraria' antes de falhar. RIR 2 = Pare quando sentir que só aguentaria fazer mais 2 movimentos perfeitos."),
        ("FALHA CONCÊNTRICA", "Fazer o exercício até não conseguir mais subir o peso, mantendo a postura correta."),
        ("CADÊNCIA (Ex: 2-0-1 ou 3010)", "É a velocidade do movimento. O primeiro número é a descida (fase excêntrica), o segundo é a pausa embaixo, o terceiro é a subida (fase concêntrica). Ex: 3s descendo, 0s pausa, 1s subindo."),
        ("DROP-SET", "Técnica onde você faz a série até a falha, reduz o peso em 20-30% imediatamente e continua fazendo mais repetições sem descanso."),
        ("REST-PAUSE", "Faça a série até a falha, descanse apenas 10 a 15 segundos e tente fazer mais algumas repetições com o mesmo peso."),
        ("AQUECIMENTO", "Séries leves antes do treino 'real' para preparar a articulação. Não conte como série válida de trabalho.")
    ]
    
    for titulo, desc in termos:
        # Título do Termo
        c.setFillColor(COR_TEXTO)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(x, y, f"• {titulo}")
        y -= 15
        
        # Descrição
        c.setFont("Helvetica", 10)
        c.setFillColor(HexColor("#4B5563")) # Cinza mais suave
        wrapped_lines = textwrap.wrap(desc, width=80)
        for line in wrapped_lines:
            c.drawString(x + 15, y, line)
            y -= 14
        
        y -= 15 # Espaço entre termos

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

            # --- BLOCOS DE TÍTULO (TREINO A, B...) ---
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

            # --- EXERCÍCIOS (LINHAS COMEÇANDO COM NÚMERO) ---
            elif linha[0].isdigit() and "." in linha[:3]:
                y -= 15
                c.setFont("Helvetica-Bold", 11)
                
                # Desenha o nome do exercício
                c.drawString(x, y, linha)
                
                # --- LÓGICA DO LINK YOUTUBE ---
                # 1. Extrai o nome do exercício (Tira "1." e tira as repetições do final se der)
                # Ex: "1. Agachamento Livre - 4x10" vira "Agachamento Livre"
                nome_exercicio = linha.split('-')[0].replace('.', '').strip()
                if len(nome_exercicio) > 2: # Segurança para não pegar lixo
                    nome_exercicio = ''.join([i for i in nome_exercicio if not i.isdigit()]).strip()
                    
                    # 2. Cria a URL de Busca
                    termo_busca = urllib.parse.quote(f"execução correta {nome_exercicio}")
                    link_yt = f"https://www.youtube.com/results?search_query={termo_busca}"
                    
                    # 3. Desenha o texto "VER VÍDEO"
                    txt_video = "▶ VER VÍDEO"
                    c.setFillColor(HexColor("#FF0000"))
                    c.setFont("Helvetica-Bold", 8)
                    pos_x_video = width - 120
                    c.drawString(pos_x_video, y, txt_video)
                    
                    # 4. Cria a "Zona Clicável" (Link) invisível sobre o texto
                    # Rect = (x1, y1, x2, y2) -> Coordenadas da caixa clicável
                    c.linkURL(link_yt, (pos_x_video, y, pos_x_video + 60, y + 10))
                    
                    c.setFillColor(COR_TEXTO) # Volta para preto

                c.setFont("Helvetica", 10) 
                
                c.setStrokeColor(HexColor("#E5E7EB"))
                c.setLineWidth(1)
                c.line(x, y - 5, width - margem_direita, y - 5)
                y -= 5

            # --- TEXTO COMUM (OBS, CARDIO, ETC) ---
            else:
                c.setFont("Helvetica", 10)
                wrapped_lines = textwrap.wrap(linha, width=85)
                for w_line in wrapped_lines:
                    y -= 14
                    c.drawString(x, y, w_line)

            # --- PAGINAÇÃO ---
            if y < 50:
                c.showPage()
                draw_header(c, width, height, nome_aluno)
                y = height - 150
                c.setFont("Helvetica", 11)

        # --- FIM DO LOOP: DESENHA O GLOSSÁRIO ---
        draw_glossary(c, width, height)

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