import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { authProvidersState } from '@/client-config/states/authProvidersState';
import { isDebugModeState } from '@/client-config/states/isDebugModeState';
import { isSignInPrefilledState } from '@/client-config/states/isSignInPrefilledState';
import { supportChatState } from '@/client-config/states/supportChatState';
import { telemetryState } from '@/client-config/states/telemetryState';
import { useGetClientConfigQuery } from '~/generated/graphql';

export const ClientConfigProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [, setAuthProviders] = useRecoilState(authProvidersState);
  const [, setIsDebugMode] = useRecoilState(isDebugModeState);

  const [, setIsSignInPrefilled] = useRecoilState(isSignInPrefilledState);

  const [, setTelemetry] = useRecoilState(telemetryState);
  const [setIsLoading] = useState(true);
  const setSupportChat = useSetRecoilState(supportChatState);

  const { data, loading } = useGetClientConfigQuery();

  useEffect(() => {
    if (data?.clientConfig) {
      setAuthProviders({
        google: data?.clientConfig.authProviders.google,
        password: data?.clientConfig.authProviders.password,
        magicLink: false,
      });
      setIsDebugMode(data?.clientConfig.debugMode);
      setIsSignInPrefilled(data?.clientConfig.signInPrefilled);

      setTelemetry(data?.clientConfig.telemetry);
      setSupportChat(data?.clientConfig.support);
    }
  }, [
    data,
    setAuthProviders,
    setIsDebugMode,
    setIsSignInPrefilled,
    setTelemetry,
    setIsLoading,
    loading,
    setSupportChat,
  ]);

  return <>{children}</>;
};
