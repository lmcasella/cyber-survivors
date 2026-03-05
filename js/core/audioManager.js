export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = null;
        this.isMusicEnabled = true;
        this.isSfxEnabled = true;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
    }

    async loadAudioAssets() {
        try {
            console.log("🎵 Loading audio assets...");

            // Cargar archivos de audio
            const audioFiles = [
                "assets/fx/music.wav",
                "assets/fx/enemy_death.wav",
                "assets/fx/projectile.wav",
                "assets/fx/damaged.wav",
            ];

            // Guardar en el map
            this.sounds.set("music", audioFiles[0]);
            this.sounds.set("enemy_death", audioFiles[1]);
            this.sounds.set("projectile", audioFiles[2]);
            this.sounds.set("damaged", audioFiles[3]);

            console.log("✅ Audio assets loaded successfully!");
            return true;
        } catch (error) {
            console.warn("⚠️ Could not load some audio assets:", error);
            return false;
        }
    }

    // Ejecutar musica al iniciar el juego
    playMusic() {
        if (!this.isMusicEnabled || !this.sounds.has("music")) return;

        try {
            this.stopMusic();

            const musicUrl = this.sounds.get("music");
            this.music = new Audio(musicUrl);

            this.music.loop = true;
            this.music.volume = this.musicVolume;
            this.music
                .play()
                .catch((e) => console.warn("Music autoplay blocked:", e));

            console.log("🎵 Background music started");
        } catch (error) {
            console.warn("Could not play music:", error);
        }
    }

    // Parar musica
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            this.music = null;
        }
    }

    // Ejecutar efectos de sonido
    playSfx(soundName, volume = 1.0) {
        if (!this.isSfxEnabled || !this.sounds.has(soundName)) return;

        try {
            const soundUrl = this.sounds.get(soundName);
            const audio = new Audio(soundUrl);

            audio.volume = this.sfxVolume * volume;
            audio
                .play()
                .catch((e) => console.warn(`SFX ${soundName} blocked:`, e));
        } catch (error) {
            console.warn(`Could not play sound ${soundName}:`, error);
        }
    }

    // Sonido de muerte
    playEnemyDeath() {
        this.playSfx("enemy_death", 0.8);
    }

    // Sonido de disparo
    playProjectileSound() {
        this.playSfx("projectile", 0.6);
    }

    // Sonido de daño al jugador
    playPlayerDamaged() {
        this.playSfx("damaged", 0.5);
    }

    // Control de volumen
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music) {
            this.music.volume = this.musicVolume;
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    toggleMusic() {
        this.isMusicEnabled = !this.isMusicEnabled;
        if (this.isMusicEnabled) {
            this.playMusic();
        } else {
            this.stopMusic();
        }
        return this.isMusicEnabled;
    }

    toggleSfx() {
        this.isSfxEnabled = !this.isSfxEnabled;
        return this.isSfxEnabled;
    }

    getSettings() {
        return {
            musicEnabled: this.isMusicEnabled,
            sfxEnabled: this.isSfxEnabled,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
        };
    }
}
