import { getOrInsert, getOrInsertComputed } from "@schema-benchmarks/utils";
import * as v from "valibot";

const events = {
  client: {
    greeting: v.string(),
  },
  worker: {
    response: v.string(),
  },
} satisfies Record<"client" | "worker", Record<string, v.GenericSchema>>;

const messageSchema = v.object({
  from: v.picklist(["client", "worker"]),
  type: v.string(),
  payload: v.unknown(),
});

const broadcastChannel = new BroadcastChannel("benchmarks");

class TypedBroadcastChannel<
  TSendEvents extends Record<string, v.GenericSchema>,
  TReceiveEvents extends Record<string, v.GenericSchema>,
> {
  constructor(
    private iam: "client" | "worker",
    _send: TSendEvents,
    private receive: TReceiveEvents,
    private channel: BroadcastChannel,
  ) {}
  postMessage<Ev extends keyof TSendEvents>(
    type: Ev & string,
    payload: v.InferInput<TSendEvents[Ev]>,
  ) {
    this.channel.postMessage({
      from: this.iam,
      type,
      payload,
    });
  }
  listenerMap = new Map<
    keyof TReceiveEvents,
    WeakMap<
      (payload: v.InferOutput<TReceiveEvents[keyof TReceiveEvents]>) => void,
      (event: MessageEvent) => void
    >
  >();
  addEventListener<Ev extends keyof TReceiveEvents>(
    type: Ev & string,
    listener: (payload: v.InferOutput<TReceiveEvents[Ev]>) => void,
    options?: AddEventListenerOptions,
  ) {
    const listenerMap = getOrInsertComputed(
      this.listenerMap,
      type,
      () => new WeakMap(),
    );
    this.channel.addEventListener(
      "message",
      getOrInsert(listenerMap, listener, (event) => {
        const data = event.data;
        const parsed = v.safeParse(messageSchema, data);
        if (!parsed.success || parsed.output.from === this.iam) return;
        if (parsed.output.type !== type) return;
        // biome-ignore lint/style/noNonNullAssertion: type === parsed.output.type
        const payload = v.safeParse(this.receive[type]!, parsed.output.payload);
        if (!payload.success) return;
        listener(payload.output);
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
}

export const client = new TypedBroadcastChannel(
  "client",
  events.client,
  events.worker,
  broadcastChannel,
);
export const worker = new TypedBroadcastChannel(
  "worker",
  events.worker,
  events.client,
  broadcastChannel,
);
