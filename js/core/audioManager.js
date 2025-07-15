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

            // Load all audio files
            const audioFiles = [
                "assets/fx/music.wav",
                "assets/fx/enemy_death.wav",
                "assets/fx/projectile.wav",
                "assets/fx/damaged.wav",
            ];

            // Store audio assets
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

    // Play background music
    playMusic() {
        if (!this.isMusicEnabled || !this.sounds.has("music")) return;

        try {
            // Stop existing music if playing
            this.stopMusic();

            // Create new audio instance for music
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

    // Stop background music
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            this.music = null;
        }
    }

    // Play sound effect
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

    // Play enemy death sound
    playEnemyDeath() {
        this.playSfx("enemy_death", 0.8);
    }

    // Play projectile sound
    playProjectileSound() {
        this.playSfx("projectile", 0.6);
    }

    // Play player damaged sound
    playPlayerDamaged() {
        this.playSfx("damaged", 0.5);
    }

    // Volume controls
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music) {
            this.music.volume = this.musicVolume;
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    // Toggle controls
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

    // Get current settings
    getSettings() {
        return {
            musicEnabled: this.isMusicEnabled,
            sfxEnabled: this.isSfxEnabled,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
        };
    }
}
