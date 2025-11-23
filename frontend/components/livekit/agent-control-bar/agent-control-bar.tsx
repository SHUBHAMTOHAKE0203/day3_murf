'use client';

import { type HTMLAttributes, useCallback, useState } from 'react';
import { Track } from 'livekit-client';
import { useChat, useRemoteParticipants } from '@livekit/components-react';
import { ChatTextIcon, PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
import { useSession } from '@/components/app/session-provider';
import { TrackToggle } from '@/components/livekit/agent-control-bar/track-toggle';
import { Button } from '@/components/livekit/button';
import { Toggle } from '@/components/livekit/toggle';
import { cn } from '@/lib/utils';
import { ChatInput } from './chat-input';
import { UseInputControlsProps, useInputControls } from './hooks/use-input-controls';
import { usePublishPermissions } from './hooks/use-publish-permissions';
import { TrackSelector } from './track-selector';

export interface ControlBarControls {
  leave?: boolean;
  camera?: boolean;
  microphone?: boolean;
  screenShare?: boolean;
  chat?: boolean;
}

export interface AgentControlBarProps extends UseInputControlsProps {
  controls?: ControlBarControls;
  onDisconnect?: () => void;
  onChatOpenChange?: (open: boolean) => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  className,
  onDisconnect,
  onDeviceError,
  onChatOpenChange,
  ...props
}: AgentControlBarProps & HTMLAttributes<HTMLDivElement>) {
  const { send } = useChat();
  const participants = useRemoteParticipants();
  const [chatOpen, setChatOpen] = useState(false);
  const publishPermissions = usePublishPermissions();
  const { isSessionActive, endSession } = useSession();

  const {
    micTrackRef,
    cameraToggle,
    microphoneToggle,
    screenShareToggle,
    handleAudioDeviceChange,
    handleVideoDeviceChange,
    handleMicrophoneDeviceSelectError,
    handleCameraDeviceSelectError,
  } = useInputControls({ onDeviceError, saveUserChoices });

  const handleSendMessage = async (message: string) => {
    await send(message);
  };

  const handleToggleTranscript = useCallback(
    (open: boolean) => {
      setChatOpen(open);
      onChatOpenChange?.(open);
    },
    [onChatOpenChange, setChatOpen]
  );

  const handleDisconnect = useCallback(async () => {
    endSession();
    onDisconnect?.();
  }, [endSession, onDisconnect]);

  const visibleControls = {
    leave: controls?.leave ?? true,
    microphone: controls?.microphone ?? publishPermissions.microphone,
    screenShare: controls?.screenShare ?? publishPermissions.screenShare,
    camera: controls?.camera ?? publishPermissions.camera,
    chat: controls?.chat ?? publishPermissions.data,
  };

  const isAgentAvailable = participants.some((p) => p.isAgent);

  return (
    <div
      aria-label="Voice assistant controls"
      className={cn(
        'relative backdrop-blur-xl bg-gradient-to-br mt-5 from-[#2d2520]/95 via-[#3d2f28]/95 to-[#2d2520]/95 border-[#D4A574]/30 flex flex-col rounded-3xl border-2 p-4 shadow-2xl shadow-[#000000]/50',
        className
      )}
      {...props}
    >
      {/* Subtle grain overlay */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
<div className='p-5'></div>
      {/* Glow effect on top border */}
      <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#D4A574]/50 to-transparent" />

      <div className="relative z-10">
        {/* Chat Input */}
        {visibleControls.chat && (
          <div className="mb-3">
            <ChatInput
              chatOpen={chatOpen}
              isAgentAvailable={isAgentAvailable}
              onSend={handleSendMessage}
            />
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex grow gap-2">
            {/* Toggle Microphone */}
            {visibleControls.microphone && (
              <div className="rounded-xl overflow-hidden ring-1 ring-[#D4A574]/20 hover:ring-[#D4A574]/40 transition-all">
                <TrackSelector
                  kind="audioinput"
                  aria-label="Toggle microphone"
                  source={Track.Source.Microphone}
                  pressed={microphoneToggle.enabled}
                  disabled={microphoneToggle.pending}
                  audioTrackRef={micTrackRef}
                  onPressedChange={microphoneToggle.toggle}
                  onMediaDeviceError={handleMicrophoneDeviceSelectError}
                  onActiveDeviceChange={handleAudioDeviceChange}
                  className="bg-[#3d2f28]/50 hover:bg-[#D4A574]/20 border-0"
                />
              </div>
            )}

            {/* Toggle Camera */}
            {visibleControls.camera && (
              <div className="rounded-xl overflow-hidden ring-1 ring-[#D4A574]/20 hover:ring-[#D4A574]/40 transition-all">
                <TrackSelector
                  kind="videoinput"
                  aria-label="Toggle camera"
                  source={Track.Source.Camera}
                  pressed={cameraToggle.enabled}
                  pending={cameraToggle.pending}
                  disabled={cameraToggle.pending}
                  onPressedChange={cameraToggle.toggle}
                  onMediaDeviceError={handleCameraDeviceSelectError}
                  onActiveDeviceChange={handleVideoDeviceChange}
                  className="bg-[#3d2f28]/50 hover:bg-[#D4A574]/20 border-0"
                />
              </div>
            )}

            {/* Toggle Screen Share */}
            {visibleControls.screenShare && (
              <div className="rounded-xl overflow-hidden ring-1 ring-[#D4A574]/20 hover:ring-[#D4A574]/40 transition-all">
                <TrackToggle
                  size="icon"
                  variant="secondary"
                  aria-label="Toggle screen share"
                  source={Track.Source.ScreenShare}
                  pressed={screenShareToggle.enabled}
                  disabled={screenShareToggle.pending}
                  onPressedChange={screenShareToggle.toggle}
                  className="bg-[#3d2f28]/50 hover:bg-[#D4A574]/20 border-0 text-[#D4A574]"
                />
              </div>
            )}

            {/* Toggle Transcript */}
            <div className="rounded-xl overflow-hidden ring-1 ring-[#D4A574]/20 hover:ring-[#D4A574]/40 transition-all">
              <Toggle
                size="icon"
                variant="secondary"
                aria-label="Toggle transcript"
                pressed={chatOpen}
                onPressedChange={handleToggleTranscript}
                className="bg-[#3d2f28]/50 hover:bg-[#D4A574]/20 border-0 text-[#D4A574] data-[state=on]:bg-[#D4A574]/30 data-[state=on]:text-[#D4A574]"
              >
                <ChatTextIcon weight="bold" />
              </Toggle>
            </div>
          </div>

          {/* Disconnect Button */}
          {visibleControls.leave && (
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              disabled={!isSessionActive}
              className="bg-gradient-to-r from-[#8B4513]/90 to-[#A0522D]/90 hover:from-[#8B4513] hover:to-[#A0522D] text-[#F5F3F0] font-medium tracking-wide border-0 shadow-lg shadow-[#8B4513]/30 rounded-xl px-6 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <PhoneDisconnectIcon weight="bold" className="text-[#F5F3F0]" />
              <span className="hidden md:inline">END ORDER</span>
              <span className="inline md:hidden">END</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}