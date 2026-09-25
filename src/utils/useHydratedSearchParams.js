import { useSyncExternalStore } from 'react';
import { useSearchParams } from 'react-router';

const emptySearchParams = new URLSearchParams();

function subscribeToHydration() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function useHydratedSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );

  return [isHydrated ? searchParams : emptySearchParams, setSearchParams];
}
