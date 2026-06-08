/* global AudioWorkletProcessor, registerProcessor, sampleRate */

/*
 * Varispeed tape head: reads the loaded buffer at a signed per-sample rate.
 * rate 1 = normal speed, 0 = frozen, negative = reverse (scratching).
 * Plain JS with zero imports — AudioWorklet modules load outside the bundler
 * graph (see use-tape-deck.ts). Message shapes mirror tape-messages.ts.
 */
class TapeProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: "rate", defaultValue: 0, automationRate: "a-rate" }];
  }

  constructor() {
    super();
    this.channels = null;
    this.position = 0;
    this.endedNotified = false;
    this.blocksSincePost = 0;
    this.lastPostedPosition = -1;
    this.port.onmessage = ({ data }) => {
      if (data.type === "load") {
        this.channels = data.channels;
        this.position = 0;
        this.endedNotified = false;
      } else if (data.type === "seek") {
        this.position = data.position;
        this.endedNotified = false;
      }
    };
  }

  process(_inputs, outputs, parameters) {
    const output = outputs[0];
    if (!this.channels) return true;

    const rate = parameters.rate;
    const last = this.channels[0].length - 1;

    for (let i = 0; i < output[0].length; i++) {
      const r = rate.length > 1 ? rate[i] : rate[0];
      const pos = this.position;
      if (pos >= 0 && pos < last) {
        // linear interpolation between the two neighbouring samples
        const i0 = Math.floor(pos);
        const f = pos - i0;
        for (let c = 0; c < output.length; c++) {
          const data = this.channels[Math.min(c, this.channels.length - 1)];
          output[c][i] = data[i0] * (1 - f) + data[i0 + 1] * f;
        }
      } else {
        for (let c = 0; c < output.length; c++) output[c][i] = 0;
      }
      this.position = Math.max(0, Math.min(last, pos + r));
    }

    // report the playhead ~10×/s when it moves — the screen's counter only
    // needs second granularity, and the worklet is the position's one truth
    if (++this.blocksSincePost >= 32) {
      this.blocksSincePost = 0;
      if (this.position !== this.lastPostedPosition) {
        this.lastPostedPosition = this.position;
        this.port.postMessage({
          type: "position",
          seconds: this.position / sampleRate,
        });
      }
    }

    if (this.position >= last) {
      if (!this.endedNotified) {
        this.endedNotified = true;
        this.port.postMessage({ type: "ended" });
      }
    } else {
      this.endedNotified = false;
    }
    return true;
  }
}

registerProcessor("tape-processor", TapeProcessor);
