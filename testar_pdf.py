from services.pdf_service import gerar_pdf_treino

# Simula uma resposta que a IA daria
texto_fake_ia = """
Aqui está seu treino focado em hipertrofia.

### Treino A - Peito e Tríceps

1. Supino Reto com Barra
Faça 4 séries de 10 repetições.

2. Crucifixo na Máquina
Faça 3 séries de 12 repetições.

3. Tríceps Corda
Focar na extensão total.
"""

print("--- Iniciando Teste ---")
try:
    arquivo = gerar_pdf_treino(texto_fake_ia, "Felipe Teste")
    print(f"SUCESSO! Arquivo criado: {arquivo}")
except Exception as e:
    print(f"ERRO: {e}")