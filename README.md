# 👾 Cyber Survivors

[![Jugar en itch.io](https://img.shields.io/badge/Jugar_en-itch.io-FA5C5C?style=for-the-badge&logo=itch.io)](https://kezgan.itch.io/cyber-survivors)

Un videojuego de supervivencia en arena 2D al estilo _Vampire Survivors_, desarrollado en **JavaScript** utilizando **Pixi.js**. El jugador debe enfrentarse a hordas de enemigos, esquivando sus ataques y posicionándose estratégicamente para sobrevivir el mayor tiempo posible.

## 🎮 Características Principales

- **Hordas Masivas:** Sobreviví a oleadas compuestas por varios enemigos simultáneos. El juego incluye distintos arquetipos de adversarios, como _Grunts_ (enemigos básicos) y _Fast Enemies_ (enemigos frágiles pero de alta velocidad).
- **Mejoras:** Variedad de mejoras de armas que pueden soltar los enemigos al ser derrotados.
- **Flujo de Supervivencia:** Movimiento en un entorno 2D donde el posicionamiento y el control del espacio son la clave para evitar ser acorralado.
- **Sistema de Animaciones:** Spritesheets integrados nativamente con las herramientas de texturas de Pixi.js.

## ⚙️ Arquitectura y Tecnologías Destacadas

El código fue estructurado para maximizar el rendimiento en el navegador y facilitar la creación de nuevas entidades, priorizando buenas prácticas de la programación orientada a objetos:

- **Optimización por Spatial Hashing:** Implementación de una grilla espacial (`SpatialHash`) para la detección de colisiones. En lugar de comprobar colisiones de "todos contra todos" (lo que destruiría el rendimiento), el espacio se divide en celdas, permitiendo tener una densidad alta de enemigos en pantalla de forma óptima.
- **Patrón Máquina de Estados (State Machine):** Lógica de comportamiento y animaciones desacoplada mediante estados (`state.js`, `playerStates.js`). Esto facilita el control de transiciones del jugador de manera escalable.
- **Herencia y POO Sólida:** Jerarquía de clases limpia. Las entidades heredan de un núcleo base (`gameEntity`), pasando por un controlador físico (`physicsEntity`), hasta llegar a las implementaciones concretas (`player.js`, `enemy.js`).
- **Gestores Modulares:** Separación estricta de responsabilidades. El proyecto cuenta con un `GameManager` para el flujo principal, un `InputManager` unificado para los controles, y un `AssetLoader` para la carga segura y asíncrona de texturas.

## 🕹️ Controles Básicos

- **Movimiento:** `W`, `A`, `S`, `D` / Flechas direccionales
- **Ataque:** Clic Izquierdo

## 🚀 Cómo probar el proyecto localmente

1. Cloná este repositorio: `git clone https://github.com/lmcasella/cyber-survivors.git`
2. Abrí la carpeta del proyecto en tu editor de código (como Visual Studio Code).
3. Iniciá un servidor local. Si usás VSCode, podés usar la extensión **Live Server** (clic derecho en `index.html` -> "Open with Live Server").
4. El juego se abrirá automáticamente en tu navegador.
