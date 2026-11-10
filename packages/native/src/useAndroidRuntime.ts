import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { isAndroid } from './device';

export function useAndroidRuntime(home: string) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [connected, setConnected] = useState(true);
  useEffect(() => {
    let disposed = false;
    const updateNetwork = ({ connected: online }: { connected: boolean }) => {
      if (disposed) return;
      setConnected(online);
      onlineManager.setOnline(online);
    };
    void Network.getStatus().then(updateNetwork);
    const network = Network.addListener('networkStatusChange', updateNetwork);
    const state = App.addListener('appStateChange', ({ isActive }) => {
      focusManager.setFocused(isActive);
    });
    return () => {
      disposed = true;
      void network.then((listener) => listener.remove());
      void state.then((listener) => listener.remove());
    };
  }, []);

  useEffect(() => {
    if (!isAndroid()) return;
    const back = App.addListener('backButton', () => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
        active.blur();
        void Keyboard.hide();
        return;
      }
      // React Router's index avoids leaving the app for an external browser-history entry.
      const state: unknown = window.history.state;
      const index = typeof state === 'object' && state !== null && 'idx' in state ? state.idx : 0;
      if (typeof index === 'number' && index > 0) navigate(-1);
      else if (pathname !== home && !['/login', '/auth/phone', '/'].includes(pathname)) {
        navigate(home, { replace: true });
      } else void App.minimizeApp();
    });
    return () => {
      void back.then((listener) => listener.remove());
    };
  }, [home, pathname, navigate]);
  return { connected };
}
