# LingoLand - Context for Agents

This file provides a concise overview of the **LingoLand** project to help agents understand the application structure and tech stack for UI/UX experimentation and redesign.

## Overview

LingoLand (Package name: `language-learning-kids`) is a gamified language-learning web application. The core experience revolves around interactive lessons, minigames, user profiles, and virtual pets.

## Tech Stack

- **Core Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, `clsx`, `tailwind-merge`, PostCSS
- **Animations & Assets**: Framer Motion, Lottie React, Rive React Canvas
- **Icons**: Lucide React
- **Backend/Auth**: Supabase (`@supabase/supabase-js`)

## Architecture & Navigation

The application currently uses state-based routing (`view` state in `src/App.tsx`) to switch between main components:

1. **`landing`**: Hero section and Level Preview.
2. **`auth`**: Login/Signup screen via Supabase.
3. **`dashboard`**: Main user hub.
4. **`profile`**: User profile and settings.
5. **`adventures`**: Adventure selection interface.
6. **`minigames`**: Hub for interactive minigames.
7. **`languagePicker`**: Screen to choose the learning language (`en`, `es`, `zh`).
8. **`lessonPlayer`**: The interactive lesson and core learning interface.
   _(Note: A `PetProvider` context wraps the app, handling virtual pet states.)_

## Objective for Agents

We want to **try out a new UI** for this project.

- You are encouraged to propose and implement modern, engaging, and premium UI designs.
- Since the target audience includes language learners and features gamified elements (pets, adventures), the UI should be vibrant, responsive, and make good use of animations (Framer Motion/Lottie/Rive).
- Feel free to refactor component layouts, update Tailwind classes, and refine the overall visual hierarchy.
