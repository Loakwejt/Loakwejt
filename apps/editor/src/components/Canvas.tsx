import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useEditorStore, Breakpoint } from '../store/editor-store';
import { CanvasNode } from './CanvasNode';
import { useDndState } from './DndProvider';
import { cn } from '@builderly/ui';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Menu, 
  X, 
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { generateCssVariables } from '@builderly/core';
import type { SiteSettings } from '@builderly/core';

// Device frames for responsive preview
const DEVICE_CONFIG: Record<Breakpoint, { width: string; icon: React.ReactNode; label: string }> = {
  desktop: { width: '100%', icon: <Monitor className="h-4 w-4" />, label: 'Desktop' },
  tablet: { width: '768px', icon: <Tablet className="h-4 w-4" />, label: 'Tablet' },
  mobile: { width: '375px', icon: <Smartphone className="h-4 w-4" />, label: 'Mobile' },
};

export function Canvas() {
  const { tree, breakpoint, zoom, isPreviewMode, selectNode, siteSettings } = useEditorStore();
  const { overId, activeId } = useDndState();

  const config = DEVICE_CONFIG[breakpoint];

  // Generate CSS variables from site settings
  const themeStyles = useMemo(() => {
    const { colors, typography, spacing } = siteSettings.theme;
    
    return {
      '--color-background': colors.background,
      '--color-foreground': colors.foreground,
      '--color-primary': colors.primary,
      '--color-primary-foreground': colors.primaryForeground,
      '--color-secondary': colors.secondary,
      '--color-secondary-foreground': colors.secondaryForeground,
      '--color-muted': colors.muted,
      '--color-muted-foreground': colors.mutedForeground,
      '--color-accent': colors.accent,
      '--color-accent-foreground': colors.accentForeground,
      '--color-card': colors.card,
      '--color-card-foreground': colors.cardForeground,
      '--color-border': colors.border,
      '--color-destructive': colors.destructive,
      '--color-success': colors.success,
      '--color-warning': colors.warning,
      '--font-family': typography.fontFamily,
      '--font-family-heading': typography.headingFontFamily,
      '--font-size-base': `${typography.baseFontSize}px`,
      '--line-height-base': typography.baseLineHeight,
      '--border-radius': spacing.borderRadius,
      '--container-max-width': spacing.containerMaxWidth,
      fontFamily: typography.fontFamily,
      fontSize: `${typography.baseFontSize}px`,
      lineHeight: typography.baseLineHeight,
    } as React.CSSProperties;
  }, [siteSettings]);

  // Generate background styles
  const backgroundStyles = useMemo(() => {
    const bg = siteSettings.backgroundEffects?.pageBackground;
    if (!bg) return { backgroundColor: siteSettings.theme.colors.background };

    const styles: React.CSSProperties = {};

    switch (bg.type) {
      case 'color':
        styles.backgroundColor = bg.color || siteSettings.theme.colors.background;
        break;
      
      case 'gradient':
        if (bg.gradient) {
          const { type, angle, colors } = bg.gradient;
          const colorStops = colors?.map(c => `${c.color} ${c.position}%`).join(', ') || '#ffffff 0%, #f1f5f9 100%';
          
          if (type === 'linear') {
            styles.background = `linear-gradient(${angle}deg, ${colorStops})`;
          } else if (type === 'radial') {
            styles.background = `radial-gradient(circle, ${colorStops})`;
          } else if (type === 'conic') {
            styles.background = `conic-gradient(from ${angle}deg, ${colorStops})`;
          }
        }
        break;
      
      case 'image':
        if (bg.image?.url) {
          styles.backgroundImage = `url(${bg.image.url})`;
          styles.backgroundSize = bg.image.size || 'cover';
          styles.backgroundPosition = bg.image.position || 'center';
          styles.backgroundAttachment = bg.image.attachment || 'scroll';
          styles.backgroundRepeat = 'no-repeat';
        }
        break;
      
      case 'pattern':
        if (bg.pattern) {
          const { type, color, opacity, size } = bg.pattern;
          const patternColor = color || '#e2e8f0';
          const patternOpacity = (opacity || 30) / 100;
          const patternSize = size || 20;
          
          let patternSvg = '';
          switch (type) {
            case 'dots':
              patternSvg = `<svg width="${patternSize}" height="${patternSize}" xmlns="http://www.w3.org/2000/svg"><circle cx="${patternSize/2}" cy="${patternSize/2}" r="1.5" fill="${patternColor}" fill-opacity="${patternOpacity}"/></svg>`;
              break;
            case 'grid':
              patternSvg = `<svg width="${patternSize}" height="${patternSize}" xmlns="http://www.w3.org/2000/svg"><path d="M ${patternSize} 0 L 0 0 0 ${patternSize}" fill="none" stroke="${patternColor}" stroke-width="0.5" stroke-opacity="${patternOpacity}"/></svg>`;
              break;
            case 'lines':
              patternSvg = `<svg width="${patternSize}" height="${patternSize}" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="${patternSize}" x2="${patternSize}" y2="0" stroke="${patternColor}" stroke-width="0.5" stroke-opacity="${patternOpacity}"/></svg>`;
              break;
            default:
              patternSvg = `<svg width="${patternSize}" height="${patternSize}" xmlns="http://www.w3.org/2000/svg"><circle cx="${patternSize/2}" cy="${patternSize/2}" r="1" fill="${patternColor}" fill-opacity="${patternOpacity}"/></svg>`;
          }
          styles.backgroundColor = siteSettings.theme.colors.background;
          styles.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`;
          styles.backgroundRepeat = 'repeat';
        }
        break;
      
      default:
        styles.backgroundColor = siteSettings.theme.colors.background;
    }

    return styles;
  }, [siteSettings]);

  // Make canvas a drop target
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: {
      accepts: true,
      nodeId: 'root',
    },
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectNode(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Device indicator */}
      {!isPreviewMode && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
          {config.icon}
          <span>{config.label}</span>
          {breakpoint !== 'desktop' && (
            <span className="text-muted-foreground/60">({config.width})</span>
          )}
        </div>
      )}

      {/* Canvas container */}
      <div
        className={cn(
          'flex-1 flex justify-center overflow-auto p-4',
          !isPreviewMode && 'bg-[repeating-linear-gradient(45deg,#f5f5f5_0,#f5f5f5_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]'
        )}
        onClick={handleCanvasClick}
      >
        {/* Device frame */}
        <div
          className={cn(
            'relative shadow-2xl overflow-hidden transition-all duration-300 flex flex-col',
            breakpoint === 'mobile' && 'rounded-[2rem] border-[8px] border-gray-800',
            breakpoint === 'tablet' && 'rounded-xl border-[6px] border-gray-700',
            breakpoint === 'desktop' && 'rounded-lg',
            isPreviewMode ? '' : 'ring-1 ring-border',
            isOver && activeId && 'ring-2 ring-primary'
          )}
          style={{
            width: config.width,
            maxWidth: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            minHeight: breakpoint === 'mobile' ? '667px' : breakpoint === 'tablet' ? '1024px' : '600px',
            ...backgroundStyles,
            color: siteSettings.theme.colors.foreground,
          }}
        >
          {/* Notch for mobile */}
          {breakpoint === 'mobile' && !isPreviewMode && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-50" />
          )}

          {/* Image/Video overlay */}
          {siteSettings.backgroundEffects?.pageBackground?.type === 'image' && 
           siteSettings.backgroundEffects?.pageBackground?.image?.overlay?.enabled && (
            <div 
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundColor: siteSettings.backgroundEffects.pageBackground.image.overlay.color || '#000000',
                opacity: (siteSettings.backgroundEffects.pageBackground.image.overlay.opacity || 50) / 100,
              }}
            />
          )}

          {/* Topbar */}
          {siteSettings.header?.topbar?.enabled && (
            <TopbarPreview settings={siteSettings} />
          )}

          {/* Header */}
          {siteSettings.header?.enabled && (
            <HeaderPreview settings={siteSettings} breakpoint={breakpoint} />
          )}

          {/* Content area with theme styles */}
          <div
            ref={setNodeRef}
            className={cn(
              'flex-1 relative z-10',
              breakpoint === 'mobile' && !siteSettings.header?.enabled && 'pt-8'
            )}
            style={themeStyles}
          >
            <CanvasNode node={tree.root} isRoot />
          </div>

          {/* Footer */}
          {siteSettings.footer?.enabled && (
            <FooterPreview settings={siteSettings} />
          )}

          {/* Back to top button */}
          {siteSettings.footer?.bottomBar?.showBackToTop && (
            <button
              className="fixed bottom-20 right-4 z-50 p-2 rounded-full shadow-lg transition-all hover:scale-110"
              style={{
                backgroundColor: siteSettings.theme.colors.primary,
                color: siteSettings.theme.colors.primaryForeground,
              }}
              title="Nach oben"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          )}

          {/* Home indicator for mobile */}
          {breakpoint === 'mobile' && !isPreviewMode && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-50" />
          )}

          {/* Scroll Progress Indicator */}
          {siteSettings.backgroundEffects?.scroll?.scrollIndicator?.enabled && (
            <div 
              className="absolute top-0 left-0 h-1 z-50"
              style={{
                width: '30%', // Demo value
                backgroundColor: siteSettings.backgroundEffects.scroll.scrollIndicator.color || siteSettings.theme.colors.primary,
              }}
            />
          )}
        </div>
      </div>

      {/* Zoom indicator */}
      {zoom !== 100 && (
        <div className="absolute bottom-4 right-4 bg-background border rounded-md px-2 py-1 text-xs text-muted-foreground shadow">
          {zoom}%
        </div>
      )}

      {/* Animation styles */}
      <style>{generateAnimationStyles(siteSettings)}</style>
    </div>
  );
}

// ============================================================================
// TOPBAR PREVIEW COMPONENT
// ============================================================================

function TopbarPreview({ settings }: { settings: SiteSettings }) {
  const topbar = settings.header?.topbar;
  if (!topbar?.enabled) return null;

  return (
    <div
      className="px-4 py-2 text-center text-sm relative z-20"
      style={{
        backgroundColor: topbar.backgroundColor || '#0f172a',
        color: topbar.textColor || '#ffffff',
      }}
    >
      <span>{topbar.text || 'Willkommen auf unserer Website!'}</span>
      {topbar.dismissible && (
        <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// HEADER PREVIEW COMPONENT
// ============================================================================

function HeaderPreview({ settings, breakpoint }: { settings: SiteSettings; breakpoint: Breakpoint }) {
  const header = settings.header;
  if (!header?.enabled) return null;

  const style = header.style || {};
  const logo = header.logo || {};
  const nav = header.navigation || {};
  const cta = header.cta || {};

  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';

  const headerStyle: React.CSSProperties = {
    backgroundColor: style.backdropBlur 
      ? `${style.backgroundColor || '#ffffff'}${Math.round((style.backgroundOpacity || 100) * 2.55).toString(16).padStart(2, '0')}`
      : style.backgroundColor || '#ffffff',
    color: style.textColor || '#0f172a',
    borderBottom: style.borderBottom ? `1px solid ${style.borderColor || '#e2e8f0'}` : 'none',
    backdropFilter: style.backdropBlur ? 'blur(10px)' : 'none',
    boxShadow: style.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' 
      : style.shadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)'
      : style.shadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)'
      : 'none',
    height: header.height || '80px',
    position: header.position === 'sticky' ? 'sticky' : header.position === 'fixed' ? 'fixed' : 'relative',
    top: header.position !== 'static' ? 0 : undefined,
    zIndex: 40,
    width: '100%',
  };

  // Determine layout based on header type
  const isCenter = header.type === 'centered';
  const logoPosition = logo.position || 'left';
  const navPosition = nav.position || 'center';

  return (
    <header style={headerStyle}>
      <div 
        className="h-full px-4 mx-auto flex items-center gap-4"
        style={{ maxWidth: header.layout === 'contained' ? settings.theme.spacing.containerMaxWidth : '100%' }}
      >
        {/* Logo */}
        <div 
          className={cn(
            'flex items-center gap-2',
            logoPosition === 'center' && 'absolute left-1/2 -translate-x-1/2',
            logoPosition === 'right' && 'order-last ml-auto'
          )}
        >
          {settings.general?.logo ? (
            <img 
              src={settings.general.logo} 
              alt={settings.general.logoAlt || 'Logo'} 
              style={{ maxHeight: logo.maxHeight || '50px' }}
            />
          ) : (
            <span 
              className={cn(
                'text-xl',
                logo.textStyle === 'bold' && 'font-bold',
                logo.textStyle === 'italic' && 'italic'
              )}
              style={{ fontFamily: settings.theme.typography.headingFontFamily }}
            >
              {logo.text || settings.general?.logoAlt || 'Logo'}
            </span>
          )}
        </div>

        {/* Navigation - Desktop */}
        {!isMobile && (
          <nav 
            className={cn(
              'flex items-center gap-6',
              navPosition === 'center' && 'mx-auto',
              navPosition === 'right' && 'ml-auto',
              navPosition === 'left' && 'ml-4'
            )}
          >
            {['Home', 'Über uns', 'Services', 'Kontakt'].map((item) => (
              <a 
                key={item}
                href="#"
                className={cn(
                  'text-sm transition-colors hover:opacity-70',
                  nav.style === 'underline' && 'hover:underline',
                  nav.style === 'pills' && 'px-3 py-1 rounded-full hover:bg-black/5',
                  nav.style === 'bordered' && 'px-3 py-1 border rounded hover:bg-black/5'
                )}
              >
                {item}
              </a>
            ))}
          </nav>
        )}

        {/* Spacer */}
        {logoPosition !== 'right' && navPosition !== 'right' && <div className="flex-1" />}

        {/* CTA Button */}
        {cta.enabled && !isMobile && (
          <a
            href={cta.url || '#'}
            className={cn(
              'px-4 py-2 rounded text-sm font-medium transition-colors',
              cta.style === 'primary' && 'text-white',
              cta.style === 'secondary' && '',
              cta.style === 'outline' && 'border-2 bg-transparent',
              cta.style === 'ghost' && 'bg-transparent hover:bg-black/5'
            )}
            style={{
              backgroundColor: cta.style === 'primary' ? settings.theme.colors.primary 
                : cta.style === 'secondary' ? settings.theme.colors.secondary 
                : 'transparent',
              color: cta.style === 'primary' ? settings.theme.colors.primaryForeground
                : cta.style === 'outline' ? settings.theme.colors.primary
                : style.textColor,
              borderColor: cta.style === 'outline' ? settings.theme.colors.primary : undefined,
            }}
          >
            {cta.text || 'Kontakt'}
          </a>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button className="ml-auto p-2">
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>
    </header>
  );
}

// ============================================================================
// FOOTER PREVIEW COMPONENT
// ============================================================================

function FooterPreview({ settings }: { settings: SiteSettings }) {
  const footer = settings.footer;
  if (!footer?.enabled) return null;

  const style = footer.style || {};
  const sections = footer.sections || {};
  const bottomBar = footer.bottomBar || {};

  const footerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor || '#0f172a',
    color: style.textColor || '#ffffff',
    borderTop: style.borderTop ? `1px solid ${style.borderColor || '#1e293b'}` : 'none',
    paddingTop: style.paddingTop || '4rem',
    paddingBottom: style.paddingBottom || '2rem',
  };

  const linkStyle: React.CSSProperties = {
    color: style.linkColor || '#94a3b8',
  };

  // Generate grid columns based on settings
  const gridCols = footer.columns || 4;
  const gridClass = gridCols === 1 ? 'grid-cols-1' 
    : gridCols === 2 ? 'grid-cols-2'
    : gridCols === 3 ? 'grid-cols-3'
    : gridCols === 4 ? 'grid-cols-4'
    : gridCols === 5 ? 'grid-cols-5'
    : 'grid-cols-6';

  return (
    <footer style={footerStyle} className="relative z-20">
      <div 
        className="px-4 mx-auto"
        style={{ maxWidth: footer.layout === 'contained' ? settings.theme.spacing.containerMaxWidth : '100%' }}
      >
        {/* Main Footer Content */}
        {footer.type !== 'minimal' && (
          <div className={`grid ${gridClass} gap-8 mb-8`}>
            {/* About Section */}
            {sections.about?.enabled && (
              <div>
                {sections.about.showLogo && settings.general?.logo ? (
                  <img 
                    src={settings.general.logo} 
                    alt={settings.general.logoAlt || 'Logo'} 
                    className="h-8 mb-4"
                  />
                ) : (
                  <h3 className="font-bold text-lg mb-4">{sections.about.title || 'Über uns'}</h3>
                )}
                <p className="text-sm opacity-80">
                  {sections.about.text || 'Beschreibung Ihres Unternehmens.'}
                </p>
              </div>
            )}

            {/* Link Sections */}
            {sections.links?.slice(0, gridCols - 2).map((linkGroup, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{linkGroup.title}</h3>
                <ul className="space-y-2">
                  {linkGroup.items?.map((item, i) => (
                    <li key={i}>
                      <a 
                        href={item.url} 
                        className="text-sm hover:underline transition-colors"
                        style={linkStyle}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Section */}
            {sections.contact?.enabled && (
              <div>
                <h3 className="font-semibold mb-4">{sections.contact.title || 'Kontakt'}</h3>
                <ul className="space-y-3 text-sm">
                  {sections.contact.showEmail && settings.general?.email && (
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 opacity-60" />
                      <span style={linkStyle}>{settings.general.email}</span>
                    </li>
                  )}
                  {sections.contact.showPhone && settings.general?.phone && (
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 opacity-60" />
                      <span style={linkStyle}>{settings.general.phone}</span>
                    </li>
                  )}
                  {sections.contact.showAddress && settings.general?.address && (
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 opacity-60 mt-0.5" />
                      <span style={linkStyle} className="whitespace-pre-line">{settings.general.address}</span>
                    </li>
                  )}
                </ul>

                {/* Social Links */}
                {sections.contact.showSocialLinks && (
                  <div className="flex gap-3 mt-4">
                    {settings.social?.facebook && (
                      <a href={settings.social.facebook} style={linkStyle} className="hover:opacity-100 opacity-60">
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {settings.social?.instagram && (
                      <a href={settings.social.instagram} style={linkStyle} className="hover:opacity-100 opacity-60">
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {settings.social?.twitter && (
                      <a href={settings.social.twitter} style={linkStyle} className="hover:opacity-100 opacity-60">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {settings.social?.linkedin && (
                      <a href={settings.social.linkedin} style={linkStyle} className="hover:opacity-100 opacity-60">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {settings.social?.youtube && (
                      <a href={settings.social.youtube} style={linkStyle} className="hover:opacity-100 opacity-60">
                        <Youtube className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Newsletter Section */}
            {sections.newsletter?.enabled && (
              <div>
                <h3 className="font-semibold mb-4">{sections.newsletter.title || 'Newsletter'}</h3>
                <p className="text-sm opacity-80 mb-3">
                  {sections.newsletter.text || 'Bleiben Sie auf dem Laufenden.'}
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={sections.newsletter.placeholder || 'Ihre E-Mail'}
                    className="flex-1 px-3 py-2 rounded text-sm bg-white/10 border border-white/20 placeholder:text-white/40"
                  />
                  <button
                    className="px-4 py-2 rounded text-sm font-medium"
                    style={{
                      backgroundColor: settings.theme.colors.primary,
                      color: settings.theme.colors.primaryForeground,
                    }}
                  >
                    {sections.newsletter.buttonText || 'OK'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        {bottomBar.enabled && (
          <div 
            className="pt-6 border-t flex flex-wrap items-center justify-between gap-4"
            style={{ borderColor: style.borderColor || '#1e293b' }}
          >
            <p className="text-sm opacity-70">
              {(bottomBar.copyrightText || '© {year} Firmenname').replace('{year}', new Date().getFullYear().toString())}
            </p>
            
            {bottomBar.links && bottomBar.links.length > 0 && (
              <div className="flex gap-4">
                {bottomBar.links.map((link, i) => (
                  <a 
                    key={i}
                    href={link.url}
                    className="text-sm hover:underline"
                    style={linkStyle}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}

// ============================================================================
// GENERATE ANIMATION STYLES
// ============================================================================

function generateAnimationStyles(settings: SiteSettings): string {
  const animations = settings.animations;
  if (!animations?.enabled) return '';

  let css = '';

  // Scroll animations
  if (animations.scrollAnimations?.enabled) {
    const duration = animations.scrollAnimations.duration || 600;
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

    css += `
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity ${duration}ms ${easing}, transform ${duration}ms ${easing};
      }
      .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
  }

  // Hover effects for buttons
  if (animations.hoverEffects?.buttons) {
    const effect = animations.hoverEffects.buttons;
    if (effect === 'lift') {
      css += `
        button:hover, [role="button"]:hover, a.btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `;
    } else if (effect === 'glow') {
      css += `
        button:hover, [role="button"]:hover {
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
        }
      `;
    } else if (effect === 'scale') {
      css += `
        button:hover, [role="button"]:hover {
          transform: scale(1.05);
        }
      `;
    }
  }

  // Hover effects for cards
  if (animations.hoverEffects?.cards) {
    const effect = animations.hoverEffects.cards;
    if (effect === 'lift') {
      css += `
        .card:hover, [data-card]:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
      `;
    }
  }

  // Hover effects for images
  if (animations.hoverEffects?.images) {
    const effect = animations.hoverEffects.images;
    if (effect === 'zoom') {
      css += `
        img:hover {
          transform: scale(1.05);
        }
        img {
          transition: transform 0.3s ease;
        }
      `;
    } else if (effect === 'brighten') {
      css += `
        img:hover {
          filter: brightness(1.1);
        }
        img {
          transition: filter 0.3s ease;
        }
      `;
    }
  }

  // Smooth scroll
  if (settings.backgroundEffects?.scroll?.smoothScroll) {
    css += `
      html {
        scroll-behavior: smooth;
      }
    `;
  }

  // Custom scrollbar
  if (settings.backgroundEffects?.scroll?.scrollbarStyle === 'thin') {
    css += `
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }
    `;
  } else if (settings.backgroundEffects?.scroll?.scrollbarStyle === 'hidden') {
    css += `
      ::-webkit-scrollbar {
        display: none;
      }
      * {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
  } else if (settings.backgroundEffects?.scroll?.scrollbarStyle === 'custom') {
    const color = settings.backgroundEffects.scroll.scrollbarColor || '#7c3aed';
    css += `
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      ::-webkit-scrollbar-thumb {
        background: ${color};
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${color}dd;
      }
    `;
  }

  // Focus styles
  if (settings.accessibility?.focusStyles) {
    const focus = settings.accessibility.focusStyles;
    const color = focus.color || '#7c3aed';
    const width = focus.width || '2px';
    const offset = focus.offset || '2px';

    if (focus.style === 'ring') {
      css += `
        :focus-visible {
          outline: none;
          box-shadow: 0 0 0 ${width} ${color};
        }
      `;
    } else if (focus.style === 'outline') {
      css += `
        :focus-visible {
          outline: ${width} solid ${color};
          outline-offset: ${offset};
        }
      `;
    }
  }

  return css;
}
