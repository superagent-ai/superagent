import Analytics from "analytics";
import segmentPlugin from "@analytics/segment";

export const analytics = Analytics({
  plugins: [
    segmentPlugin({
      writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    }),
  ],
});
