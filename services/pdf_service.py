import os
import re
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa

def gerar_pdf_treino(texto_bruto, nome_aluno):
    # 1. Configura caminhos
    diretorio_base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pasta_templates = os.path.join(diretorio_base, 'templates')
    caminho_logo = os.path.join(diretorio_base, 'assets', 'logo.png')
    
    if not os.path.exists(caminho_logo):
        caminho_logo = "" 

    env = Environment(loader=FileSystemLoader(pasta_templates))
    template = env.get_template('treino_template.html')

    # 2. Processamento "Inteligente" do Texto
    linhas = texto_bruto.split('\n')
    lista_estruturada = []
    texto_intro = ""
    
    # Variável para guardar o exercício que está sendo processado no momento
    exercicio_atual = None

    for linha in linhas:
        linha = linha.strip()
        if not linha: continue

        # Verifica se é um novo exercício (Começa com número: "1. Supino...")
        match = re.match(r'^(\d+[\.\)]?)\s*(.*)', linha)

        if match:
            # Se já tínhamos um exercício aberto, salvamos ele na lista antes de começar o próximo
            if exercicio_atual:
                lista_estruturada.append(exercicio_atual)

            # Prepara o novo exercício
            conteudo = match.group(2).replace('**', '') # Limpa negrito
            
            # Truque para o link do YouTube: Pega só o texto antes de traços ou parênteses
            # Ex: "Supino Reto - 4x10" -> Busca apenas "Supino Reto"
            nome_busca = conteudo.split('-')[0].split('(')[0].strip()
            link = f"https://www.youtube.com/results?search_query={nome_busca.replace(' ', '+')}+execucao"
            
            exercicio_atual = {
                "is_exercicio": True,
                "nome": conteudo,      # O título vai ter "Supino - 4x10" (graças ao prompt)
                "detalhes": "",        # Vamos preencher isso se a IA escrever algo na linha de baixo
                "link_youtube": link
            }
        else:
            # NÃO começa com número. Pode ser Título ou Detalhe.
            if linha.startswith('#') or "Treino" in linha or "Aquecimento" in linha:
                # É um Título (ex: ### Treino A).
                # Se tinha exercício pendente, salva ele.
                if exercicio_atual:
                    lista_estruturada.append(exercicio_atual)
                    exercicio_atual = None
                
                # Adiciona como título na introdução
                texto_intro += f"<h3 style='color:#c0392b; margin-top:15px; border-bottom:1px solid #ddd;'>{linha.replace('#', '')}</h3>"
            
            else:
                # É texto solto. 
                if exercicio_atual:
                    # A MÁGICA: Se já temos um exercício aberto, esse texto vira detalhe dele!
                    # Ex: "Fazer drop-set na última" vira detalhe do exercício acima.
                    exercicio_atual["detalhes"] += f"{linha} <br>"
                else:
                    # Se não tem exercício aberto, é texto de introdução geral
                    texto_intro += f"<p>{linha}</p>"

    # Salva o último exercício que ficou pendente no loop
    if exercicio_atual:
        lista_estruturada.append(exercicio_atual)

    # 3. Renderiza HTML
    html_content = template.render(
        aluno_nome=nome_aluno,
        data_atual=datetime.now().strftime("%d/%m/%Y"),
        texto_intro=texto_intro,
        lista_exercicios=lista_estruturada,
        logo_path=caminho_logo
    )

    # 4. Gera PDF
    nome_arquivo = f"Treino_{nome_aluno.replace(' ', '_')}.pdf"
    caminho_final = os.path.join(diretorio_base, nome_arquivo)

    with open(caminho_final, "wb") as pdf_file:
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_file)

    if pisa_status.err:
        return None
        
    return caminho_final