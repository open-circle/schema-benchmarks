import { dataTypeSchema } from "@schema-benchmarks/bench";
import { getOrInsert, getOrInsertComputed } from "@schema-benchmarks/utils";
import * as v from "valibot";

export type EventMap = Record<string, v.GenericSchema>;

export function getTaskSlug(
  libraryName: string,
  { note, snippet }: { note: string; snippet: string },
) {
  return JSON.stringify({ libraryName, note, snippet });
}

const events = {
  client: {
    benchmark: v.object({
      library: v.string(),
      dataType: dataTypeSchema,
      // getTaskSlug -> id
      initialization: v.record(v.string(), v.string()),
      validation: v.record(v.string(), v.string()),
      parsing: v.record(v.string(), v.string()),
    }),
  },
  worker: {
    cycle: v.object({ task: v.string() }),
    complete: v.variant("type", [
      v.object({
        type: v.literal("results"),
        payload: v.record(
          v.string(),
          v.union([
            v.object({ mean: v.number() }),
            v.object({ error: v.string() }),
          ]),
        ),
      }),
      v.object({ type: v.literal("fail"), error: v.instance(Error) }),
    ]),
  },
} satisfies Record<string, EventMap>;

const messageSchema = v.object({
  type: v.string(),
  payload: v.unknown(),
});

const broadcastChannel = new BroadcastChannel("benchmarks");

class TypedBroadcastChannel<
  TSendEvents extends EventMap,
  TReceiveEvents extends EventMap,
> {
  constructor(
    _send: TSendEvents,
    private receive: TReceiveEvents,
    private channel: BroadcastChannel,
  ) {}
  postMessage<Ev extends keyof TSendEvents>(
    type: Ev & string,
    payload: v.InferInput<TSendEvents[Ev]>,
  ) {
    this.channel.postMessage({
      type,
      payload,
    } satisfies v.InferInput<typeof messageSchema>);
  }
  listenerMap = new Map<
    keyof TReceiveEvents,
    WeakMap<
      (
        payload: v.InferOutput<TReceiveEvents[keyof TReceiveEvents]>,
        event: MessageEvent,
      ) => void,
      (event: MessageEvent) => void
    >
  >();
  addEventListener<Ev extends keyof TReceiveEvents>(
    type: Ev & string,
    listener: (
      payload: v.InferOutput<TReceiveEvents[Ev]>,
      event: MessageEvent,
    ) => void,
    options?: AddEventListenerOptions,
  ) {
    const schema = this.receive[type];
    if (!schema) throw new Error(`No schema for event ${type}`);
    const listenerMap = getOrInsertComputed(
      this.listenerMap,
      type,
      () => new WeakMap(),
    );
    this.channel.addEventListener(
      "message",
      getOrInsert(listenerMap, listener, (event) => {
        const parsed = v.safeParse(messageSchema, event.data);
        if (!parsed.success || parsed.output.type !== type) return;
        const payload = v.safeParse(schema, parsed.output.payload);
        if (!payload.success) return;
        listener(payload.output, event);
      }),
      options,
    );
  }
  removeEventListener<Ev extends keyof TReceiveEvents>(
    type: Ev & string,
    listener: (payload: v.InferOutput<TReceiveEvents[Ev]>) => void,
    options?: EventListenerOptions,
  ) {
    const wrapped = this.listenerMap.get(type)?.get(listener);
    if (!wrapped) return;
    this.channel.removeEventListener("message", wrapped, options);
  }
  when<Ev extends keyof TReceiveEvents>(
    type: Ev & string,
    options?: ObservableEventListenerOptions,
  ): Observable<v.InferOutput<TReceiveEvents[Ev]>> {
    const schema = this.receive[type];
    if (!schema) throw new Error(`No schema for event ${type}`);
    return this.channel.when("message", options).flatMap((event) => {
      const parsed = v.safeParse(messageSchema, event.data);
      if (!parsed.success || parsed.output.type !== type) return [];
      const payload = v.safeParse(schema, parsed.output.payload);
      return payload.success ? [payload.output] : [];
    });
  }
}

export const client = new TypedBroadcastChannel(
  events.client,
  events.worker,
  broadcastChannel,
);
export const worker = new TypedBroadcastChannel(
  events.worker,
  events.client,
  broadcastChannel,
);
