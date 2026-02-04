# Importa a nossa "fábrica" de PDF
from services.pdf_service import gerar_pdf_treino

# Imagine que esta variável veio da sua chamada à API da OpenAI/Gemini
resposta_da_ia = """
### Treino A
1. Agachamento Livre
2. Flexão de Braços
"""

# Chamada simples
arquivo_gerado = gerar_pdf_do_treino(resposta_da_ia, "Felipe Cordeiro")

print(f"PDF Gerado com sucesso em: {arquivo_gerado}")
# Agora você pode enviar esse arquivo para o usuário via API