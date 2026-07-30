import { readFile, writeFile } from "node:fs/promises";

const reference = await readFile("/private/tmp/ork-video-reference.png");
const image = reference.toString("base64");
const request = {
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: {
      name: "create_video_kling_2_1_std",
      arguments: {
        duration: "10",
        cfg_scale: "0.65",
        image,
        prompt: "The violet wireframe organism assembles from particles and fine data lines. Its bright white-violet energy core ignites and sends subtle pulses through the mesh. Technical orbital rings rotate slowly in depth. The organism breathes and glides almost imperceptibly. Slow controlled camera push-in with subtle parallax, sophisticated minimal luxury technology art direction, seamless loop feeling, no cuts.",
        negative_prompt: "text, typography, letters, words, logo, watermark, UI, dashboard, buttons, people, human, cartoon, rainbow, red, orange, green, low resolution, pixelated, blurry, fast camera, shaky camera, abrupt cuts, generic stock footage, city, photorealistic animal, clutter, overexposure",
      },
    },
  };
await writeFile("/private/tmp/ork-magnific-request.json", JSON.stringify(request));
console.log("/private/tmp/ork-magnific-request.json");
