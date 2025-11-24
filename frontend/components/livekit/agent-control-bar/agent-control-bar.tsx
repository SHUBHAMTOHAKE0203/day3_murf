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
        'relative backdrop-blur-xl bg-gradient-to-br mt-5 from-[#0f0c29]/95 via-[#1a1447]/95 to-[#24243e]/95 border-[#667eea]/30 flex flex-col rounded-3xl border-2 p-4 shadow-2xl shadow-[#000000]/50',
        className
      )}
      {...props}
    >
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#667eea] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-[#764ba2] rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' } as React.CSSProperties} />
      </div>

      <div className='p-5'></div>

      {/* Top glow effect */}
      <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#667eea]/60 to-transparent" />
      
      {/* Bottom subtle glow */}
      <div className="absolute -bottom-px left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-[#764ba2]/40 to-transparent" />

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
              <div className="rounded-xl overflow-hidden ring-1 ring-[#667eea]/30 hover:ring-[#667eea]/50 transition-all">
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
                  className="bg-[#1a1447]/50 hover:bg-[#667eea]/20 border-0"
                />
              </div>
            )}

            {/* Toggle Camera */}
            {visibleControls.camera && (
              <div className="rounded-xl overflow-hidden ring-1 ring-[#667eea]/30 hover:ring-[#667eea]/50 transition-all">
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
                  className="bg-[#1a1447]/50 hover:bg-[#667eea]/20 border-0"
                />
              </div>
            )}

            {/* Toggle Screen Share */}
            {visibleControls.screenShare && (
              <div className="rounded-xl overflow-hidden ring-1 ring-[#667eea]/30 hover:ring-[#667eea]/50 transition-all">
                <TrackToggle
                  size="icon"
                  variant="secondary"
                  aria-label="Toggle screen share"
                  source={Track.Source.ScreenShare}
                  pressed={screenShareToggle.enabled}
                  disabled={screenShareToggle.pending}
                  onPressedChange={screenShareToggle.toggle}
                  className="bg-[#1a1447]/50 hover:bg-[#667eea]/20 border-0 text-[#667eea]"
                />
              </div>
            )}

            {/* Toggle Transcript */}
            <div className="rounded-xl overflow-hidden ring-1 ring-[#667eea]/30 hover:ring-[#667eea]/50 transition-all">
              <Toggle
                size="icon"
                variant="secondary"
                aria-label="Toggle transcript"
                pressed={chatOpen}
                onPressedChange={handleToggleTranscript}
                className="bg-[#1a1447]/50 hover:bg-[#667eea]/20 border-0 text-[#667eea] data-[state=on]:bg-[#667eea]/30 data-[state=on]:text-[#667eea]"
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
              className="bg-gradient-to-r from-[#f093fb]/90 to-[#f5576c]/90 hover:from-[#f093fb] hover:to-[#f5576c] text-white font-semibold tracking-wide border-0 shadow-lg shadow-[#f5576c]/30 rounded-xl px-6 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <PhoneDisconnectIcon weight="bold" className="text-white" />
              <span className="hidden md:inline">End Session</span>
              <span className="inline md:hidden">End</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}