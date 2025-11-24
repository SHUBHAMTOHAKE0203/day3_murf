# import logging
# import os
# import json
# import datetime
# # test
# from dotenv import load_dotenv
# from livekit.agents import (
#     Agent,
#     AgentSession,
#     JobContext,
#     JobProcess,
#     MetricsCollectedEvent,
#     RoomInputOptions,
#     WorkerOptions,
#     cli,
#     metrics,
#     tokenize,
#     function_tool,
#     RunContext,
# )
# from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
# from livekit.plugins.turn_detector.multilingual import MultilingualModel

# logger = logging.getLogger("agent")

# load_dotenv(".env.local")


# class Assistant(Agent):
#     def __init__(self) -> None:
#         super().__init__(
#             instructions="""You are a friendly Blue Bottle Coffee barista. The user will place a drink order by speaking.
#             Your job is to ask concise clarifying questions until the following order state is fully filled:
#             {
#               "drinkType": "string",
#               "size": "string",
#               "milk": "string",
#               "extras": ["string"],
#               "name": "string"
#             }
#             Ask one clear question at a time to obtain missing fields. Confirm the full order once complete, then save the order to disk and tell the user it was saved.
#             Keep a friendly, helpful tone and avoid complex formatting.""",
#         )

#         # Initialize a small order state that we will fill via tools
#         self.order_state = {
#             "drinkType": "",
#             "size": "",
#             "milk": "",
#             "extras": [],
#             "name": "",
#         }

#     @function_tool
#     async def update_order(self, context: RunContext, field: str, value: str):
#         """Update a specific field of the order.

#         Args:
#             field: One of 'drinkType', 'size', 'milk', 'extras', 'name'
#             value: The value to set. For 'extras', a comma-separated string will be split into list items.

#         Returns:
#             A short status string describing what changed and any remaining missing fields, or a saved-file confirmation when complete.
#         """

#         allowed = {"drinkType", "size", "milk", "extras", "name"}
#         if field not in allowed:
#             return f"Unknown field '{field}'. Allowed fields: {', '.join(sorted(allowed))}."

#         if field == "extras":
#             # Accept a comma-separated list, or a single extra
#             extras = [e.strip() for e in value.split(",") if e.strip()]
#             if extras:
#                 self.order_state["extras"].extend(extras)
#         else:
#             self.order_state[field] = value.strip()

#         # Determine missing fields (extras must have at least one item)
#         missing = [f for f in ["drinkType", "size", "milk", "extras", "name"] if not self.order_state.get(f)]
#         if self.order_state.get("extras") == [] and "extras" not in missing:
#             missing.append("extras")

#         if not missing:
#             # Order complete: save to JSON file
#             orders_dir = os.path.join(os.getcwd(), "backend", "orders")
#             os.makedirs(orders_dir, exist_ok=True)
#             timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#             filename = os.path.join(orders_dir, f"order_{timestamp}.json")
#             try:
#                 with open(filename, "w", encoding="utf-8") as f:
#                     json.dump(self.order_state, f, ensure_ascii=False, indent=2)
#             except Exception as e:
#                 return f"Order complete but failed to save: {e}"

#             return f"Order complete and saved to {filename}."

#         return f"Updated '{field}'. Missing fields: {', '.join(missing)}."

#     @function_tool
#     async def get_order(self, context: RunContext):
#         """Return the current order state as JSON-serializable dict."""
#         return self.order_state


# def prewarm(proc: JobProcess):
#     proc.userdata["vad"] = silero.VAD.load()


# async def entrypoint(ctx: JobContext):
#     # Logging setup
#     # Add any other context you want in all log entries here
#     ctx.log_context_fields = {
#         "room": ctx.room.name,
#     }

#     # Set up a voice AI pipeline using OpenAI, Cartesia, AssemblyAI, and the LiveKit turn detector
#     session = AgentSession(
#         # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
#         # See all available models at https://docs.livekit.io/agents/models/stt/
#         stt=deepgram.STT(model="nova-3"),
#         # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
#         # See all available models at https://docs.livekit.io/agents/models/llm/
#         llm=google.LLM(
#                 model="gemini-2.5-flash",
#             ),
#         # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
#         # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
#         tts=murf.TTS(
#                 voice="en-US-matthew", 
#                 style="Conversation",
#                 tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
#                 text_pacing=True
#             ),
#         # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
#         # See more at https://docs.livekit.io/agents/build/turns
#         turn_detection=MultilingualModel(),
#         vad=ctx.proc.userdata["vad"],
#         # allow the LLM to generate a response while waiting for the end of turn
#         # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
#         preemptive_generation=True,
#     )

#     # To use a realtime model instead of a voice pipeline, use the following session setup instead.
#     # (Note: This is for the OpenAI Realtime API. For other providers, see https://docs.livekit.io/agents/models/realtime/))
#     # 1. Install livekit-agents[openai]
#     # 2. Set OPENAI_API_KEY in .env.local
#     # 3. Add `from livekit.plugins import openai` to the top of this file
#     # 4. Use the following session setup instead of the version above
#     # session = AgentSession(
#     #     llm=openai.realtime.RealtimeModel(voice="marin")
#     # )

#     # Metrics collection, to measure pipeline performance
#     # For more information, see https://docs.livekit.io/agents/build/metrics/
#     usage_collector = metrics.UsageCollector()

#     @session.on("metrics_collected")
#     def _on_metrics_collected(ev: MetricsCollectedEvent):
#         metrics.log_metrics(ev.metrics)
#         usage_collector.collect(ev.metrics)

#     async def log_usage():
#         summary = usage_collector.get_summary()
#         logger.info(f"Usage: {summary}")

#     ctx.add_shutdown_callback(log_usage)

#     # # Add a virtual avatar to the session, if desired
#     # # For other providers, see https://docs.livekit.io/agents/models/avatar/
#     # avatar = hedra.AvatarSession(
#     #   avatar_id="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/hedra
#     # )
#     # # Start the avatar and wait for it to join
#     # await avatar.start(session, room=ctx.room)

#     # Start the session, which initializes the voice pipeline and warms up the models
#     await session.start(
#         agent=Assistant(),
#         room=ctx.room,
#         room_input_options=RoomInputOptions(
#             # For telephony applications, use `BVCTelephony` for best results
#             noise_cancellation=noise_cancellation.BVC(),
#         ),
#     )

#     # Join the room and connect to the user
#     await ctx.connect()


# if __name__ == "__main__":
#     cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))


import os
import json
import datetime
import logging
from dotenv import load_dotenv

from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    metrics,
    RunContext,
    function_tool,
    tokenize,
)
from livekit.plugins import murf, silero, deepgram, google
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("agent")
load_dotenv(".env.local")


class WellnessCompanion(Agent):
    """Health & Wellness daily check-in agent"""

    def __init__(self):
        super().__init__(
            instructions="""
            You are a supportive health and wellness companion. 
            Your goal is to have a short, grounded daily check-in with the user:
            1. Ask about mood, energy, and stress.
            2. Ask about 1-3 goals/intention for the day.
            3. Offer small actionable reflections.
            4. Close the check-in with a summary and confirmation.
            Avoid medical advice or diagnosis.
            Persist data to wellness_log.json and reference previous sessions.
            """
        )
        self.data_file = os.path.join(os.getcwd(), "backend", "wellness_log.json")
        self.state = {}  # Current session check-in

        # Load previous data if exists
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r", encoding="utf-8") as f:
                    self.history = json.load(f)
            except Exception as e:
                logger.warning(f"Failed to load wellness log: {e}")
                self.history = []
        else:
            self.history = []

    @function_tool
    async def update_checkin(self, context: RunContext, field: str, value: str):
        allowed = {"mood", "energy", "stress", "goals", "summary"}
        if field not in allowed:
            return f"Unknown field '{field}'. Allowed: {', '.join(sorted(allowed))}"

        self.state[field] = value.strip()

        # Save when required fields are filled
        required = ["mood", "energy", "goals"]
        missing = [f for f in required if not self.state.get(f)]
        if not missing:
            self.state["timestamp"] = datetime.datetime.now().isoformat()
            self.history.append(self.state)
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            try:
                with open(self.data_file, "w", encoding="utf-8") as f:
                    json.dump(self.history, f, ensure_ascii=False, indent=2)
            except Exception as e:
                return f"Check-in complete but failed to save: {e}"
            return "Check-in complete and saved!"
        return f"Updated '{field}'. Missing: {', '.join(missing)}"

    @function_tool
    async def get_checkin(self, context: RunContext):
        return self.state

    @function_tool
    async def get_last_checkin(self, context: RunContext):
        if self.history:
            return self.history[-1]
        return None

    def format_for_tts(self):
        """Convert numeric fields to descriptive words for TTS"""
        scale_words = {
            "mood": {1: "very low", 2: "low", 3: "medium", 4: "high", 5: "very high"},
            "energy": {1: "very low", 2: "low", 3: "medium", 4: "high", 5: "very high"},
            "stress": {1: "low", 2: "moderate", 3: "moderate", 4: "high", 5: "very high"},
        }

        mood_val = int(self.state.get("mood", 3))
        energy_val = int(self.state.get("energy", 3))
        stress_val = int(self.state.get("stress", 3))

        mood_text = scale_words["mood"].get(mood_val, "medium")
        energy_text = scale_words["energy"].get(energy_val, "medium")
        stress_text = scale_words["stress"].get(stress_val, "moderate")

        tts_text = (
            f"So your mood seems {mood_text}. "
            f"Your energy appears {energy_text} and stress level is {stress_text}. "
            f"What are your goals for today?"
        )
        return tts_text

    def get_welcome_tts(self):
        """Friendly opening TTS prompt, no numeric scales"""
        tts_text = (
            "Hi! I'm here for your daily wellness check-in. "
            "How are you feeling today? "
            "Could you tell me about your mood, energy, and stress in your own words?"
        )
        return tts_text


def prewarm(proc: JobProcess):
    """Load Silero VAD for voice activity detection"""
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    """Start wellness companion session"""
    ctx.log_context_fields = {"room": ctx.room.name}

    # TTS engine
    tts_engine = murf.TTS(
        voice="en-US-matthew",
        style="Conversation",
        tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
        text_pacing=True,
    )

    # Agent session
    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=tts_engine,
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    # Metrics collection
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics(ev):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage summary: {summary}")

    ctx.add_shutdown_callback(log_usage)

    agent_instance = WellnessCompanion()

    # Start session
    await session.start(agent=agent_instance, room=ctx.room, room_input_options=None)

    # Send friendly welcome TTS
    await session.tts.speak(agent_instance.get_welcome_tts())

    # Connect to room
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
