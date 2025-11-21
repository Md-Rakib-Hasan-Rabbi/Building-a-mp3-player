import os
os.environ["PYGAME_HIDE_SUPPORT_PROMPT"] = "hide"
import pygame


def play_music(folder, song_name):

    file_path = os.path.join(folder, song_name)

    if not os.path.exists(file_path):
        print(f"The file '{file_path}' does not exist.")
        return
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()

    print(f"\nNow playing: {song_name}")
    print("Commands: p - pause, r - resume, s - stop")

    while True:
        command = input("> ").lower()

        if command == 'p':
            pygame.mixer.music.pause()
            print("Music paused.")
        elif command == 'r':
            pygame.mixer.music.unpause()
            print("Music resumed.")
        elif command == 's':
            pygame.mixer.music.stop()
            print("Music stopped.")
            return
        else:
            print("Invalid command.")


def main():
    try:
        pygame.mixer.init()
    except pygame.error as e:
        print(f"Audio initialization failed: {e}")
        return  
    
    folder  = "music"

    if not os.path.isdir(folder):
        print(f"The folder '{folder}' does not exist.")
        return  
    
    mp3_files = [f for f in os.listdir(folder) if f.endswith('.mp3')]
    if not mp3_files:
        print(f"No mp3 files found in the folder '{folder}'.")
        return
    
    while True:
        print("******MP3 PLAYER******")
        print("My song list:")

        for index, song in enumerate(mp3_files,start=1):
            print(f"{index}. {song}")
        
        choice_input = input("\nEnter the song # to play (or 'q' to quit): ")

        if(choice_input.lower() == 'q'):
            print("Bye!")
            break

        if not choice_input.isdigit():
            print("Enter a valid number\n")
            continue

        choice = int(choice_input) - 1
        if choice <= 0 or choice < len(mp3_files):
            play_music(folder,mp3_files[choice])
        else:
            print("Invalid choice\n")
            

        #song_path = os.path.join(folder, mp3_files[choice])


if __name__ == "__main__":
    main()