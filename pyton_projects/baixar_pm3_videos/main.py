import yt_dlp
import os
import re

def criar_nome_valido(nome):
    nome_valido = re.sub(r'[^\w\-_\. ]', '_', nome)
    return nome_valido[:255]

def baixar_m3u8_video(url, output_filename):
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': output_filename,
        'verbose': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        print(f'Vídeo baixado e salvo como {output_filename}')
        return output_filename
    except Exception as e:
        print(f"Erro ao baixar o vídeo M3U8: {e}")
        return None

def processar_video(url):
    print(f"Processando URL: {url}")
    nome_arquivo = criar_nome_valido("video_m3u8") + ".mp4"
    caminho_video = baixar_m3u8_video(url, nome_arquivo)
    if caminho_video:
        print(f"Vídeo M3U8 baixado com sucesso: {caminho_video}")
    else:
        print("Não foi possível processar este vídeo devido a um erro no download.")

def processar_arquivo_urls(caminho_arquivo):
    with open(caminho_arquivo, 'r') as arquivo:
        urls = arquivo.readlines()
    
    for url in urls:
        url = url.strip()
        if url:
            processar_video(url)
            print("\n" + "="*50 + "\n")

# Caminho para o arquivo com as URLs
caminho_arquivo_urls = "/Users/thiagobraga/lista_de_videos_m3u8.txt"

# Executar o processamento
processar_arquivo_urls(caminho_arquivo_urls)
