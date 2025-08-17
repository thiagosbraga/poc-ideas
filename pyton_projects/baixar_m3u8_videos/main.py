import yt_dlp
import os
import re
import json

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

def processar_video(url, title):
    print(f"Processando URL: {url}")
    nome_arquivo = criar_nome_valido(title) + ".mp4"
    caminho_video = baixar_m3u8_video(url, nome_arquivo)
    if caminho_video:
        print(f"Vídeo M3U8 baixado com sucesso: {caminho_video}")
    else:
        print("Não foi possível processar este vídeo devido a um erro no download.")

def processar_videos_json(caminho_arquivo_json):
    with open(caminho_arquivo_json, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    for video in data['videos']:
        url = video.get('url')
        title = video.get('title')
        if url and title:
            processar_video(url, title)
            print("\n" + "="*50 + "\n")

# Caminho para o arquivo JSON com os vídeos
caminho_arquivo_json = './videos.json'  # Ajuste o caminho conforme necessário

# Executar o processamento
processar_videos_json(caminho_arquivo_json)
