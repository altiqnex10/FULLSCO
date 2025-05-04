import React, { useEffect } from 'react';
import { useSiteSettings } from '../hooks/use-site-settings';

/**
 * مكون لتطبيق الألوان من إعدادات الموقع على متغيرات CSS
 */
const ThemeColors: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    if (!siteSettings) return;

    // تطبيق الألوان من إعدادات الموقع
    if (siteSettings.primaryColor) {
      console.log('Setting primary color from site settings:', siteSettings.primaryColor);
      document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
      
      // تحويل من هيكس إلى HSL
      const hsl = hexToHSL(siteSettings.primaryColor);
      if (hsl) {
        document.documentElement.style.setProperty('--primary', hsl);
      }
    }

    if (siteSettings.secondaryColor) {
      console.log('Setting secondary color from site settings:', siteSettings.secondaryColor);
      document.documentElement.style.setProperty('--secondary-color', siteSettings.secondaryColor);
      
      // تحويل من هيكس إلى HSL
      const hsl = hexToHSL(siteSettings.secondaryColor);
      if (hsl) {
        document.documentElement.style.setProperty('--accent', hsl);
      }
    }

    if (siteSettings.accentColor) {
      console.log('Setting accent color from site settings:', siteSettings.accentColor);
      document.documentElement.style.setProperty('--accent-color', siteSettings.accentColor);
      
      // تحويل من هيكس إلى HSL
      const hsl = hexToHSL(siteSettings.accentColor);
      if (hsl) {
        document.documentElement.style.setProperty('--info', hsl);
      }
    }
  }, [siteSettings]);

  return null; // هذا المكون لا يعرض أي شيء في DOM
};

/**
 * تحويل لون هيكس إلى صيغة HSL
 */
function hexToHSL(hex: string): string | null {
  // التأكد من أن اللون يبدأ بـ #
  if (hex.charAt(0) !== '#') {
    hex = '#' + hex;
  }
  
  // التأكد من صحة الصيغة
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    console.warn('Invalid hex color format:', hex);
    return null;
  }

  // تحويل HEX إلى RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h = Math.round(h * 60);
  }
  
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
}

export default ThemeColors;
