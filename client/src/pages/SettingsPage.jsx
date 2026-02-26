import React from 'react';
import { useTheme } from '../context/themeContext';
import { Settings as SettingsIcon, Check } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme, daisyUIThemes } = useTheme();

  // Theme color previews for visual reference
  const themeColors = {
    light: '#ffffff',
    dark: '#1f2937',
    cupcake: '#fdf2f8',
    bumblebee: '#fef3c7',
    emerald: '#10b981',
    corporate: '#1e3a8a',
    synthwave: '#ff006e',
    retro: '#d4a574',
    cyberpunk: '#ffbe0b',
    valentine: '#ec4899',
    halloween: '#1f2937',
    garden: '#059669',
    forest: '#065f46',
    aqua: '#06b6d4',
    lofi: '#5a5a5a',
    pastel: '#fecaca',
    fantasy: '#d1d5db',
    wireframe: '#1f2937',
    black: '#000000',
    luxury: '#d4af37',
    dracula: '#282a36',
    cmyk: '#1f2937',
    autumn: '#d97706',
    business: '#0f172a',
    acid: '#b4e7ff',
    lemonade: '#ffd60a',
    night: '#0f172a',
    coffee: '#3e2723',
    winter: '#f0f9ff',
    dim: '#1f2937',
    nord: '#2e3440',
    sunset: '#fb7185',
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-base-content">Settings</h1>
          </div>
          <p className="text-base-content/60">Customize your clinic portal experience</p>
        </div>

        {/* Theme Section */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Theme</h2>
            <p className="text-base-content/70 mb-6">
              Choose a theme to personalize your experience. Your selection will be saved automatically.
            </p>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {daisyUIThemes.map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                    theme === themeName
                      ? 'bg-primary text-primary-content ring-2 ring-primary ring-offset-2'
                      : 'bg-base-200 hover:bg-base-300 text-base-content'
                  }`}
                >
                  {/* Color Preview Circle */}
                  <div
                    className="w-12 h-12 rounded-lg shadow-md border-2 border-base-300 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: themeColors[themeName] }}
                  />

                  {/* Theme Name */}
                  <span className="text-sm font-semibold capitalize text-center line-clamp-2">
                    {themeName}
                  </span>

                  {/* Active Checkmark */}
                  {theme === themeName && (
                    <div className="absolute top-2 right-2 bg-success rounded-full p-1">
                      <Check className="w-4 h-4 text-success-content" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="alert alert-info">
          <div>
            <p className="font-semibold">Current Theme: <span className="capitalize text-info-content">{theme}</span></p>
            <p className="text-sm text-info-content/80">Changes are saved automatically to your browser</p>
          </div>
        </div>

        {/* Additional Settings (Future) */}
        <div className="card bg-base-100 shadow-lg mt-8 opacity-50 pointer-events-none">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Other Settings</h2>
            <p className="text-base-content/60">More settings coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
