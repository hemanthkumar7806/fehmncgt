'use client';

import dynamic from 'next/dynamic';
import '../lib/react-polyfill';

const FloatingChatWidget = dynamic(
  () => import('@revature/ai-mentor-sdk').then((mod) => mod.FloatingChatWidget),
  { ssr: false }
);

/**
 * Demo-only floating chat widget (HNMC theme). Not for production.
 * UI and copy match Holy Name Medical Center Fibroid Center branding.
 */
export default function FloatingChatWidgetWrapper() {
  return (
    <FloatingChatWidget
      apiBaseUrl="http://localhost:8000"
      userContext={{ userId: 'demo', name: 'Demo', role: 'student' }}
      courseId="CS101"
      position="bottom-right"
      buttonSize={60}
      windowSize={{
        small: { width: 400, height: 600 },
        expanded: {
          width: 80,
          height: 95,
          maxWidth: 95,
          maxHeight: 95,
          alignment: 'right',
        },
      }}
      theme={{
        primaryColor: '#115e59',
        secondaryColor: '#0f766e',
        backgroundColor: '#ffffff',
        surfaceColor: '#f8fafc',
        textColor: '#1e293b',
        textSecondaryColor: '#64748b',
        borderColor: '#e2e8f0',
        borderRadius: 12,
        fontFamily: '"Proxima Nova", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      darkMode={false}
      title="Holy Name Care"
      placeholder="Ask about fibroid care, appointments, or treatment options..."
      welcomeMessage="Hi! Ask me about fibroid center."
      showWelcomeTooltip={true}
      welcomeTooltipInterval={30000}
     
    />
  );
}
