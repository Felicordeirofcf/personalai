import os
import re
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa

def gerar_pdf_treino(texto_bruto, nome_aluno):
    # 1. Configura caminhos
    diretorio_base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pasta_templates = os.path.join(diretorio_base, 'templates')
    
    # --- NOVO: Define o caminho absoluto da logo ---
    caminho_logo = os.path.join(diretorio_base, 'assets', 'logo.png')
    
    # Se a imagem não existir, usa uma string vazia para não quebrar o PDF
    if not os.path.exists(caminho_logo):
        print(f"AVISO: Logo não encontrada em {caminho_logo}")
        caminho_logo = "" 
    # -----------------------------------------------

    env = Environment(loader=FileSystemLoader(pasta_templates))
    template = env.get_template('treino_template.html')

    # 2. Processa o texto (Mesma lógica de antes)
    linhas = texto_bruto.split('\n')
    lista_estruturada = []
    texto_intro = ""

    for linha in linhas:
        linha = linha.strip()
        if not linha: continue

        match = re.match(r'^(\d+[\.\)]?)\s*(.*)', linha)

        if match:
            conteudo = match.group(2).replace('**', '')
            nome_busca = conteudo.split('(')[0].split('-')[0].strip()
            link = f"https://www.youtube.com/results?search_query={nome_busca.replace(' ', '+')}+execucao"
            
            lista_estruturada.append({
                "is_exercicio": True,
                "nome": conteudo,
                "detalhes": "Siga as instruções do plano.",
                "link_youtube": link
            })
        else:
            if linha.startswith('#') or "Treino" in linha:
                texto_intro += f"<h3 style='color:#c0392b; margin-top:20px;'>{linha.replace('#', '')}</h3>"
            else:
                texto_intro += f"<p>{linha}</p>"

    # 3. Renderiza HTML (Agora passamos 'logo_path')
    html_content = template.render(
        aluno_nome=nome_aluno,
        data_atual=datetime.now().strftime("%d/%m/%Y"),
        texto_intro=texto_intro,
        lista_exercicios=lista_estruturada,
        logo_path=caminho_logo  # <--- Passando o caminho da imagem aqui
    )

    # 4. Gera o PDF
    nome_arquivo = f"treino_{nome_aluno.replace(' ', '_')}.pdf"
    caminho_final = os.path.join(diretorio_base, nome_arquivo)

    with open(caminho_final, "wb") as pdf_file:
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_file)

    if pisa_status.err:
        print(f"Erro ao gerar PDF: {pisa_status.err}")
        return None
        
    print(f"Gerando PDF em: {caminho_final}")
    return caminho_final